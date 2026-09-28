import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateUniqueCode } from '@/lib/code-generator';
import { saveFile } from '@/lib/storage';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 10, 60 * 1000)) { // 10 requests per minute
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await req.formData();
    const textContent = formData.get('textContent') as string | null;
    const file = formData.get('file') as File | null;

    if (!textContent && (!file || file.size === 0)) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    const code = await generateUniqueCode();
    // 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    let shareData: any = {
      code,
      expiresAt,
    };

    if (file && file.size > 0) {
      // Limit 100MB
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 100MB limit' }, { status: 400 });
      }
      const { storagePath, fileName, fileSize, fileType } = await saveFile(file);
      shareData = {
        ...shareData,
        storagePath,
        fileName,
        fileSize,
        fileType,
      };
    } else if (textContent) {
      shareData.textContent = textContent;
    }

    const share = await prisma.share.create({
      data: shareData,
    });

    return NextResponse.json({ code: share.code, expiresAt: share.expiresAt });
  } catch (error) {
    console.error('Share creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
