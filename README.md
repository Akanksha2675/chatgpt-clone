# ChatGPT Clone

A ChatGPT-style chat app with retrieval-augmented generation (RAG): upload a PDF or paste a URL, and the assistant grounds its answers in that content.

## Stack

**Frontend** — React 19 + TypeScript + Vite, Tailwind CSS v4, Hugeicons, markdown-it, `@microsoft/fetch-event-source` for streamed responses.

**Backend** — Node.js + Express 5, Groq SDK (chat completions), Pinecone (vector store + integrated embeddings), LangChain text splitters, `pdf-parse` for PDF text extraction, Cheerio for web page scraping.

## Project structure

```
.
├── backend/
│   ├── server.js
│   └── src/
│       ├── routes/
│       │   ├── chat.js          # /chat and /chat-stream
│       │   └── document.js      # /documents/ingest
│       └── services/
│           ├── groq.ts          # chat + streaming completions
│           ├── gemini.ts
│           ├── pinecone.ts       # index creation, upsert, similarity search
│           ├── documentLoader.ts # fetches + parses a URL into Documents
│           └── documentProcessor.ts # splits documents into chunks
└── chatgpt-clone/                # frontend (Vite app)
    └── src/
        ├── App.tsx
        ├── components/
        │   ├── Sidebar.tsx       # PDF/URL ingestion panel
        │   ├── MessagesContainer.tsx
        │   └── Composer.tsx
        ├── hooks/useChat.tsx
        └── api/chat.ts
```

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Rename `.env.example` to `.env` and fill in:

```
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

- Get a Groq key at [console.groq.com](https://console.groq.com).
- Get a Pinecone key at [app.pinecone.io](https://app.pinecone.io). The backend auto-creates an index named `rag-project` using Pinecone's integrated `llama-text-embed-v2` embedding model on first ingest — no separate embedding API key needed, but your Pinecone plan must support integrated inference.

Start the server:

```bash
npm run dev
```

Runs on `http://localhost:3000`.

### 2. Frontend

```bash
cd chatgpt-clone
npm install
npm run dev
```

Runs on `http://localhost:5173` (or the port Vite prints) and expects the backend at `http://localhost:3000`.

## Usage

1. Open the app and use the sidebar to upload a PDF, paste a URL, or both, then click **Ingest**.
2. Once ingestion succeeds, ask questions in the chat — responses are grounded in the ingested content where relevant.
3. Switch models from the dropdown in the message composer (`llama-3.1-8b-instant`, `llama-3.3-70b-versatile`, `openai/gpt-oss-120b`).

## Troubleshooting

- **"Ingestion failed"** — almost always a missing/invalid `PINECONE_API_KEY`, or a Pinecone plan that doesn't support integrated embeddings. Check the backend terminal for the logged error.
- **Chat requests fail** — confirm `GROQ_API_KEY` is set and the backend is running on port `3000`.
- **CORS errors** — the backend allows all origins via the `cors` package by default; if you change ports, update `BASE` in `chatgpt-clone/src/api/chat.ts`.
