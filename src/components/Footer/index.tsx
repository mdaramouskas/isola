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
  { id: 1, label: "Isola Boutique (Womenswear)", href: "https://www.google.com/maps/place/Isola+Boutique+(Womenswear)/@37.7881662,20.8997564,933m/data=!3m2!1e3!4b1!4m6!3m5!1s0x136747bce5e21c39:0x1fc477ab8aa80f53!8m2!3d37.7881662!4d20.8997564!16s%2Fg%2F11h5tzswhp?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D" },
  { id: 2, label: "Isola Boutique (Menswear/Unisex)", href: "https://www.google.com/maps/place/Isola+Boutique+(Menswear%2FUnisex)/@37.7877649,20.8994908,933m/data=!3m2!1e3!4b1!4m6!3m5!1s0x136747fc0d3595d5:0xab05920b3880690c!8m2!3d37.7877649!4d20.8994908!16s%2Fg%2F11y2n63065?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D" },
  { id: 3, label: "Isola Boutique SKG (Womenswear)", href: "https://www.google.com/maps/place/Isola+Boutique+SKG/@40.6300957,22.9421778,896m/data=!3m2!1e3!4b1!4m16!1m9!4m8!1m0!1m6!1m2!1s0x14a8390078703b39:0xf8b2fd61f3a22e41!2sIsola+Boutique+SKG,+Proxenou+Koromila+32,+Thessaloniki+546+22!2m2!1d22.9444013!2d40.6300957!3m5!1s0x14a8390078703b39:0xf8b2fd61f3a22e41!8m2!3d40.6300957!4d22.9444013!16s%2Fg%2F11x8vmlftr?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D" },
  { id: 4, label: "Pop Up Boutique OLEA All Suite Hotel", href: "https://www.google.com/maps/place/Olea+All+Suite+Hotel+a+Member+of+Design+Hotels/@37.8061287,20.8695497,1866m/data=!3m1!1e3!4m9!3m8!1s0x136747d4539116bb:0x677ca979a6034566!5m2!4m1!1i2!8m2!3d37.8061245!4d20.8721246!16s%2Fg%2F11f38qq9n7?entry=ttu&g_ep=EgoyMDI2MDEyNy4wIKXMDSoASAFQAw%3D%3D" },
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
                  <Link className="duration-200 ease-out hover:text-blue" href={b.href} target="_blank" rel="noopener noreferrer">
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
