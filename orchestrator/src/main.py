import os
import certifi
import logging
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
from ddgs import DDGS

# agents import
from agents.weather_agent import WeatherAgent

from agents.web_search_agent import WebSearchAgent

# Ensure HTTP clients use certifi bundle
os.environ.setdefault("SSL_CERT_FILE", certifi.where())
os.environ.setdefault("REQUESTS_CA_BUNDLE", certifi.where())

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("orchestrator")

app = FastAPI(title="BharatSearch Orchestrator")



# CORS Middleware — only allow gateway/known origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],  # Gateway origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(q: str = Query(..., description="Search query")):
    """Perform a search via DuckDuckGo, with fallback to lite API."""
    try:
        web_search_agent = WebSearchAgent()
        return await web_search_agent.search(q)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error("Search failed: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error") from e

@app.get("/weather")
async def get_weather(lat: float = Query(...), lon: float = Query(...)):
    """Call the weather agent to get weather info."""
    try:
        weather_agent = WeatherAgent(api_key=os.getenv("OPENWEATHER_API_KEY", "your_api_key_here"))
    except Exception as e:
        logger.error("Weather fetch failed: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error") from e
    return await weather_agent.get_weather(lat, lon)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
