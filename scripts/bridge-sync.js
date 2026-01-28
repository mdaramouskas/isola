#!/usr/bin/env node
/*
  Simple bridge sync script (local mode)
  Usage:
    node scripts/bridge-sync.js /path/to/supplier.json /path/to/image-source-folder

  The script will read supplier JSON, call the mapper (locally by requiring the TS output is not possible),
  so we re-implement minimal mapping here to create local storage folders under ./public/storage/<sku>/
  and copy images by filename from the provided image source folder.
*/

const fs = require("fs");
const path = require("path");

function simpleMap(item) {
  return {
    id: String(item.Id || item.id || item.SKU || ""),
    sku: String(item.SKU || item.Sku || item.Id || ""),
    title: item.Title || item.title || "",
    images: Array.isArray(item.Images) ? item.Images : [],
    variants: (item.Variations || []).map((v) => ({
      sku: v.SKU,
      color: v.Color?.Value || v.Color?.Value || (v.Color && v.Color.Value) || undefined,
      size: v.Size?.Value || undefined,
    })),
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node scripts/bridge-sync.js /path/to/supplier.json /path/to/image-source-folder");
    process.exit(1);
  }

  const jsonPath = path.resolve(args[0]);
  const imagesSrc = path.resolve(args[1]);

  if (!fs.existsSync(jsonPath)) {
    console.error("Supplier JSON not found:", jsonPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  const payload = JSON.parse(raw);
  const items = Array.isArray(payload) ? payload : payload.Data || [];

  for (const it of items) {
    const mapped = simpleMap(it);
    const destBase = path.join(process.cwd(), "public", "storage", mapped.sku);
    if (!fs.existsSync(destBase)) fs.mkdirSync(destBase, { recursive: true });

    console.log(`Processing SKU=${mapped.sku}, images=${mapped.images.length}`);

    for (const fname of mapped.images) {
      const src = path.join(imagesSrc, fname);
      const dest = path.join(destBase, fname);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`  copied ${fname} -> /storage/${mapped.sku}/${fname}`);
      } else {
        console.warn(`  source image not found: ${src} (skipping)`);
      }
    }

    // write mapped json for reference
    const outJson = path.join(destBase, "_mapped.json");
    fs.writeFileSync(outJson, JSON.stringify(mapped, null, 2));
    console.log(`  wrote ${outJson}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
