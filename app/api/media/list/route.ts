import { NextResponse } from 'next/server';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
const BUNNY_REGION = process.env.BUNNY_REGION || ''; // Empty for default region
const BASE_HOSTNAME = 'storage.bunnycdn.com';
const HOSTNAME = BUNNY_REGION ? `${BUNNY_REGION}.${BASE_HOSTNAME}` : BASE_HOSTNAME;

export async function GET() {
  try {
    const url = `https://${HOSTNAME}/${BUNNY_STORAGE_ZONE}/`;
    console.log(url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AccessKey: BUNNY_ACCESS_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`BunnyCDN API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
