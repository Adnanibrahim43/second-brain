import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Note the new type definition for params: it is now a Promise
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Change 1: params is a Promise
) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Change 2: You MUST await params before accessing .id
    const { id } = await params; 
    
    const body = await req.json();
    const { title, content, tags, type } = body;

    const { data, error } = await supabase
      .from("notes")
      .update({ title, content, tags, type })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Do the same for DELETE if you have it in this file
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    const { id } = await params; // Await here too!
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}