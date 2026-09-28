import prisma from './db';

export async function generateUniqueCode(): Promise<string> {
  while (true) {
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generates 1000-9999
    
    // Prune expired codes before checking
    await prisma.share.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });

    const existing = await prisma.share.findUnique({
      where: { code },
    });
    if (!existing) {
      return code;
    }
  }
}
