/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ---- paths (άλλαξέ τα αν θες) ----
const ITEMS_JSON_PATH = path.join(process.cwd(), "Isola item.json");
const CATS_JSON_PATH  = path.join(process.cwd(), "Isola category.json");

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

async function upsertCategoryNode(node, parentId = null) {
  const externalId = node.Id;
  const title = node.Description || node.Code || "category";
  const slug = slugify(title) || `cat-${node.Code || externalId?.slice(0, 6)}`;

  const cat = await prisma.category.upsert({
    where: { externalId },
    update: {
      title,
      parentId,
      slug,
      description: title,
      img: "/images/category-placeholder.jpg", // επειδή στο schema είναι required
    },
    create: {
      externalId,
      title,
      parentId,
      slug,
      description: title,
      img: "/images/category-placeholder.jpg",
    },
  });

  if (Array.isArray(node.SubCategories)) {
    for (const child of node.SubCategories) {
      await upsertCategoryNode(child, cat.id);
    }
  }
  return cat;
}

async function main() {
  const catsRaw = JSON.parse(fs.readFileSync(CATS_JSON_PATH, "utf-8"));
  const itemsRaw = JSON.parse(fs.readFileSync(ITEMS_JSON_PATH, "utf-8"));

  if (!catsRaw?.Success) throw new Error("Categories JSON: Success=false");
  if (!itemsRaw?.Success) throw new Error("Items JSON: Success=false");

  // 1) Categories upsert (tree)
  console.log("Upserting categories...");
  for (const root of catsRaw.Data || []) {
    await upsertCategoryNode(root, null);
  }

  // Build map externalId -> internal id
  const allCats = await prisma.category.findMany({ select: { id: true, externalId: true } });
  const catMap = new Map(allCats.map(c => [c.externalId, c.id]));

  // 2) Products upsert
  console.log("Upserting products...");
  let maxRev = null;

  for (const it of itemsRaw.Data || []) {
    const externalId = it.Id;
    const sku = String(it.SKU ?? "").trim() || null;
    const title = it.Title || "Untitled";
    const slug = `${slugify(title)}${sku ? "-" + sku : ""}`.slice(0, 200);

    const price = Number(it.Price ?? 0);
    const offerPrice = it.OfferPrice != null ? Number(it.OfferPrice) : null;
    const discountedPrice = (offerPrice != null && offerPrice > 0 && offerPrice < price) ? offerPrice : null;

    const quantity = Number(it.Balance ?? 0);

    // category: πάρε την 1η διαθέσιμη που υπάρχει στον πίνακα
    const catExternalIds = Array.isArray(it.Categories) ? it.Categories : [];
    const categoryId =
      catExternalIds.map(id => catMap.get(id)).find(Boolean) ?? null;

    const prod = await prisma.product.upsert({
      where: { externalId },
      update: {
        itemRevNum: it.ItemRevNum ?? null,
        price,
        discountedPrice,
        quantity,
        title,
        slug,
        sku,
        description: it.Description || null,
        shortDescription: (it.Description || title).slice(0, 180),
        categoryId,
      },
      create: {
        externalId,
        itemRevNum: it.ItemRevNum ?? null,
        price,
        discountedPrice,
        quantity,
        title,
        slug,
        sku,
        description: it.Description || null,
        shortDescription: (it.Description || title).slice(0, 180),
        categoryId,
        tags: [],
        offers: [],
      },
      select: { id: true },
    });

    // Images: καθάρισε & ξαναγράψ’ τες με σειρά (απλό mock)
    const images = Array.isArray(it.Images) ? it.Images : [];
    await prisma.productImage.deleteMany({ where: { productId: prod.id } });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: prod.id,
          filepath: images[i],          // π.χ. "001_01.jpg" (mock)
          order: i,
          externalFilename: images[i],
        },
      });
    }

    // Attributes -> CustomAttribute + AttributeValue (basic mock: 1 value per attribute)
    const attrs = Array.isArray(it.Attributes) ? it.Attributes : [];
    for (const a of attrs) {
      const attributeName = a.Description || a.Code || "Attribute";
      const valueTitle = a.Value != null ? String(a.Value) : "";

      const ca = await prisma.customAttribute.create({
        data: {
          productId: prod.id,
          attributeName,
          attributeValues: {
            create: [{ title: valueTitle }],
          },
        },
      });
      void ca;
    }

    // Variations -> ProductVariant
    const vars = Array.isArray(it.Variations) ? it.Variations : [];
    await prisma.productVariant.deleteMany({ where: { productId: prod.id } });
    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      await prisma.productVariant.create({
        data: {
          productId: prod.id,
          color: v?.Color?.Value ? String(v.Color.Value) : "",
          size: v?.Size?.Value ? String(v.Size.Value) : "",
          image: images[0] || "",
          isDefault: i === 0,
        },
      });
    }

    if (typeof it.ItemRevNum === "number") {
      maxRev = maxRev == null ? it.ItemRevNum : Math.max(maxRev, it.ItemRevNum);
    }
  }

  // 3) ExternalSyncMeta checkpoint
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

  console.log("Done. lastSyncedRev =", maxRev);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
