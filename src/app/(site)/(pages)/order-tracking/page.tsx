import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getSiteName } from "@/get-api-data/seo-setting";

export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  return {
    title: `Order Tracking | ${site_name}`,
    description: `Order Tracking for ${site_name}`,
  };
};

const OrderTrackingPage = async () => {
  return (
    <main>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Order Tracking", href: "/order-tracking" }]}
      />

      <section className="py-20 bg-white">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <h1 className="mb-2 text-4xl font-black text-center text-dark sm:text-5xl">Order Tracking</h1>
          <p className="mb-8 text-xl text-center text-dark-3 font-medium">Enter your Order ID and billing email to track the status of your order.</p>

          <div className="max-w-3xl mx-auto">
            <p className="mb-6 text-base leading-relaxed text-dark-3 text-center">To track your order please enter your Order ID in the box below and press the "Track" button. This was given to you on your receipt and in the confirmation email you should have received.</p>

            <form className="max-w-md mx-auto">
              <label className="block text-sm mb-2">Order ID</label>
              <input className="w-full mb-4 px-3 py-2 border border-gray-2 rounded text-sm" placeholder="Found in your order confirmation email." />

              <label className="block text-sm mb-2">Billing email</label>
              <input className="w-full mb-4 px-3 py-2 border border-gray-2 rounded text-sm" placeholder="Email you used during checkout." />

              <button type="submit" className="bg-black text-white px-4 py-2 rounded text-sm">Track</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderTrackingPage;
