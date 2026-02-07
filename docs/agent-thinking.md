# Agentic Thinking & AI Strategy

## Core Philosophy
The "Second Brain" is not merely a passive storage container for data; it is designed as an active cognitive agent. The system leverages Generative AI (Google Gemini 2.5 Flash) to perform cognitive labor—summarization, synthesis, and retrieval—transforming raw data into actionable knowledge.

## AI Agent Capabilities

### 1. The Ingestion Agent (Proactive Synthesis)
Unlike traditional note-taking apps where data sits dormant until retrieved, the Second Brain acts immediately upon ingestion.
- **Trigger:** `POST /api/notes`
- **Action:** When a user captures a raw thought, the system intercepts the payload before database commit.
- **Cognitive Task:** It passes the content to the Gemini model with a strict instruction: *"Summarize the following note in exactly one short, punchy sentence."*
- **Value:** This converts unstructured brain dumps into scannable, high-level insights, reducing the cognitive load required to browse the dashboard later.

### 2. The Retrieval Agent (Context-Aware RAG)
The "Ask AI" chat feature functions as a Retrieval-Augmented Generation (RAG) agent.
- **Context Injection:** Instead of relying on pre-trained knowledge, the agent dynamically fetches the user's personal knowledge base from Supabase.
- **Grounding Strategy:** The system prompt enforces strict grounding rules: *"Answer based ONLY on the provided notes."*
- **Outcome:** This creates a "Private Oracle"—an AI that speaks with the user's own memory, allowing them to query their past selves (e.g., *"What did I learn about React hooks last month?"*).

## Technical Constraints & Safety
- **Hallucination Control:** By restricting the AI's context window strictly to the `notes` table data, we minimize fabrication.
- **Model Efficiency:** We utilize `gemini-2.5-flash` for its balance of speed (low latency for real-time chat) and reasoning capability, ensuring the "Second Brain" feels responsive, not sluggish.