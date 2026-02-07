# System Architecture

## High-Level Overview
The Second Brain is a full-stack Next.js 16 application leveraging a serverless architecture. It combines a strongly-typed frontend (TypeScript) with a relational database (Supabase/PostgreSQL) and a Generative AI layer (Google Gemini).

## Tech Stack
- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **Database:** Supabase (PostgreSQL)
- **AI/LLM:** Google Generative AI SDK (`gemini-2.5-flash`)
- **State Management:** React Hooks (`useState`, `useEffect`)

## Data Schema (Supabase)
The core entity is the `notes` table, designed for flexibility and searchability.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `title` | `text` | Header of the thought |
| `content` | `text` | Raw body text (Markdown supported) |
| `summary` | `text` | **AI-Generated** short description |
| `tags` | `text[]` | Array of strings for categorical filtering |
| `type` | `text` | Enum: `NOTE`, `LINK`, `INSIGHT` |
| `created_at` | `timestamp`| Sort key for timeline view |

## Data Flow Diagrams

### 1. Note Creation Flow
[Client] -> (POST Payload) -> [API Route /api/notes] 
                                    |
                                    +-> [Gemini AI] -> (Generate Summary)
                                    |
                                    +-> [Supabase] -> (Insert Row + Summary)
                                    |
            [Client UI] <---------- (Return New Note)

### 2. The "Second Brain" Chat Loop
[User Question] -> [API Route /api/chat]
                        |
                        +-> [Supabase] -> (SELECT * FROM notes)
                        |                      |
                        |              (Raw Data Injection)
                        |                      v
                        +-> [Gemini AI] -> (System Prompt + Notes + Question)
                                               |
            [Client UI] <------------------ (Synthesized Answer)