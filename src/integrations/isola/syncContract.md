# Isola Sync Contract

This document describes the expected input and output for the Isola product/category sync integration.

## Source payloads

Product payload (batch)
- Root: { Success, Records, Message, Data: [ ...products ] }
- Each product fields (example):
  - Id: string (external GUID)
  - SKU: string
  - Title: string
  - Description: string
  - Price: number
  - OfferPrice: number | null
  - Balance: number
  - Categories: string[] (external category ids)
  - Images: string[] (filenames relative to FTP root)
  - Attributes: [{ Id, Code, Description, Value, Type }]
  - Variations: [{ Id, SKU, Balance, Color, Size }]
  - Active: boolean
  - Created: string (dd/MM/yyyy HH:mm)
  - ItemRevNum: number

Category payload (tree)
- Root: { Success, Records, Message, Data: [ ...categories ] }
- Category has Id, Code, Description, SubCategories (recursive)

## Sync semantics

- The integration will poll an API endpoint that returns a batch of products. Each product has `ItemRevNum`.
- Caller supplies `maxRevision` and `limit` query params. The integration returns the max ItemRevNum it currently has stored and the limit of records to return.
- The source will return up to `limit` records with ItemRevNum greater than the supplied `maxRevision`.
- Processing flow:
  1. Request batch
  2. For each product in the batch:
     - Upsert product (match by external `Id` or `SKU`)
     - Upsert variants, attributes, stock
     - Associate categories (lookup by external category id)
     - Queue/download images from FTP based on filenames and store ProductImage records with order
  3. After the batch is successfully processed, update `ExternalSyncMeta.lastSyncedRev` to the highest `ItemRevNum` processed
  4. Repeat until 0 records are returned

## Images

- FTP root will contain folders named by the first 3 characters of filenames (e.g. `001/001_01.jpg`).
- Files are listed in product JSON under `Images` in the order to display.
- Integration downloads files to `public/images/ftp/<folder>/<filename>` and stores `ProductImage.filepath` accordingly.

## Error handling

- Processing of a batch must be transactional: if DB upsert fails, the batch should not update `ExternalSyncMeta`.
- Image download failures should be logged and retryable; the product upsert may still succeed marking the image as missing.

## Security

- API calls will be protected with `ISOLA_API_KEY` (or Basic auth). FTP uses passive mode credentials `ISOLA_FTP_USER` / `ISOLA_FTP_PASS`.


