import { NextResponse } from "next/server";
import crypto from "crypto";

const DEFAULT_TTL = 60 * 60; // ساعة
const MAX_TTL = 60 * 60 * 24; // 24 ساعة

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const videoId = url.searchParams.get("videoId");
    const ttlParam = parseInt(url.searchParams.get("ttl") || `${DEFAULT_TTL}`, 10);

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    const libraryId = process.env.BUNNY_LIBRARY_ID;
    const signingKey = process.env.BUNNY_SIGNING_KEY;

    if (!libraryId || !signingKey) {
      return NextResponse.json(
        { error: "Missing BUNNY_LIBRARY_ID or BUNNY_SIGNING_KEY" },
        { status: 500 }
      );
    }

    const expires = Math.floor(Date.now() / 1000) + Math.min(ttlParam, MAX_TTL);
    const stringToSign = `${signingKey}${videoId}${expires}`;
    const signature = crypto.createHash("sha256").update(stringToSign).digest("hex");
    const iframeUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${signature}&expires=${expires}`;

    return NextResponse.json({
      token: signature,
      expires,
      iframeUrl,
      expiresAt: new Date(expires * 1000).toISOString(),
    });

  } catch (err: unknown) {
    console.error("Error generating Bunny token:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}