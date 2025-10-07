import { NextRequest, NextResponse } from 'next/server';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const BUNNY_REGION = process.env.BUNNY_REGION || '';
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = BUNNY_REGION ? `${BUNNY_REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;

export async function DELETE(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    const url = `https://${HOSTNAME}/${BUNNY_STORAGE_ZONE}/${fileName}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        AccessKey: BUNNY_ACCESS_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`BunnyCDN delete error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
