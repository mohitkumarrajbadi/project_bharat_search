import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// ====== CONFIG ======
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || "http://localhost:8000";

const WEATHER_API = process.env.WEATHER_API || "https://api.weatherapi.com/v1";
const FINANCE_API = process.env.FINANCE_API || "https://api.coindesk.com/v1";
const SPORTS_API = process.env.SPORTS_API || "https://api.thesportsdb.com/v1/json/3";
const FARMER_API = process.env.FARMER_API || "https://api.data.gov.in/resource";
const HEALTH_API = process.env.HEALTH_API || "https://api.publicapis.org";
const EDUCATION_API = process.env.EDUCATION_API || "https://api.data.gov.in/resource";

// ====== MIDDLEWARE ======
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const API_PREFIX = "/api";

app.get(`${API_PREFIX}/health`, (_req, res) => {
  res.status(200).json({ status: "OK", message: "Gateway is running 🚀" });
});

app.get(`${API_PREFIX}/search`, async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "query param missing" });

    const orchestratorRes = await fetch(`${ORCHESTRATOR_URL}/search?q=${encodeURIComponent(query as string)}`);
    const data = await orchestratorRes.json();
    console.log("Response from orchestrator:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Error forwarding to orchestrator:", err);
    res.status(500).json({ error: "Gateway to orchestrator failed" });
  }
});

app.get(`${API_PREFIX}/weather`, async (req: Request, res: Response) => {
  try {
    const { city = "Delhi" } = req.query;
    const apiKey = process.env.WEATHER_API_KEY || "demo";
    const url = `${WEATHER_API}/current.json?key=${apiKey}&q=${encodeURIComponent(city as string)}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json({ source: "WeatherAPI", city, data });
  } catch (err) {
    console.error("❌ Weather API error:", err);
    res.status(500).json({ error: "Failed to fetch weather updates" });
  }
});

app.get(`${API_PREFIX}/finance`, async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${FINANCE_API}/bpi/currentprice.json`);
    const data = await response.json();
    res.json({ source: "CoinDesk", data });
  } catch (err) {
    console.error("❌ Finance API error:", err);
    res.status(500).json({ error: "Failed to fetch finance data" });
  }
});

app.get(`${API_PREFIX}/sports`, async (req: Request, res: Response) => {
  try {
    const { team = "India" } = req.query;
    const url = `${SPORTS_API}/searchteams.php?t=${encodeURIComponent(team as string)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json({ source: "TheSportsDB", team, data });
  } catch (err) {
    console.error("❌ Sports API error:", err);
    res.status(500).json({ error: "Failed to fetch sports updates" });
  }
});

app.get(`${API_PREFIX}/farmers`, async (req: Request, res: Response) => {
  try {
    const { crop = "wheat" } = req.query;
    const resourceId = "9ef84268-d588-465a-a308-a864a43d0070"; // Example: MSP data
    const url = `${FARMER_API}/${resourceId}?format=json&filters[crop_name]=${encodeURIComponent(
      crop as string
    )}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json({ source: "data.gov.in", crop, data });
  } catch (err) {
    console.error("❌ Farmer API error:", err);
    res.status(500).json({ error: "Failed to fetch farmer info" });
  }
});

app.get(`${API_PREFIX}/health`, async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${HEALTH_API}/entries?category=Health`);
    const data = await response.json();
    res.json({ source: "publicapis.org", data });
  } catch (err) {
    console.error("❌ Health API error:", err);
    res.status(500).json({ error: "Failed to fetch health tips" });
  }
});

app.get(`${API_PREFIX}/education`, async (_req: Request, res: Response) => {
  try {
    const resourceId = "c8d7221e-fcf7-40ed-931f-ef9f36c4a5a5"; // Example: India school data
    const url = `${EDUCATION_API}/${resourceId}?format=json`;

    const response = await fetch(url);
    const data = await response.json();
    res.json({ source: "data.gov.in", data });
  } catch (err) {
    console.error("❌ Education API error:", err);
    res.status(500).json({ error: "Failed to fetch education info" });
  }
});


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Gateway running on http://localhost:${PORT}`));
