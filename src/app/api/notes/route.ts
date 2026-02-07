import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// --- 1. CONFIGURATION ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const geminiKey = process.env.GEMINI_API_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const genAI = new GoogleGenerativeAI(geminiKey);

  try {
    const body = await req.json();
    const { title, content, type, tags } = body;

    // --- 2. GENERATE SUMMARY (Using your working model) ---
    // We use gemini-2.5-flash because that's what your key supports!
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    let summary = "";
    
    try {
      const prompt = `
        Summarize the following note in exactly one short, punchy sentence (max 15 words).
        Do not use "This note is about...". Just state the core idea.
        
        Title: ${title}
        Content: ${content}
      `;
      
      const result = await model.generateContent(prompt);
      summary = result.response.text().trim();
    } catch (aiError) {
      console.error("AI Summary Failed:", aiError);
      // Fallback: If AI fails, use the first 100 chars of content
      summary = content.slice(0, 100) + "...";
    }

    // --- 3. SAVE TO DATABASE ---
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          title,
          content,
          type,
          tags,
          summary, // <--- Saving the generated summary
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Create Note Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}