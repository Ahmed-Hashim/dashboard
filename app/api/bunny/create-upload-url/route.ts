import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const libraryId = process.env.BUNNY_LIBRARY_ID;
    const apiKey = process.env.BUNNY_API_KEY;

    if (!libraryId || !apiKey) {
      return NextResponse.json({ error: "Missing Bunny credentials" }, { status: 500 });
    }

    // 🧠 Step 1: Create empty video record on Bunny
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

    // 🧠 Step 2: Return upload URL for direct client upload
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`;

    return NextResponse.json({ uploadUrl, guid, libraryId }, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating Bunny upload URL:", (err as { response?: { data?: unknown } }).response?.data || (err as { message?: string }).message);
    return NextResponse.json(
      { error: (err as { response?: { data?: { message?: string } } }).response?.data?.message || (err as { message?: string }).message || "Failed to create upload URL." },
      { status: 500 }
    );
  }
}
