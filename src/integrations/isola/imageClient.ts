import fs from 'fs/promises';
import path from 'path';

export interface ImageFetchResult {
  filename: string;
  hash?: string;
  contentType?: string;
  dataBase64?: string;
}

export async function fetchImageAsBase64(filename: string, opts?: { mock?: boolean, mockFolder?: string }) : Promise<ImageFetchResult> {
  if (opts?.mock) {
    // load from seed-data/images or public/images/mock
    const mockPaths = [
      path.join(process.cwd(), 'seed-data', 'images', filename),
      path.join(process.cwd(), 'public', 'images', 'mock', filename),
    ];
    for (const p of mockPaths) {
      try {
        const b = await fs.readFile(p);
        return { filename, dataBase64: b.toString('base64'), contentType: 'image/jpeg' };
      } catch (e) {
        // try next
      }
    }
    throw new Error(`Mock image ${filename} not found in ${mockPaths.join(', ')}`);
  }

  // In real mode, this function should call the bridge endpoint to retrieve base64
  throw new Error('fetchImageAsBase64 only implemented in mock mode for PoC');
}
