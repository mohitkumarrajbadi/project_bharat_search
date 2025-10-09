import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(helmet());

// Allow requests only from your frontend origin
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// 🌐 API Routes prefix
const API_PREFIX = "/api";

// 🧭 Health check
app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Gateway is up and running 🚀" });
});

// 🧭 Search route
app.get(`${API_PREFIX}/search`, (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Search endpoint active ✅" });
});

// 🧪 Test route
app.get(`${API_PREFIX}/test`, (req: Request, res: Response) => {
  res.status(200).json({ message: "Test route working ✅" });
});

// ❌ Global Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🌍 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Gateway server running on http://localhost:${PORT}`);
});
