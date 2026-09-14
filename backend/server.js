const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many authentication requests. Please try again later." } });
const analysisLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many analysis requests. Please try again shortly." } });
const explanationLimiter = rateLimit({ windowMs: 60 * 1000, limit: 12, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many AI explanation requests. Please try again shortly." } });
const threatLimiter = rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many threat intelligence requests. Please try again shortly." } });
const multimodalLimiter = rateLimit({ windowMs: 60 * 1000, limit: 8, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many image analysis requests. Please try again shortly." } });
const incidentLimiter = rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many incident requests. Please try again shortly." } });
const intelligenceLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many intelligence requests. Please try again shortly." } });

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/scam-report", require("./routes/scamReport"));
app.use("/api/analyze", analysisLimiter, require("./routes/analyze"));
app.use("/api/explain", explanationLimiter, require("./routes/explain"));
app.use("/api/threats", threatLimiter, require("./routes/threats"));
app.use("/api/multimodal", multimodalLimiter, require("./routes/multimodal"));
app.use("/api/incidents", incidentLimiter, require("./routes/incidents"));
app.use("/api/intelligence", intelligenceLimiter, require("./routes/intelligence"));

app.get("/", (req, res) => res.json({ success: true, message: "CyberRakshak Backend Running Successfully 🚀", version: "2.0.0" }));
app.get("/health", (req, res) => res.json({ success: true, status: "ok", service: "CyberRakshak API", version: "2.0.0" }));
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ success: false, message: status >= 500 ? "Internal server error" : err.message });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

if (require.main === "module") start();
module.exports = app;
