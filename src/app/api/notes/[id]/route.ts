// src/app/api/notes/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// DELETE a note
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params for Next.js 15+ compatibility
    const { id } = await Promise.resolve(params);
    
    await db.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// UPDATE (Edit) a note
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body = await req.json();
    const { title, content } = body;

    const updatedNote = await db.note.update({
      where: { id },
      data: { title, content },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}