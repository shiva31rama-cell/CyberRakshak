const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/scam-report", require("./routes/scamReport"));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "CyberRakshak Backend Running Successfully 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      quiz: "/api/quiz",
      feedback: "/api/feedback",
      scamReport: "/api/scam-report",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});