import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getSiteName } from "@/get-api-data/seo-setting";
import AccordionClient from "./AccordionClient";

export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  return {
    title: `FAQs | ${site_name}`,
    description: `Frequently Asked Questions for ${site_name}`,
  };
};

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: (
      <p>
        Yes, we offer international shipping to most countries. Shipping fees and delivery
        times may vary based on your location. Please refer to our Shipping Information page
        for more details.
      </p>
    ),
  },
  { question: "Do you offer gift wrapping services?",
    answer: (
      <p>
        Yes, we offer gift wrapping services for a small additional fee. You can select this option during the checkout process.
      </p>
    ),
  },
  { question: "What payment methods do you accept?",
    answer: (
      <p>
        We accept major credit cards (Visa, MasterCard, American Express) for secure & convenient payments and Cash on Delivery.
      </p>
    ),
  },
  { question: "How do I track my order?",
    answer: (
      <p>
        Tracking your order is easy! Once your order is shipped, we’ll send you a confirmation email with a tracking number. 
        You can use this number to track your order’s status on our Order Tracking page.
      </p>
    ),
  },
  { question: "What if an item I want is out of stock?",
    answer: (
      <p>
        If an item you’re interested in is currently out of stock, you can sign up for notifications to be alerted when it becomes available again. 
        Just enter your email on the product page, and we’ll notify you as soon as it’s back in stock.
      </p>
    ),
  },
  { question: "What is your return policy?",
    answer: (
      <p>
        We offer a hassle-free return policy. If you’re not satisfied with your purchase, you can return it within 14 days for a full refund or exchange. 
        Please refer to our Returns & Exchanges page for detailed instructions.
      </p>
    ),
  },
  { question: "How can I contact your customer support?",
    answer: (
      <p>
        You can reach our friendly customer support team at info@isolaboutique.gr or by phone at +30 26950 25772
      </p>
    ),
  },
  { question: "Can I sign up for exclusive offers and updates?",
    answer: (
      <p>
        Absolutely! Join our newsletter to receive exclusive offers, promotions, and updates on the latest fashion trends. 
        You can sign up at the bottom of our homepage.
      </p>
    ),
  },
];

const FAQsPage = async () => {
  return (
    <main>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQs", href: "/faqs" }]} />

      <section className="py-20 bg-white">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <h1 className="mb-2 text-4xl font-black text-center text-dark sm:text-5xl">FAQs</h1>
          <p className="mb-8 text-xl text-center text-dark-3 font-medium">Common questions about orders, shipping and store policies.</p>

          <div className="max-w-4xl mx-auto">
            <AccordionClient items={faqs} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQsPage;
