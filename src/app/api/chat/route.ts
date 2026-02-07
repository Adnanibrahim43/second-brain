import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Sanitize the Keys (Trim spaces)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (!supabaseUrl || !supabaseKey || !geminiKey) {
      throw new Error("Missing API Keys");
    }

    // 2. Initialize Clients
    const supabase = createClient(supabaseUrl, supabaseKey);
    const genAI = new GoogleGenerativeAI(geminiKey);

    // --- USE THIS EXACT MODEL ---
    // This is the current standard. If this fails, the Key is likely the issue.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    // ----------------------------

    const { message } = await req.json();

    // 3. Fetch notes (using correct lowercase names)
    const { data: notes, error } = await supabase
      .from("notes")
      .select("title, content, tags, type, created_at");

    if (error) throw new Error("Supabase Error: " + error.message);

    // 4. Create Context
    const knowledgeBase = notes?.map((note) => `
      Title: ${note.title}
      Content: ${note.content}
      Tags: ${note.tags?.join(", ")}
    `).join("\n---\n");

    const systemPrompt = `
      You are a Second Brain AI. Answer based ONLY on these notes:
      ${knowledgeBase}
      
      Question: ${message}
    `;

    // 5. Generate
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    return NextResponse.json({ reply: response });

  } catch (error: any) {
    console.error("Chat Error:", error.message);
    return NextResponse.json(
      { reply: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}