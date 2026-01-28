import { NextResponse } from "next/server";
import mapSupplierToProduct from "@/lib/bridgeMapper";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Accept either single item or list
    const items = Array.isArray(payload) ? payload : payload.Data || [payload];

    const mapped = items.map((it: any) => mapSupplierToProduct(it));

    // For this stub, convert images to local storage paths under /storage/<sku>/filename
    const withStorageUrls = mapped.map((p: any) => ({
      ...p,
      images: (p.images || []).map((f: string) => `/storage/${p.sku}/${f}`),
      variants: (p.variants || []).map((v: any) => ({
        ...v,
        image: v.sku ? `/storage/${p.sku}/${v.sku}.jpg` : undefined,
      })),
    }));

    return NextResponse.json({ success: true, items: withStorageUrls });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return NextResponse.json({ success: true, message: "Bridge map endpoint. POST supplier JSON to map." });
}
