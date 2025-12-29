# BharatSearch 🚀

**Next-Generation AI-Powered Hybrid Search Engine for India**

BharatSearch is an **AI-native hybrid search platform** combining **LLM-driven reasoning** with **traditional web indexing**. Optimized for **India-first use cases**, it supports **regional languages**, **low-latency queries**, and **scalable multi-agent orchestration**.

---

## 🌟 Features

* **Hybrid Search:** Combines **vector-based retrieval** with **LLM synthesis** for factual + contextual results.
* **Multi-Agent Architecture:** Specialized agents handle **weather, finance, cricket, travel**, etc.
* **Generative AI:** Supports **RAG (Retrieval-Augmented Generation)** using OpenAI, HuggingFace, or custom LLMs.
* **Real-Time & Fault-Tolerant:** Designed for **millions of concurrent queries**, with **auto-scaling and self-healing** microservices.
* **India-First Optimizations:**

  * Regional language embeddings (Hindi, Tamil, Bengali, etc.)
  * Edge-cached responses across Indian regions
  * BharatQueryRank: local relevance ranking

---

## 🧱 Architecture Overview

```
User → Gateway → Orchestrator → Agents → LLM + Vector DB → Response
```

1. **Gateway**: Handles authentication, rate limiting, routing, and caching.
2. **Orchestrator**: Coordinates agents, routes tasks, aggregates responses.
3. **Agents**: Autonomous microservices (Python/Go/Node) for domain-specific queries.
4. **LLM & RAG Engine**: Combines retrieved context with generative reasoning.
5. **Vector Retrieval**: FAISS / Milvus-based semantic search.
6. **Cache Layer**: Redis for fast repeated queries.
7. **Database & Streaming**: Postgres, Kafka, and ClickHouse for persistence & analytics.
8. **Observability**: Prometheus, Grafana, OpenTelemetry for metrics & monitoring.


## 📈 Scalability & Performance

* Target **<800ms end-to-end latency**
* **100M+ concurrent requests** capability
* Fault-tolerant agent design with **automatic restart & failover**
* Multi-region deployment (AWS Mumbai + Hyderabad)

---

## 🛠 Installation / Local Setup (Developer Mode)

> ⚠️ This is an advanced distributed system. For development, start with the core MVP agents.

```bash
# -------------------------------
# 1. Clone the repository
# -------------------------------
git clone https://github.com/mohitkumarrajbadi/project_bharat_search.git
cd BharatSearch


# -------------------------------
# 2. Setup Frontend (Next.js)
# -------------------------------
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000

cd ..


# -------------------------------
# 3. Setup Gateway (Go)
# -------------------------------
cd gateway
go mod tidy
go run main.go
# Runs on http://localhost:8080

cd ..


# -------------------------------
# 4. Setup Orchestrator (Python)
# -------------------------------
cd orchestrator

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn src.main:app --reload --port 8000
# Runs on http://localhost:8000

```


---

## 🚀 Roadmap

1. **MVP** – Core engine + Weather, Finance, Cricket agents
2. **Phase 2** – Multi-modal search: voice + images
3. **Phase 3** – Bharat Knowledge Graph & entity linking
4. **Phase 4** – Federated LLM training on Indian corpus
5. **Phase 5** – Developer SDK + public API

---

## 👥 Contributing

* Add new agents or improve existing LLM/RAG pipelines
* Optimize regional embeddings and caching strategies
* Report bugs or propose features via GitHub Issues
* Ensure contributions follow **modular, containerized design**

---

## 📄 License

MIT License © 2025 Mohit Kumar Raj Badi

---

## 🔗 Links

* [LinkedIn](https://www.linkedin.com/in/mohitkumarrajbadi/)



