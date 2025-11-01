import logging
from typing import Any

from duckduckgo_search import DDGS
from fastapi import HTTPException
from starlette.concurrency import run_in_threadpool

logger = logging.getLogger(__name__)


class WebSearchAgent:
    def __init__(self, search_api: Any = None):
        self.search_api = search_api

    async def search(self, q: str) -> Any:
        """
        Perform a web search for query `q` using DuckDuckGo.
        Tries the primary 'api' backend first, falls back to 'lite' if it fails.
        Raises HTTPException on invalid queries or if both backends fail.
        """
        if not q or not q.strip():
            raise HTTPException(status_code=400, detail="Query parameter 'q' cannot be empty")

        # If an external search_api is provided and exposes an async or sync perform_search,
        # prefer using it.
        if self.search_api:
            try:
                perform = getattr(self.search_api, "perform_search", None)
                if perform:
                    # If perform_search is a coroutine function, await it; otherwise run in threadpool.
                    if callable(perform) and getattr(perform, "__call__", None):
                        if getattr(perform, "__code__", None) and perform.__code__.co_flags & 0x80:
                            # coroutine function detected (co_flags & 0x80)
                            return await perform(q)
                        else:
                            return await run_in_threadpool(lambda: perform(q))
            except Exception as api_err:
                logger.warning("External search_api failed: %s. Falling back to DDGS. ", api_err)

        try:
            def ddg_call():
                with DDGS() as ddgs:
                    return list(ddgs.text(q, max_results=10, backend="api"))

            results = await run_in_threadpool(ddg_call)
            return {"query": q, "results": results}

        except Exception as primary_err:
            logger.warning("Primary DDGS API failed: %s", primary_err)
            try:
                def ddg_fallback():
                    with DDGS() as ddgs:
                        return list(ddgs.text(q, max_results=10, backend="lite"))

                results = await run_in_threadpool(ddg_fallback)
                return {
                    "query": q,
                    "results": results,
                    "note": "Primary API backend failed; used lite fallback",
                    "primary_error": str(primary_err),
                }

            except Exception as fallback_err:
                logger.error("Both DDGS API and lite backends failed: %s", fallback_err)
                raise HTTPException(
                    status_code=500,
                    detail={
                        "error": "Both DDGS API and lite backends failed",
                        "primary_error": str(primary_err),
                        "fallback_error": str(fallback_err),
                    },
                )
