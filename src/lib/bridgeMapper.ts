export type SupplierItem = any;

export type MappedProduct = {
  id: string;
  sku: string;
  title: string;
  description?: string;
  price?: number;
  offerPrice?: number | null;
  quantity?: number;
  categories?: string[];
  images: string[]; // image filenames or URLs
  variants: { sku?: string; color?: string; size?: string; balance?: number }[];
  attributes?: { code?: string; value?: string }[];
  revision?: number;
};

export function mapSupplierToProduct(item: SupplierItem): MappedProduct {
  const id = item.Id || item.id || item.SKU || String(item.SKU || "");
  const sku = item.SKU || item.Sku || id;
  const title = item.Title || item.title || item.Name || "";

  const images = Array.isArray(item.Images) ? item.Images : [];

  const variants = (item.Variations || item.productVariants || []).map(
    (v: any) => ({
      sku: v.SKU || v.sku,
      color: v.Color?.Value || v.Color?.Value || v.color || v.colorValue,
      size: v.Size?.Value || v.Size?.Value || v.size || v.sizeValue,
      balance: v.Balance || v.Balance || v.stock || 0,
    })
  );

  const attributes = (item.Attributes || []).map((a: any) => ({
    code: a.Code || a.code,
    value: a.Value || a.Value || null,
  }));

  return {
    id: String(id),
    sku: String(sku),
    title,
    description: item.Description || item.description || null,
    price: item.Price || item.Price || null,
    offerPrice: item.OfferPrice || item.OfferPrice || null,
    quantity: item.Balance || item.Balance || item.Balance || 0,
    categories: item.Categories || [],
    images,
    variants,
    attributes,
    revision: item.ItemRevNum || item.ItemRevNum || null,
  };
}

export default mapSupplierToProduct;
