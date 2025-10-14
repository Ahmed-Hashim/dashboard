import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const libraryId = process.env.BUNNY_LIBRARY_ID!;
    const apiKey = process.env.BUNNY_API_KEY!;

    const res = await axios.post(
      `https://video.bunnycdn.com/library/${libraryId}/videos`,
      { title },
      {
        headers: {
          AccessKey: apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const { guid } = res.data;

    return NextResponse.json({
      guid,
      uploadUrl: `https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`,
      playbackUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${guid}`,
    });
  } catch (err: unknown) {
    console.error("Create Bunny video error:", (err as { response?: { data?: unknown }; message?: string }).response?.data || (err as { message?: string }).message);
    return NextResponse.json({ error: "Failed to create Bunny video" }, { status: 500 });
  }
}
