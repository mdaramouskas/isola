import { Metadata } from "next";
import GiftCardsPage from "@/components/GiftCards";

export const metadata: Metadata = {
  title: "Gift Cards | Isola Boutique",
  description: "Purchase Isola Boutique gift cards for your loved ones",
};

export default function GiftCards() {
  return <GiftCardsPage />;
}
