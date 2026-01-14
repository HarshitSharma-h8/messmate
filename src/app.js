import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

/* ---------- Global Middlewares ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Health Check Route ---------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Mess Management Backend is running",
  });
});

/* ---------- Health API (better for monitoring) ---------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    statusCode: 404,
  });
});

// Global error handler (LAST)
app.use(errorHandler);

export default app;
