import { NextRequest, NextResponse } from 'next/server';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const BUNNY_REGION = process.env.BUNNY_REGION || '';
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = BUNNY_REGION ? `${BUNNY_REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to BunnyCDN
    const url = `https://${HOSTNAME}/${BUNNY_STORAGE_ZONE}/${fileName}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        AccessKey: BUNNY_ACCESS_KEY,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`BunnyCDN upload error: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      fileName,
      url: `https://${process.env.BUNNY_CDN_URL}/${fileName}`,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}