#!/usr/bin/env node
import { processBatch } from '../src/integrations/isola/syncService';

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const mock = args.includes('--mock');
  let maxRev = 0;
  // TODO: read existing meta from DB to set maxRev for incremental syncs
  const result = await processBatch(maxRev, { dryRun, source: 'isola', mock });
  console.log('processed', result);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
