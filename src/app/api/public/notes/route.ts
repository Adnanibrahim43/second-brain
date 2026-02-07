// src/app/api/public/notes/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    // 1. Check for a Secret Key (Optional Security)
    // You can add ?key=my-secret-key to the URL to bypass this if you want restrictions.
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get("key");
    const secret = process.env.API_SECRET_KEY; // We'll add this to .env later

    // If you set a secret in .env, enforce it!
    if (secret && apiKey !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Notes (Optimized for Public View)
    // We select only specific fields to avoid leaking sensitive internal data (if any).
    const notes = await db.note.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        summary: true, // Show the AI summary, not full content
        tags: true,
        type: true,
        createdAt: true,
      },
    });

    // 3. Return JSON
    return NextResponse.json({
      count: notes.length,
      generated_at: new Date().toISOString(),
      data: notes,
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch public notes" }, { status: 500 });
  }
}