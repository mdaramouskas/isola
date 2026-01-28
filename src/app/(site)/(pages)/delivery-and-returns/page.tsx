import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getSiteName } from "@/get-api-data/seo-setting";

export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  return {
    title: `Delivery and Returns | ${site_name}`,
    description: `Delivery and Returns information for ${site_name}`,
  };
};

const DeliveryAndReturnsPage = async () => {
  return (
    <main>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Delivery and Returns", href: "/delivery-and-returns" },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 xl:px-0">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-dark sm:text-5xl">
              Delivery and Returns
            </h1>
            <p className="mt-1 text-lg text-dark-3">
              See below for information about the delivery &amp; returns
            </p>
          </div>

          {/* Shipping */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="max-w-md space-y-10 text-base leading-relaxed text-dark-3">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-dark">
                  Within Greece
                </h3>
                <p>Free– spend over €200</p>
                <p>Free– spend over €200 During Bazaar</p>
                <div className="mt-4 space-y-0.5">
                  <p>Payment via card €3.50</p>
                  <p>Payment on delivery €5.50</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-semibold text-dark">
                  Within Europe
                </h3>
                <p>
                  (Cyprus, Austria, Belgium, Bulgaria, Croatia, Czech Republic,
                  Denmark, Estonia, Finland, France, Germany, Hungary, Italy,
                  Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland,
                  Portugal, Romania, Slovenia, Spain, Sweden)
                  <span className="ml-2 font-medium text-dark">€25.00</span>
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-1 text-xl font-semibold text-dark">
                    United Kingdom (UK)
                  </h3>
                  <p>€29.00</p>
                </div>

                <div>
                  <h3 className="mb-1 text-xl font-semibold text-dark">
                    Cyprus
                  </h3>
                  <p>€15.50</p>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-xl font-semibold text-dark">
                  Worldwide
                </h3>
                <p>€35</p>
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-center text-lg font-semibold tracking-wide text-dark">
              RETURN POLICY
            </h2>
            <p className="mt-2 text-center text-base leading-relaxed text-dark-3">
              We accept returns within 14 days, starting from the day your order
              was delivered.
            </p>

            <div className="mt-8 text-base leading-relaxed text-dark-3">
              <p className="mb-3">
                Returned items must comply with our returns policy:
              </p>

              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Items must be returned unworn, undamaged and unused, with all
                  tags attached and the original packaging included
                </li>
                <li>
                  Final sale items cannot be returned unless the item arrives
                  damaged or faulty when delivered to you
                </li>
                <li>
                  Footwear and accessories must be returned with the original
                  branded boxes and dust bags, where provided, and placed inside
                  a protective box when returned
                </li>
                <li>
                  When trying on footwear, please do not mark the soles or
                  damage the shoe box
                </li>
                <li>
                  If an item has a brand tag attached, it must be returned with
                  the tag in its original position
                </li>
                <li>
                  Beauty and cosmetic products must be returned unopened and
                  unused, with the seals of any packaging still intact
                </li>
                <li>
                  Hosiery, lingerie and swimwear items must be returned with the
                  hygiene seals attached and in unopened and undamaged packaging,
                  where applicable
                </li>
                <li>
                  Lingerie and swimwear must only be tried on over your own
                  undergarments. We will not accept any returns that have been
                  worn or are soiled
                </li>
                <li>
                  Due to the nature of face masks, we will not be able to accept
                  returns unless the item is damaged or faulty when delivered to
                  you
                </li>
                <li>
                  Jewellery must be returned in the same condition it arrived
                  in, including all branded packaging and documents provided
                  with it
                </li>
                <li>
                  Customised items cannot be returned as they have been created
                  to your specification, unless the item arrives damaged or
                  faulty when delivered to you
                </li>
              </ul>

              <p className="mt-5 italic">
                *Returns and refunds are not allowed in all products included in
                the bazaar promotion.
              </p>
              <p className="mt-2 italic">
                *Products which are hygiene realated, such as earrings, cannot
                be changed or returned,
              </p>

              <p className="mt-6">
                Payment for orders that include products part of the bazaar
                promotion will be allowed only via card payment on the website.
              </p>

              <p className="mt-6">
                Please be careful when trying on your purchases and return them
                in the same condition you received them. Any returns that do not
                meet our policy will not be accepted. Refund is valid for all
                orders.
              </p>

              <div className="mt-10">
                <p className="font-medium text-dark">How to return</p>

                <p className="mt-4">
                  As part of our commitment to reducing our environmental impact,
                  our return instructions are paper free. This benefits our
                  customers, our people and mostly our planet.
                </p>

                <p className="mt-4">
                  When returning your items, please include any accessories,
                  branded boxes or cases that came with your order, in the
                  reusable ISOLA BOUTIQUE packaging. If anything is damaged or
                  missing from your return, you may not receive your full
                  refund.
                </p>

                <p className="mt-6 font-medium text-dark">
                  What you need to do:
                </p>

                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>
                    Send us an email letting us know that you want to return
                    your purchased item.
                  </li>
                  <li>Send the parcel back to us.</li>
                </ul>

                <p className="mt-6">Please note that:</p>

                <div className="mt-3 space-y-4">
                  <div>
                    <p>a)The returning parcel should contain:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>
                        i) The returning product (including all accessories,
                        boxes or cases that came with your order).
                      </li>
                      <li>ii) Your receipt.</li>
                    </ul>
                  </div>

                  <p>
                    b)The packaging must be firm, for prevention of any possible
                    transportation damage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="mx-auto mt-16 max-w-3xl pb-6">
            <h2 className="text-center text-lg font-semibold tracking-wide text-dark">
              REFUND POLICY
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-dark-3">
              <p>
                Customer will be burdened with the return cost which is taken
                from the refund amount.
              </p>

              <p>
                For orders which have free shipping, customer will be burdened
                with the shipping and return cost which will be taken from the
                refund amount. In case your order is returning from outside the
                EU, you will be additionally burdened with any other fees,
                duties and taxes imposed by customs authorities.
              </p>

              <p>
                In case you wish to keep the amount as a credit, you will need
                to redeem it within the 4 months period. After 4 months the
                credit amount will not be accepted.
              </p>

              <p>
                Refunds can take up to 14 days to show in your account, depending
                on your payment provider.
              </p>

              <div className="pt-2">
                <p className="font-medium text-dark">Faulty items</p>
                <p className="mt-2">
                  If you receive an item in a flawed or damaged condition, or if
                  it doesn’t quite match the description on our website, contact
                  us via email as soon as possible. We will arrange a return and
                  process a full refund for the faulty item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeliveryAndReturnsPage;
