import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { analyzeText, analyzeUrl } from "./analyze.js";
import { checkUrlReputation } from "./reputation.js";

export async function buildApp(options: { logger?: boolean } = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: options.logger ?? process.env.NODE_ENV !== "test",
    bodyLimit: 32 * 1024
  });

  await app.register(helmet);
  const allowedOrigins = (process.env.WEB_ORIGINS ?? process.env.WEB_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  await app.register(cors, {
    origin: (origin, callback) => {
      // Native clients may not send an Origin header; browser origins must be allowlisted.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed"), false);
    }
  });
  await app.register(rateLimit, { max: 30, timeWindow: "1 minute" });

  app.get("/api/v1/health", async () => ({
    status: "ok",
    product: "CYBPRO",
    stage: "early-preview",
    urlReputation: process.env.GOOGLE_SAFE_BROWSING_API_KEY ? "configured" : "not_configured"
  }));

  const textSchema = z.object({
    content: z.string().trim().min(1).max(12_000)
  }).strict();
  const urlSchema = z.object({
    url: z.string().trim().min(1).max(2_048)
  }).strict();

  app.post("/api/v1/analyze/text", async (request, reply) => {
    const parsed = textSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Provide a content field containing 1 to 12000 characters." });
    }
    return analyzeText(parsed.data.content);
  });

  app.post("/api/v1/analyze/url", async (request, reply) => {
    const parsed = urlSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Provide a url field containing 1 to 2048 characters." });
    }

    const localReport = analyzeUrl(parsed.data.url);
    const reputation = await checkUrlReputation(parsed.data.url);
    return {
      ...localReport,
      reputation,
      caveat: reputation.status === "checked"
        ? `${localReport.caveat} The submitted URL was shared with Google Safe Browsing for a reputation lookup. A no-match result is not proof of safety.`
        : `${localReport.caveat} ${reputation.detail}`
    };
  });

  return app;
}
