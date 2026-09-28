import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getFileBuffer } from '@/lib/storage';

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const share = await prisma.share.findUnique({
      where: { code },
    });

    if (!share) {
      return new NextResponse('Not found', { status: 404 });
    }

    if (share.expiresAt < new Date()) {
      return new NextResponse('Expired', { status: 410 });
    }

    if (share.textContent) {
      return new NextResponse(share.textContent, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    if (share.storagePath) {
      const buffer = await getFileBuffer(share.storagePath);
      if (!buffer) {
        return new NextResponse('File missing', { status: 404 });
      }

      // Update download count
      await prisma.share.update({
        where: { id: share.id },
        data: { downloadCount: share.downloadCount + 1 },
      });

      return new NextResponse(buffer as any, {
        headers: {
          'Content-Type': share.fileType || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${share.fileName || 'download'}"`,
        },
      });
    }

    return new NextResponse('Invalid share', { status: 400 });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
