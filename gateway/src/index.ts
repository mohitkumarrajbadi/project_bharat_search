import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "http://localhost:8000";

app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const API_PREFIX = "/api";

// Health check
app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.status(200).json({ status: "OK", message: "Gateway is running 🚀" });
});

// Forward /search to orchestrator
app.get(`${API_PREFIX}/search`, async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "query param missing" });

    // Call orchestrator
    const orchestratorRes = await fetch(`${ORCHESTRATOR_URL}/search?q=${encodeURIComponent(query as string)}`);
    const data = await orchestratorRes.json();

    res.json(data);
  } catch (err) {
    console.error("❌ Error forwarding to orchestrator:", err);
    res.status(500).json({ error: "Gateway to orchestrator failed" });
  }
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Gateway running on http://localhost:${PORT}`));
