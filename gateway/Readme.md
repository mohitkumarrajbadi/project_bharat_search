This is basic structure how the gateway structure is going to work

gateway/
├── src/
│   ├── index.ts              # Entry point (create server, attach middleware, mount routes)
│   ├── config/               # Env config, constants
│   ├── middleware/           # Auth, CORS, logging, error handling
│   ├── routes/               # All routes (search, weather, finance, etc.)
│   ├── controllers/          # Route handlers (business logic)
│   ├── services/             # Calls to orchestrator/agents
│   ├── utils/                # Helper functions (token parser, formatters, etc.)
│   └── tests/                # Unit/integration tests
├── package.json
├── tsconfig.json
└── .env

Basic Flow
----------

Frontend (Next.js)
       │
       ▼
┌─────────────────────────────┐
│  index.ts (Entry Point)     │
│  - Creates Express app      │
│  - Loads middleware         │
│  - Mounts routes            │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Middleware Layer           │
│  - Logging (e.g. morgan)    │
│  - CORS                     │
│  - Helmet Security          │
│  - Auth/JWT verification    │
│  - Rate Limiting            │
│  - Request parsing          │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Routes Layer (Router)      │
│  - /search                  │
│  - /weather                 │
│  - /sports                  │
│  - /finance                 │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Controllers                │
│  - Handle business logic    │
│  - Call orchestrator or     │
│    microservices            │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Services/Orchestrator API  │
│  - Makes request to         │
│    appropriate agent        │
│    (e.g., weather-agent)    │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Agents / Microservices     │
│  - Fetch real data          │
│  - Return response          │
└─────────────────────────────┘
       │
       ▼
Frontend receives JSON response
