import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('temple-photos');
    const photoData = await store.get(`photo-${id}`, { type: 'arrayBuffer' });
    if (!photoData) {
      return new Response('Photo not found', { status: 404 });
    }
    return new Response(photoData, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving photo:', error);
    return new Response('Error loading photo', { status: 500 });
  }
}
