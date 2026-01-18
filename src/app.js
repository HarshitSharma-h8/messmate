import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/Auth.routes.js";
import messRoutes from "./routes/Mess.routes.js";
import eventRoutes from "./routes/Event.routes.js";
import tokenRoutes from "./routes/Token.routes.js";
import adminRoutes from "./routes/Admin.routes.js";



const app = express();

/* ---------- Global Middlewares ---------- */
app.use(cors());
app.use(express.json());





/* ---------- Routes ---------- */
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/mess", messRoutes);

app.use("/api/v1/events", eventRoutes);

app.use("/api/v1/tokens", tokenRoutes);

app.use("/api/v1/admin", adminRoutes);









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
