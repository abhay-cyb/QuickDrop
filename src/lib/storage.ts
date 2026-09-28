import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function saveFile(file: File): Promise<{ storagePath: string, fileName: string, fileSize: number, fileType: string }> {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    // Ignore if directory exists
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const fileName = file.name;
  const fileType = file.type || 'application/octet-stream';
  const fileSize = file.size;
  
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${fileName}`;
  const storagePath = path.join(UPLOAD_DIR, uniqueName);
  
  await fs.writeFile(storagePath, buffer);
  
  return { storagePath: uniqueName, fileName, fileSize, fileType };
}

export async function getFileBuffer(storagePath: string): Promise<Buffer | null> {
  try {
    const fullPath = path.join(UPLOAD_DIR, storagePath);
    return await fs.readFile(fullPath);
  } catch (error) {
    return null;
  }
}

export async function deleteFile(storagePath: string): Promise<void> {
  try {
    const fullPath = path.join(UPLOAD_DIR, storagePath);
    await fs.unlink(fullPath);
  } catch (error) {
    // Ignore errors
  }
}
