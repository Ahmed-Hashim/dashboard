import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { TablesInsert } from "@/types/database";

export async function POST(req: Request) {
  try {
    const { title, courseId, bunnyLibraryId, bunnyVideoId } = await req.json();

    if (!title || !courseId || !bunnyVideoId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newVideo: TablesInsert<"course_videos"> = {
      title,
      course_id: parseInt(courseId),
      bunny_library_id: bunnyLibraryId,
      bunny_video_id: bunnyVideoId,
      youtube_id: `bunny:${bunnyVideoId}`,
    };

    const { data, error } = await supabase
      .from("course_videos")
      .insert(newVideo)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error("Save error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to save video." }, { status: 500 });
  }
}
