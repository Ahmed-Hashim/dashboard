import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, courseId, bunnyVideoId , thumbnailUrl , duration } = body;
    const bunnyLibraryId=process.env.BUNNY_LIBRARY_ID!;
    
    if (!title || !courseId || !bunnyLibraryId || !bunnyVideoId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }



    const { data, error } = await supabase
      .from("course_videos")
      .insert([
        {
          title,
          course_id: courseId,
          bunny_library_id: bunnyLibraryId,
          bunny_video_id: bunnyVideoId,
          thumbnail_url: thumbnailUrl,
          duration: duration,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    console.error("Create Bunny video error:", (err as { response?: { data?: unknown }; message?: string }).response?.data || (err as { message?: string }).message);
    return NextResponse.json({ error: "Failed to save video record" }, { status: 500 });
  }
}
