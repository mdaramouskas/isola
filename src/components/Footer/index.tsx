import Link from "next/link";
import FooterBottom from "./FooterBottom";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/assets/icons/social";

const customerService = [
  { id: 1, label: "Delivery and Returns", href: "/delivery-and-returns" },
  { id: 2, label: "Privacy Policy", href: "/privacy-policy" },
  { id: 3, label: "Order Tracking", href: "/order-tracking" },
  { id: 4, label: "FAQ", href: "/faqs" },
];

const boutiques = [
  { id: 1, label: "Isola Boutique (Womenswear)", href: "#" },
  { id: 2, label: "Isola Boutique (Menswear/Unisex)", href: "#" },
  { id: 3, label: "Isola Boutique SKG (Womenswear)", href: "#" },
  { id: 4, label: "Pop Up Boutique OLEA All Suite Hotel", href: "#" },
];

const Footer = () => {
  return (
    <footer className="overflow-hidden border-t border-gray-3">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        {/* footer menu start */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-14 pb-12">
          {/* Follow us */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-dark">Follow us</h2>

            <ul className="flex flex-col gap-3 text-sm text-dark-3">
              <li>
                <Link href="https://www.instagram.com/isola_boutique_men/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 duration-200 ease-out hover:text-blue">
                  <InstagramIcon />
                  <span>Mens/Unisex</span>
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Link href="https://www.instagram.com/isola_boutique/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 duration-200 ease-out hover:text-blue">
                  <InstagramIcon />
                  <span>Womens</span>
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Link href="https://www.facebook.com/IsolaBoutique/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 duration-200 ease-out hover:text-blue">
                <FacebookIcon />
                <span>Womens</span>
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Link href="https://www.facebook.com/isola.boutique.men/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 duration-200 ease-out hover:text-blue">
                <FacebookIcon />
                <span>Mens/Unisex</span>
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Link href="https://www.tiktok.com/@isola_boutique" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 duration-200 ease-out hover:text-blue">
                <TwitterIcon />
                <span>Isola Boutique</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-dark">Customer Service</h2>
            <ul className="flex flex-col gap-3 text-sm text-dark-3">
              {customerService.map((item) => (
                <li key={item.id}>
                  <Link className="duration-200 ease-out hover:text-blue" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutiques */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-dark">Boutiques</h2>
            <ul className="flex flex-col gap-3 text-sm text-dark-3">
              {boutiques.map((b) => (
                <li key={b.id}>
                  <Link className="duration-200 ease-out hover:text-blue" href={b.href}>
                    {b.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-dark">Let’s get in touch</h2>
            <p className="mb-4 text-custom-sm text-dark-3">Sign up for our newsletter and get tuned with our updates and offers!</p>

            <form className="max-w-sm">
              <label className="sr-only" htmlFor="newsletter-email">Enter your email address</label>
              <input id="newsletter-email" name="email" type="email" placeholder="Enter your email address..." className="w-full px-4 py-3 rounded bg-white border border-gray-2 mb-3 text-sm" />

              <div className="flex items-start gap-3 mb-3">
                <input id="consent" type="checkbox" className="mt-1" />
                <label htmlFor="consent" className="text-xs text-dark-3">I consent to Isola Boutique collecting and using my email address to send me marketing emails in accordance with the Privacy Policy.</label>
              </div>

              <button type="submit" className="bg-black text-white px-4 py-2 rounded text-sm">Subscribe</button>
            </form>
          </div>
        </div>
        {/* footer menu end */}
      </div>

      <FooterBottom />
    </footer>
  );
};

export default Footer;
