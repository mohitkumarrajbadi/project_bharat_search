import os
import certifi
import logging
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
from ddgs import DDGS

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
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query parameter 'q' cannot be empty")

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
