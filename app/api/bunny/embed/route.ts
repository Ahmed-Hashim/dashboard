import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// This function handles POST requests to /api/get-bunny-url (or wherever you place it)
export async function POST(req: NextRequest) {
  try {
    // 1. Get the videoId from the request body
    const { videoId } = await req.json();

    if (!videoId) {
      // Return a 400 Bad Request error if videoId is missing
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    // 2. Load your Bunny.net credentials from environment variables
    const libraryId = process.env.BUNNY_LIBRARY_ID;
    const tokenKey = process.env.BUNNY_STREAM_API_KEY;

    // Check if the environment variables are set
    if (!libraryId || !tokenKey) {
      console.error("Bunny.net credentials are not set in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error: Bunny credentials missing." },
        { status: 500 }
      );
    }

    // 3. Set an expiration time for the token (e.g., 1 hour from now)
    const expires = Math.floor(Date.now() / 1000) + 3600;

    // 4. Create the signature string in the CORRECT order
    // This is the critical fix: Library ID + Security Key + Expiration + Video ID
    const stringToSign = libraryId + tokenKey + expires.toString() + videoId;

    // 5. Hash the string using SHA-256
    const token = crypto.createHash("sha256").update(stringToSign).digest("hex");

    // 6. Construct the final secure iframe URL
    const iframeUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}`;

    // 7. Send the URL back to the client
    return NextResponse.json({ iframeUrl });
    
  } catch (err) {
    console.error("Error creating Bunny.net signed URL:", err);
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}