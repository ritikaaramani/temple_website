interface ContentData {
  heroPhotos?: any[];
  sectionBackgrounds?: any;
  pageBackgrounds?: any;
  bannerSettings?: any;
  books?: any[];
  songs?: any[];
  contactInfo?: any;
  templeHistory?: any;
  about?: any;
  timings?: any;
  timingsSection?: any;
  sevaSection?: any;
  templeBoxes?: any;
}

// Use Netlify Blobs in production, localStorage simulation in development
const isDev = process.env.NODE_ENV === 'development';

let devStorage: ContentData = {};

export async function GET() {
  try {
    if (isDev) {
      // In development, return in-memory storage
      return Response.json(devStorage);
    } else {
      // In production, use Netlify Blobs
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('temple-content');
      const content = await store.get('content', { type: 'json' }) as ContentData | null;
      return Response.json(content || {});
    }
  } catch (error) {
    console.error('Error reading content:', error);
    return Response.json({}, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    
    if (isDev) {
      // In development, use in-memory storage
      devStorage = { ...devStorage, ...updates };
      return Response.json({ success: true, content: devStorage });
    } else {
      // In production, use Netlify Blobs
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('temple-content');
      
      let existingContent = await store.get('content', { type: 'json' }) as ContentData | null;
      if (!existingContent) {
        existingContent = {};
      }
      
      const newContent = { ...existingContent, ...updates };
      await store.setJSON('content', newContent);
      
      return Response.json({ success: true, content: newContent });
    }
  } catch (error) {
    console.error('Error saving content:', error);
    return Response.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

