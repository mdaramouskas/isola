"use client";

import Image from "next/image";
import Breadcrumb from "../Common/Breadcrumb";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import toast from "react-hot-toast";

const giftCards = [
  { id: "gc-500", value: 500, price: 500, image: "/images/gift-cards/gift-card-500.jpg" },
  { id: "gc-300", value: 300, price: 300, image: "/images/gift-cards/gift-card-300.jpg" },
  { id: "gc-200", value: 200, price: 200, image: "/images/gift-cards/gift-card-200.jpg" },
  { id: "gc-150", value: 150, price: 150, image: "/images/gift-cards/gift-card-150.jpg" },
  { id: "gc-100", value: 100, price: 100, image: "/images/gift-cards/gift-card-100.jpg" },
  { id: "gc-70", value: 70, price: 70, image: "/images/gift-cards/gift-card-70.jpg" },
  { id: "gc-50", value: 50, price: 50, image: "/images/gift-cards/gift-card-50.jpg" },
  { id: "gc-30", value: 30, price: 30, image: "/images/gift-cards/gift-card-30.jpg" },
  { id: "gc-20", value: 20, price: 20, image: "/images/gift-cards/gift-card-20.jpg" },
];

const GiftCardsPage = () => {
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = (card: typeof giftCards[0]) => {
    setAddingId(card.id);
    addItem({
      id: card.id,
      name: `Isola Gift Card ${card.value}€`,
      price: card.price,
      currency: "eur",
      image: card.image,
      slug: `gift-card-${card.value}`,
      availableQuantity: 999,
      color: "",
      size: "One Size",
    });
    toast.success("Gift card added to cart!");
    setTimeout(() => setAddingId(null), 500);
  };

  return (
    <>
      <Breadcrumb
        title="Gift Cards"
        items={[
          { label: "Shop", href: "/shop" },
          { label: "Gift Cards", href: "/gift-cards" },
        ]}
      />

      <section className="overflow-hidden py-10 lg:py-14 bg-gray-1">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-dark-4">
              Showing all {giftCards.length} results
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-dark-4">Sort by:</span>
              <select className="text-sm border border-gray-3 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-blue">
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Gift Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {giftCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Card Image */}
                <div className="relative aspect-[4/5] bg-gray-1 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={`Isola Gift Card ${card.value}€`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Card Info */}
                <div className="p-5">
                  <p className="text-[10px] tracking-[0.15em] text-dark-4 mb-1 uppercase">
                    Gift Cards
                  </p>
                  <h3 className="text-base font-medium text-dark mb-2">
                    Isola Gift Card
                  </h3>
                  <p className="text-lg font-semibold text-blue mb-4">
                    {card.price.toFixed(2)} €
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(card)}
                    disabled={addingId === card.id}
                    className="w-full py-2.5 px-4 bg-blue text-white text-sm font-medium rounded-md hover:bg-blue/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {addingId === card.id ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-dark mb-6">
              About Gift Cards
            </h2>
            <div className="space-y-4 text-sm text-dark-4 leading-relaxed">
              <p>How about giving your loved one the freedom to choose his or her own gift?</p>
              <p>With the #IsolaGiftCard, the recipient is offered the opportunity to choose the Isola items of their choice, with a 4-month redemption period!</p>
              <p>PS: along with the #IsolaGiftCard, your loved one will receive & the customized wish or dedication you want us to write, just fill it in the notes!</p>
              <p>Spoil a friend or loved one with an #IsolaGiftCard & leave the choice up to them!</p>
              <p>Choose the value of your gift card and Isola Team will post it to your recipient with a personalized message from you.</p>
              <p className="font-medium text-dark">The #IsolaGiftCard is valid for 4 months from purchase!</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GiftCardsPage;
