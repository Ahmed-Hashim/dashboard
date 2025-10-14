import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { videoId } = await req.json();
    if (!videoId) return NextResponse.json({ error: "Missing videoId" }, { status: 400 });

    const libraryId = process.env.BUNNY_LIBRARY_ID!;
    const signingKey = process.env.BUNNY_SIGNING_KEY!;
    const expires = Math.floor(Date.now() / 1000) + 3600;

    const signature = crypto
      .createHash("sha256")
      .update(libraryId + signingKey + expires + videoId)
      .digest("hex");

    const iframeUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${signature}&expires=${expires}`;

    return NextResponse.json({ iframeUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to sign playback URL" }, { status: 500 });
  }
}
