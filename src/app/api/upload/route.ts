import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a very short unique filename to save DB space
    const ext = path.extname(file.name) || '.jpg';
    const filename = Math.random().toString(36).substring(2, 10) + ext;
    
    // Ensure public/images directory exists
    const dirPath = path.join(process.cwd(), 'public/images');
    try {
      await mkdir(dirPath, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    // Save to public/images
    const filepath = path.join(dirPath, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true, url: `/images/${filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}
