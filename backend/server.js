const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");
app.use(helmet());
// FRONTEND_URL may hold several comma-separated origins (e.g. GitHub Pages + localhost).
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication requests. Please try again later." },
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many chat requests. Please try again later." },
});

const analyzeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: Number(process.env.ANALYZE_RATE_LIMIT) || 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many analysis requests. Please try again later." },
});

app.use("/api/analyze", analyzeLimiter, require("./routes/analyze"));
app.use("/api/content", require("./routes/content"));
// Database-backed routes answer 503 quickly instead of hanging when MongoDB is not connected.
const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  return res.status(503).json({ success: false, message: "Database is not available right now. Please try again later." });
};
for (const path of ["/api/auth", "/api/quiz", "/api/feedback", "/api/scam-report"]) app.use(path, requireDB);

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/chat", chatLimiter);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/scam-report", require("./routes/scamReport"));

app.get("/", (req, res) => res.json({ success: true, message: "CyberRakshak Backend Running Successfully 🚀", version: "1.1.0" }));
app.get("/health", (req, res) => res.json({ success: true, status: "ok", service: "CyberRakshak API", database: mongoose.connection.readyState === 1 ? "connected" : "unavailable" }));

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ success: false, message: status >= 500 ? "Internal server error" : err.message });
});

// Start serving immediately: the analyser and content APIs do not need MongoDB.
const start = async () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB unavailable, database routes will return 503:", error.message);
  }
};

if (require.main === module) start();

module.exports = app;
