import type { MenuItem } from "./types";

export const menuData: MenuItem[] = [
  { title: "Shop by Product", path: "/shop-by-product" },
  { title: "Shop By Brand", path: "/shop-by-brand" },
  { title: "Accessories", path: "/shop?category=accessories" }, // dropdown
  { title: "Footwear", path: "/shop?category=footwear" },
  { title: "Gift Cards", path: "/gift-cards" },
  { title: "Sales", path: "/shop?sale=1" },
];

// Categories that belong to Accessories (excluded from Shop by Product)
export const accessoryCategories = [
  "belts",
  "sunglasses",
  "hair accessories",
  "jewellery",
  "gloves",
  "scarfs",
  "wallets",
  "bags & luggages",
  "caps & hats",
];

// Categories to exclude from Shop by Product dropdown
export const excludedFromShopByProduct = [
  ...accessoryCategories,
  "footwear",
  "gift cards",
];
