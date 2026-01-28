import type { MenuItem } from "./types";

export const menuData: MenuItem[] = [
  { title: "Shop by Product", path: "/shop-by-product" },
  { title: "Shop By Brand", path: "/shop-by-brand" },
  // point Accessories and Sales to the shop page so the sidebar/filters are available
  { title: "Accessories", path: "/shop?category=accessories" },
  { title: "Gift Cards", path: "/gift-cards" },
  { title: "Sales", path: "/shop?sale=1" },
];
