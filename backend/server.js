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
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

const createLimiter = (limit, message) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message },
});

app.use("/api/auth/login", createLimiter(50, "Too many authentication requests. Please try again later."));
app.use("/api/auth/register", createLimiter(50, "Too many authentication requests. Please try again later."));
app.use("/api/chat", createLimiter(60, "Too many chat requests. Please try again later."));
app.use("/api/scan", createLimiter(40, "Too many scan requests. Please try again later."));
app.use("/api/incidents", createLimiter(30, "Too many incident requests. Please try again later."));
app.use("/api/verify", createLimiter(30, "Too many verification requests. Please try again later."));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/scan", require("./routes/scan"));
app.use("/api/scan/url", require("./routes/urlScan"));
app.use("/api/incidents", require("./routes/incidents"));
app.use("/api/verify/social", require("./routes/socialVerification"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/scam-report", require("./routes/scamReport"));

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

if (require.main === module) start();

module.exports = app;
