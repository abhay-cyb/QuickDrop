import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    
    if (!code || code.length !== 4) {
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    // Stricter rate limit for lookups to prevent brute force (e.g. 20 per minute)
    if (!rateLimit(`lookup-${ip}`, 20, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Clean up expired shares proactively could also be done here, but we'll just filter
    const share = await prisma.share.findUnique({
      where: { code },
    });

    if (!share) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 404 });
    }

    if (share.expiresAt < new Date()) {
      // Invalidate if expired
      await prisma.share.delete({ where: { id: share.id } });
      return NextResponse.json({ error: 'This share has expired.' }, { status: 404 });
    }

    return NextResponse.json({
      fileName: share.fileName,
      fileSize: share.fileSize,
      fileType: share.fileType,
      textContent: share.textContent,
      expiresAt: share.expiresAt,
      isText: !!share.textContent,
    });
  } catch (error) {
    console.error('Share lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
