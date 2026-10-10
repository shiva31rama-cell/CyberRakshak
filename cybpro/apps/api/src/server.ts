import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { analyzeText } from "./analyze.js";

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

const inputSchema = z.object({
  content: z.string().trim().min(1).max(12_000)
}).strict();

app.post("/api/v1/analyze/text", async (request, reply) => {
  const parsed = inputSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: "Provide a text field containing 1 to 12000 characters."
    });
  }
  return analyzeText(parsed.data.content);
});

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "127.0.0.1";

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}