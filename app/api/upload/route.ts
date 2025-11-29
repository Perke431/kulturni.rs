import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'images';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Get auth token from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin status
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
        headers: {
          Authorization: authHeader,
        },
      });

      const data = await response.json();
      if (!data.isAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Admin role required' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Failed to verify admin status' },
        { status: 500 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Save to public folder
    const publicPath = join(process.cwd(), 'public', folder);
    if (!existsSync(publicPath)) {
      await mkdir(publicPath, { recursive: true });
    }
    
    const filePath = join(publicPath, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({
      url: `/${folder}/${fileName}`,
      path: filePath,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

