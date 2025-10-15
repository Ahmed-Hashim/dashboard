import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ videoId: string }> } // <-- params is a Promise
) {
  const { videoId } = await context.params; // <-- await it to get actual params

  const libraryId = process.env.BUNNY_LIBRARY_ID!;
  const apiKey = process.env.BUNNY_API_KEY!;

  try {
    // 1️⃣ Fetch video from Supabase
    const { data: video, error } = await supabase
      .from("course_videos")
      .select("bunny_video_id")
      .eq("id", videoId)
      .single();

    if (error || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // 2️⃣ Delete from BunnyCDN
    await axios.delete(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${video.bunny_video_id}`,
      {
        headers: {
          accept: "application/json",
          AccessKey: apiKey,
        },
      }
    );

    // 3️⃣ Delete from Supabase
    await supabase.from("course_videos").delete().eq("id", videoId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
