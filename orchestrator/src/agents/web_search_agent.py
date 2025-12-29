import logging
import hashlib
import time
from typing import Any, Dict, List
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from ddgs import DDGS
from fastapi import HTTPException
from starlette.concurrency import run_in_threadpool

logger = logging.getLogger("bharat_search.web")

DEFAULT_PAGE_SIZE = 10
MAX_PAGE_SIZE = 20
ENRICH_TOP_K = 2

JUNK_DOMAINS = {
    "medium.com",
    "blogspot.com",
    "quora.com",
    "pinterest.com",
    "reddit.com",
}

JUNK_URL_TOKENS = ["tag", "category", "search", "?", "/amp"]


class WebSearchAgent:
    def __init__(self, search_api: Any = None):
        self.search_api = search_api

    # ------------------------------------------------------------------
    # Utils
    # ------------------------------------------------------------------

    def _make_id(self, url: str) -> str:
        return hashlib.sha1(url.encode()).hexdigest()

    def _domain(self, url: str) -> str:
        return urlparse(url).netloc.replace("www.", "")

    # ------------------------------------------------------------------
    # Relevance Scoring (CORE QUALITY)
    # ------------------------------------------------------------------

    def _relevance_score(self, query: str, title: str, desc: str, url: str) -> float:
        q = query.lower()
        title_l = title.lower()
        desc_l = desc.lower()

        score = 0.0

        # Strong signals
        if q in title_l:
            score += 4.0
        if q in desc_l:
            score += 2.5

        # Token-level signals
        for term in q.split():
            if term in title_l:
                score += 1.2
            if term in desc_l:
                score += 0.6

        # URL hygiene penalties
        if any(tok in url.lower() for tok in JUNK_URL_TOKENS):
            score -= 1.5

        return score

    # ------------------------------------------------------------------
    # Metadata Enrichment (SAFE)
    # ------------------------------------------------------------------

    def _fetch_metadata(self, url: str) -> Dict[str, Any]:
        try:
            resp = requests.get(
                url,
                timeout=2,
                headers={"User-Agent": "BharatSearchBot/1.0"},
            )
            soup = BeautifulSoup(resp.text, "html.parser")

            desc = soup.find("meta", attrs={"name": "description"})
            og_img = soup.find("meta", property="og:image")

            return {
                "meta_description": desc["content"].strip()
                if desc and desc.get("content")
                else None,
                "og_image": og_img["content"]
                if og_img and og_img.get("content")
                else None,
            }
        except Exception:
            return {}

    # ------------------------------------------------------------------
    # Normalize + Filter + Rank
    # ------------------------------------------------------------------

    def _normalize_and_rank(self, raw: List[Dict], query: str) -> List[Dict]:
        results = []

        for r in raw:
            url = r.get("href") or r.get("url")
            if not url:
                continue

            title = (r.get("title") or "").strip()
            desc = (r.get("body") or "").strip()

            if not title or len(title) < 5:
                continue

            domain = self._domain(url)

            # Drop junk domains early
            if domain in JUNK_DOMAINS:
                continue

            score = self._relevance_score(query, title, desc, url)

            # Hard precision filter
            if score < 1.5:
                continue

            results.append({
                "id": self._make_id(url),
                "title": title,
                "url": url,
                "description": desc,
                "domain": domain,
                "favicon": f"https://www.google.com/s2/favicons?domain={domain}&sz=64",
                "score": round(score, 2),
                "trust": {
                    "score": 0.9 if domain.endswith((".gov", ".edu")) else 0.6
                },
            })

        # Re-rank by relevance
        results.sort(key=lambda x: x["score"], reverse=True)

        return results

    # ------------------------------------------------------------------
    # Search API
    # ------------------------------------------------------------------

    async def search(self, q: str, page: int = 1, page_size: int = DEFAULT_PAGE_SIZE):
        if not q or not q.strip():
            raise HTTPException(400, "Query cannot be empty")

        page_size = min(page_size, MAX_PAGE_SIZE)
        offset = (page - 1) * page_size
        start = time.time()

        def ddg_call():
            with DDGS() as ddgs:
                return list(
                    ddgs.text(
                        q,
                        backend="auto",
                        max_results=offset + page_size + 10,  # recall boost
                    )
                )

        try:
            raw = await run_in_threadpool(ddg_call)

            ranked = self._normalize_and_rank(raw, q)
            page_results = ranked[offset: offset + page_size]

            # Enrich top K only (post-rank)
            for i in range(min(ENRICH_TOP_K, len(page_results))):
                meta = self._fetch_metadata(page_results[i]["url"])
                if not meta:
                    continue

                # Improve description ONLY if better
                if meta.get("meta_description") and (
                    len(meta["meta_description"])
                    > len(page_results[i]["description"])
                ):
                    page_results[i]["description"] = meta["meta_description"]

                if meta.get("og_image"):
                    page_results[i]["previewImage"] = meta["og_image"]

            latency = int((time.time() - start) * 1000)

            return {
                "query": q,
                "page": page,
                "page_size": page_size,
                "meta": {
                    "latency_ms": latency,
                    "engine": "duckduckgo+postrank",
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                },
                "results": page_results,
            }

        except Exception as e:
            logger.exception("search_failed", extra={"query": q})
            raise HTTPException(500, "Search service failed")
