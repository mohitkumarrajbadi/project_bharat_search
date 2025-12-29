import json
# import aiohttp
# import aioredis
from typing import Dict


class WeatherAgent:
    """Agent to fetch weather information with Redis caching."""

    def __init__(self, api_key: str, redis_url: str = "redis://localhost:6379"):
        self.api_key = api_key
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"
        self.redis_url = redis_url

    # async def _get_redis(self):
    #     """Get a Redis connection (auto-reused)."""
    #     if not hasattr(self, "_redis"):
    #         self._redis = await aioredis.from_url(self.redis_url, decode_responses=True)
    #     return self._redis

    # def _geohash_key(self, lat: float, lon: float) -> str:
    #     """Round coordinates for caching key."""
    #     return f"weather:{round(lat, 1)}:{round(lon, 1)}"

    async def get_weather(self, lat: float, lon: float) -> Dict:
        """Fetch weather from Redis cache or OpenWeather API."""
        # key = self._geohash_key(lat, lon)
        # redis = await self._get_redis()

        # # 1️⃣ Try cache first
        # cached = await redis.get(key)
        # if cached:
        #     return json.loads(cached)

        # # 2️⃣ Cache miss → Fetch from OpenWeather
        # async with aiohttp.ClientSession() as session:
        #     async with session.get(
        #         self.base_url,
        #         params={"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"},
        #     ) as resp:
        #         if resp.status != 200:
        #             raise Exception(f"OpenWeather API error {resp.status}")
        #         data = await resp.json()

        # await redis.setex(key, 1800, json.dumps(data))

        # return data
        pass
