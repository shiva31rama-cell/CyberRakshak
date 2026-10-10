import "dotenv/config";
import { buildApp } from "./app.js";

const app = await buildApp();
const port = Number(process.env.PORT ?? 4000);
// Listen on all interfaces only for trusted-network mobile testing.
// Do not expose this development preview API directly to the public internet.
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
