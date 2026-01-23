import { PrismaClient } from '@prisma/client';
import { fetchProductBatch } from './apiClient';
import { downloadImageIfNeeded } from './ftpFetcher';
import { fetchImageAsBase64 } from './imageClient';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export interface SyncOptions {
  source?: string;
  dryRun?: boolean;
  mock?: boolean;
}

export async function processBatch(maxRevision: number, opts: SyncOptions = {}) {
  const batch = await fetchProductBatch({ maxRevision, limit: 100, mock: !!opts.mock });
  if (!batch || !batch.Data || batch.Data.length === 0) return { processed: 0 };

  const highestRev = Math.max(...batch.Data.map((p: any) => p.ItemRevNum || 0));

  // Transactional upsert
  const trx = await prisma.$transaction(async (tx) => {
    for (const item of batch.Data) {
      // Upsert product by externalId or SKU
      const externalId = item.Id;
      const sku = item.SKU;
      let product = await tx.product.findFirst({ where: { externalId: externalId } as any });
      if (!product && sku) {
        product = await tx.product.findFirst({ where: { sku } as any });
      }
      // determine categoryId from item.Categories (use first match)
      let categoryId: number | null = null;
      if (Array.isArray(item.Categories) && item.Categories.length > 0) {
        for (const externalCatId of item.Categories) {
          const cat = await tx.category.findFirst({ where: { externalId: externalCatId } as any });
          if (cat) {
            categoryId = cat.id;
            break;
          }
        }
      }

      if (!product) {
        product = await tx.product.create({
          data: {
            externalId: externalId,
            title: item.Title,
            description: item.Description ?? '',
            price: item.Price,
            discountedPrice: item.OfferPrice ?? null,
            quantity: item.Balance ?? 0,
            slug: item.SKU ? `p-${item.SKU}` : `p-${externalId}`,
            sku: item.SKU,
            itemRevNum: item.ItemRevNum ?? null,
            categoryId: categoryId ?? undefined,
          } as any,
        } as any);
      } else {
        product = await tx.product.update({ where: { id: product.id } as any, data: {
          title: item.Title,
          description: item.Description ?? '',
          price: item.Price,
          discountedPrice: item.OfferPrice ?? null,
          quantity: item.Balance ?? 0,
          itemRevNum: item.ItemRevNum ?? null,
          categoryId: categoryId ?? undefined,
        } as any } as any);
      }

      // Images: queue download and create ProductImage records
      if (Array.isArray(item.Images)) {
        let order = 0;
        for (const fname of item.Images) {
          let filepath = `/images/placeholder.png`;
          if (opts.mock) {
            try {
              const res = await fetchImageAsBase64(fname, { mock: true });
              const outDir = path.join(process.cwd(), 'public', 'images', 'mock');
              await fs.mkdir(outDir, { recursive: true });
              const outPath = path.join(outDir, fname);
              await fs.writeFile(outPath, Buffer.from(res.dataBase64!, 'base64'));
              filepath = `/images/mock/${fname}`;
            } catch (e) {
              console.warn('mock image write failed', fname, e);
              filepath = `/images/placeholder.png`;
            }
          } else {
            filepath = await downloadImageIfNeeded(fname);
          }
          // avoid duplicate images (by externalFilename)
          const existsImg = await (tx as any).productImage.findFirst({ where: { productId: product.id, externalFilename: fname } as any });
          if (!existsImg) {
            // productImage may not be in TS types until prisma generate is run; use any
            await (tx as any).productImage.create({
              data: {
                productId: product.id,
                filepath,
                order,
                externalFilename: fname,
              },
            });
          }
          order++;
        }
      }

      // Upsert Variations
      if (Array.isArray(item.Variations)) {
        for (const v of item.Variations) {
          // prefer SKU-based match if available
          let variant: any = null;
          if (v.SKU) {
            variant = await (tx as any).productVariant.findFirst({ where: { sku: v.SKU } as any });
          }
          if (!variant) {
            // try match by productId + color + size
            const colorVal = v.Color?.Value ?? null;
            const sizeVal = v.Size?.Value ?? null;
            variant = await (tx as any).productVariant.findFirst({ where: { productId: product.id, color: colorVal, size: sizeVal } as any });
          }

          const variantData: any = {
            color: v.Color?.Value ?? '',
            size: v.Size?.Value ?? '',
            image: '',
            isDefault: false,
            productId: product.id,
          };
          if (v.SKU) variantData.sku = v.SKU;

          if (!variant) {
            await (tx as any).productVariant.create({ data: variantData });
          } else {
            await (tx as any).productVariant.update({ where: { id: variant.id } as any, data: variantData });
          }
        }
      }

      // Upsert Attributes
      if (Array.isArray(item.Attributes)) {
        for (const a of item.Attributes) {
          const attrName = a.Description ?? a.Code ?? 'attribute';
          // find or create CustomAttribute for this product
          let customAttr = await (tx as any).customAttribute.findFirst({ where: { attributeName: attrName, productId: product.id } as any });
          if (!customAttr) {
            customAttr = await (tx as any).customAttribute.create({ data: { attributeName: attrName, productId: product.id } });
          }

          // ensure AttributeValue exists
          const valTitle = a.Value ?? '';
          let val = await (tx as any).attributeValue.findFirst({ where: { attributeId: customAttr.id, title: valTitle } as any });
          if (!val) {
            await (tx as any).attributeValue.create({ data: { title: valTitle, attributeId: customAttr.id } });
          }
        }
      }
    }

    // update ExternalSyncMeta
    await (tx as any).externalSyncMeta.upsert({
      where: { source: opts.source ?? 'isola' },
      create: { source: opts.source ?? 'isola', lastSyncedRev: highestRev, lastProcessedCount: batch.Data.length },
      update: { lastSyncedRev: highestRev, lastProcessedCount: batch.Data.length },
    });

    return { processed: batch.Data.length, highestRev };
  });

  return trx;
}
