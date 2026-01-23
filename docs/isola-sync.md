# Isola Sync - Quick Start

Environment variables
- ISOLA_API_URL - base URL for the products API (e.g. https://bridge.example.com)
- ISOLA_API_KEY - API key or token for authentication
- ISOLA_FTP_HOST
- ISOLA_FTP_PORT
- ISOLA_FTP_USER
- ISOLA_FTP_PASS
- ISOLA_FTP_ROOT - ftp root path where images live
- ISOLA_SYNC_BATCH_SIZE - default 100

Run once (dev)

```powershell
$env:ISOLA_API_URL = "https://your-bridge.example.com"
$env:ISOLA_API_KEY = "secret"
npm run isola-sync -- --dry-run
```

CLI options
- --dry-run: parse and validate batches without writing to DB
- --limit N: override batch size
- --source S: source name for ExternalSyncMeta

Location
- Integration code: `src/integrations/isola/`
- Runner: `scripts/isola-sync.ts`
