import fs from 'fs/promises';
import path from 'path';

export type IsolaProduct = any; // refine later

export interface FetchBatchOptions {
  maxRevision: number;
  limit?: number;
  source?: string;
  apiUrl?: string;
  apiKey?: string;
  mock?: boolean;
  mockPath?: string;
}

export async function fetchProductBatch(opts: FetchBatchOptions) {
  const mockMode = opts.mock || process.env.ISOLA_API_MOCK === '1';
  if (mockMode) {
    const mockPath = opts.mockPath || process.env.ISOLA_MOCK_PATH || path.join(process.cwd(), 'seed-data', 'Product.json');
    const raw = await fs.readFile(mockPath, 'utf-8');
    try {
      const json = JSON.parse(raw);
      return json;
    } catch (e) {
      throw new Error(`Failed to parse mock JSON at ${mockPath}: ${e}`);
    }
  }

  // real API call
  const base = opts.apiUrl || process.env.ISOLA_API_URL;
  if (!base) throw new Error('ISOLA_API_URL not configured');
  const url = new URL('/api/products', base);
  url.searchParams.set('maxRevision', String(opts.maxRevision ?? 0));
  url.searchParams.set('limit', String(opts.limit ?? Number(process.env.ISOLA_SYNC_BATCH_SIZE ?? 100)));
  const headers: Record<string,string> = {};
  if (opts.apiKey || process.env.ISOLA_API_KEY) headers['Authorization'] = `Bearer ${opts.apiKey || process.env.ISOLA_API_KEY}`;

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText}`);
  const json = await res.json();
  return json;
}
