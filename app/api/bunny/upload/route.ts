import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const guid = form.get("guid") as string;

    if (!file || !guid)
      return NextResponse.json({ error: "Missing file or video guid" }, { status: 400 });

    const libraryId = process.env.BUNNY_LIBRARY_ID!;
    const apiKey = process.env.BUNNY_API_KEY!;

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`;
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: apiKey,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

    return NextResponse.json({ success: true, guid });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
