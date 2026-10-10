import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { analyzeText, analyzeUrl } from "./analyze.js";

const app = Fastify({
  logger: process.env.NODE_ENV !== "test",
  bodyLimit: 32 * 1024
});

await app.register(helmet);
await app.register(cors, {
  origin: process.env.WEB_ORIGIN ?? "http://localhost:5173"
});
await app.register(rateLimit, {
  max: 30,
  timeWindow: "1 minute"
});

app.get("/api/v1/health", async () => ({
  status: "ok",
  product: "CYBPRO",
  stage: "early-preview"
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
    return reply.code(400).send({
      error: "Provide a content field containing 1 to 12000 characters."
    });
  }
  return analyzeText(parsed.data.content);
});

app.post("/api/v1/analyze/url", async (request, reply) => {
  const parsed = urlSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: "Provide a url field containing 1 to 2048 characters."
    });
  }
  return analyzeUrl(parsed.data.url);
});

const port = Number(process.env.PORT ?? 4000);
// Listen on all interfaces for LAN-based mobile-device testing.
// Restrict access with network controls; do not expose this preview API publicly.
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
