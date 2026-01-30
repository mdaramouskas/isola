/* eslint-disable no-console */

// ⚠️ MOCK/SEED ONLY: disable TLS cert verification (needed on some Windows/proxy setups)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(process.cwd(), ".env") });

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

// ---- paths ----
const ITEMS_JSON_PATH = path.join(process.cwd(), "seed-data", "Isola item.mock.json");
const CATS_JSON_PATH = path.join(process.cwd(), "seed-data", "Isola category.mock.json");

// Για mock images από public folder:
const PUBLIC_PRODUCTS_PREFIX = "/images/products/";
const CATEGORY_PLACEHOLDER_IMG = "/images/category-placeholder.jpg";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[άα]/g, "a")
    .replace(/[έε]/g, "e")
    .replace(/[ήη]/g, "i")
    .replace(/[ίϊΐι]/g, "i")
    .replace(/[όο]/g, "o")
    .replace(/[ύϋΰυ]/g, "y")
    .replace(/[ώω]/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeStr(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toInt(v, fallback = 0) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function ensurePublicPath(filename) {
  const f = safeStr(filename);
  if (!f) return "";
  if (f.startsWith("http://") || f.startsWith("https://") || f.startsWith("/")) return f;
  return `${PUBLIC_PRODUCTS_PREFIX}${f}`;
}

async function upsertCategoryNode(prisma, node, parentId = null) {
  const externalId = node.Id;
  const title = node.Description || node.Code || "category";
  const slug = slugify(title) || `cat-${node.Code || String(externalId).slice(0, 6)}`;

  // IMPORTANT:
  // - Upsert by externalId (unique) to keep stable mapping with bridge
  // - Assumes Category.externalId exists in DB (it should after db push)
  const cat = await prisma.category.upsert({
    where: { externalId },
    update: {
      title,
      parentId,
      slug,
      description: title,
      img: CATEGORY_PLACEHOLDER_IMG,
    },
    create: {
      externalId,
      title,
      parentId,
      slug,
      description: title,
      img: CATEGORY_PLACEHOLDER_IMG,
    },
  });

  if (Array.isArray(node.SubCategories)) {
    for (const child of node.SubCategories) {
      await upsertCategoryNode(prisma, child, cat.id);
    }
  }
  return cat;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in .env");
  }
  console.log("DATABASE_URL loaded:", Boolean(process.env.DATABASE_URL));

  // ✅ Prisma adapter for pg (required by your Prisma 7 client setup)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const catsRaw = JSON.parse(fs.readFileSync(CATS_JSON_PATH, "utf-8"));
    const itemsRaw = JSON.parse(fs.readFileSync(ITEMS_JSON_PATH, "utf-8"));

    if (!catsRaw?.Success) throw new Error("Categories JSON: Success=false");
    if (!itemsRaw?.Success) throw new Error("Items JSON: Success=false");

    // ✅ CLEAN SEED (mock) - delete in FK-safe order
    console.log("Cleaning tables (mock seed)...");

    // Product-referencing tables first
    await prisma.review.deleteMany();
    await prisma.heroBanner.deleteMany();
    await prisma.heroSlider.deleteMany();
    await prisma.countdown.deleteMany();

    // Product sub-tables
    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.attributeValue.deleteMany();
    await prisma.customAttribute.deleteMany();
    await prisma.additionalInformation.deleteMany();

    // Products then categories
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // 1) Categories
    console.log("Upserting categories...");
    for (const root of catsRaw.Data || []) {
      await upsertCategoryNode(prisma, root, null);
    }

    const allCats = await prisma.category.findMany({ select: { id: true, externalId: true } });
    const catMap = new Map(allCats.map((c) => [c.externalId, c.id]));

    // 2) Products - Group by SKU to avoid duplicates
    const itemsBySku = new Map();
    for (const it of itemsRaw.Data || []) {
      const sku = safeStr(it.SKU);
      if (!sku) continue; // Skip items without SKU
      if (!itemsBySku.has(sku)) {
        itemsBySku.set(sku, it); // Keep first occurrence only
      }
    }

    const uniqueItems = [...itemsBySku.values()];
    const totalProducts = uniqueItems.length;
    console.log(`Upserting ${totalProducts} unique products (from ${(itemsRaw.Data || []).length} total items)...`);
    let maxRev = null;
    let prodIndex = 0;

    for (const it of uniqueItems) {
      prodIndex++;
      if (prodIndex % 50 === 0 || prodIndex === 1) {
        console.log(`  Processing product ${prodIndex}/${totalProducts}...`);
      }
      const externalId = it.Id;
      const sku = safeStr(it.SKU);

      const title = safeStr(it.Title) || "Untitled";
      const baseSlug = slugify(title) || "product";
      // Use SKU for slug uniqueness (since we deduplicated by SKU)
      const slug = `${baseSlug}-${sku}`.slice(0, 200);


      const price = toNumber(it.Price, 0);
      const offerPrice = it.OfferPrice != null ? toNumber(it.OfferPrice, 0) : null;
      const discountedPrice =
        offerPrice != null && offerPrice > 0 && offerPrice < price ? offerPrice : null;

      const quantity = toInt(it.Balance, 0);

      const catExternalIds = Array.isArray(it.Categories) ? it.Categories : [];
      const categoryId = catExternalIds.map((id) => catMap.get(id)).find(Boolean) ?? null;

      const prod = await prisma.product.upsert({
        where: { externalId },
        update: {
          itemRevNum: typeof it.ItemRevNum === "number" ? it.ItemRevNum : null,
          price,
          discountedPrice,
          quantity,
          title,
          slug,
          sku,
          description: safeStr(it.Description) || null,
          shortDescription: (safeStr(it.Description) || title).slice(0, 180),
          categoryId,
        },
        create: {
          externalId,
          itemRevNum: typeof it.ItemRevNum === "number" ? it.ItemRevNum : null,
          price,
          discountedPrice,
          quantity,
          title,
          slug,
          sku,
          description: safeStr(it.Description) || null,
          shortDescription: (safeStr(it.Description) || title).slice(0, 180),
          categoryId,
          tags: [],
          offers: [],
        },
        select: { id: true },
      });

      // Images (rewrite)
      const images = Array.isArray(it.Images) ? it.Images : [];
      await prisma.productImage.deleteMany({ where: { productId: prod.id } });

      for (let i = 0; i < images.length; i++) {
        const original = safeStr(images[i]);
        const filepath = ensurePublicPath(original);
        if (!filepath) continue;

        await prisma.productImage.create({
          data: {
            productId: prod.id,
            filepath,
            order: i,
            externalFilename: original,
          },
        });
      }

      // Attributes (clean + rewrite)
      const attrs = Array.isArray(it.Attributes) ? it.Attributes : [];

      await prisma.attributeValue.deleteMany({
        where: { attribute: { productId: prod.id } },
      });
      await prisma.customAttribute.deleteMany({
        where: { productId: prod.id },
      });

      for (const a of attrs) {
        const attributeName = safeStr(a?.Description) || safeStr(a?.Code) || "Attribute";
        const valueTitle = a?.Value != null ? String(a.Value) : "";

        await prisma.customAttribute.create({
          data: {
            productId: prod.id,
            attributeName,
            attributeValues: {
              create: [{ title: valueTitle }],
            },
          },
        });
      }

      // Variants (rewrite)
      const vars = Array.isArray(it.Variations) ? it.Variations : [];
      await prisma.productVariant.deleteMany({ where: { productId: prod.id } });

      for (let i = 0; i < vars.length; i++) {
        const v = vars[i];
        const variantImage =
          ensurePublicPath(v?.Image) || (images[0] ? ensurePublicPath(images[0]) : "");

        await prisma.productVariant.create({
          data: {
            productId: prod.id,
            color: v?.Color?.Value ? String(v.Color.Value) : "",
            size: v?.Size?.Value ? String(v.Size.Value) : "",
            image: variantImage,
            isDefault: Boolean(v?.IsDefault) || i === 0,
          },
        });
      }

      if (typeof it.ItemRevNum === "number") {
        maxRev = maxRev == null ? it.ItemRevNum : Math.max(maxRev, it.ItemRevNum);
      }
    }

    // 3) ExternalSyncMeta
    await prisma.externalSyncMeta.upsert({
      where: { source: "bridge" },
      update: {
        lastSyncedRev: maxRev,
        lastSyncedAt: new Date(),
        lastProcessedCount: (itemsRaw.Data || []).length,
        lastError: null,
      },
      create: {
        source: "bridge",
        lastSyncedRev: maxRev,
        lastSyncedAt: new Date(),
        lastProcessedCount: (itemsRaw.Data || []).length,
        lastError: null,
      },
    });

    // Quick counts
    const [catCount, prodCount, imgCount, varCount] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.productImage.count(),
      prisma.productVariant.count(),
    ]);

    console.log("Done. lastSyncedRev =", maxRev);
    console.log("Seeded items:", (itemsRaw.Data || []).length);
    console.log("DB counts => categories:", catCount, "products:", prodCount, "images:", imgCount, "variants:", varCount);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
