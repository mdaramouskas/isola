import { Metadata } from "next";
import { getSiteName } from "@/get-api-data/seo-setting";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  return {
    title: `Privacy Policy | ${site_name}`,
    description: `General information about privacy for ${site_name}`,
  };
};

const PrivacyPolicyPage = async () => {
  return (
    <main>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy" },
        ]}
      />

      <section className="py-20 overflow-hidden bg-white">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <h1 className="mt-0 mb-2 text-4xl font-black text-center text-dark">Privacy Policy</h1>
          <p className="mb-8 text-xl text-center text-dark-3 font-medium">General information.</p>

          <div className="max-w-4xl mx-auto text-base text-dark-3 space-y-6 leading-relaxed">
            <p>
              Welcome to our Privacy Policy page! When you use our store services, you trust us with your information. This Privacy Policy is meant to help you understand what information we collect, why we collect it, and what we do with it. When you share information with us, we can make our services even better for you. For instance, we can show you more relevant search results and ads, help you connect with people or make sharing with others quicker and easier. As you use our services, we want you to be clear about how we use information and the ways in which you can protect your privacy. This is important; we hope you will take time to read it carefully. Remember, you can find controls to manage your information and protect your privacy and security. We've tried to keep it as simple as possible.
            </p>

            <h3 className="font-bold text-lg text-dark">Right to access, correct and delete data and to object to data processing</h3>
            <p>
              Our customers have the right to access, correct and delete personal data relating to them, and to object to the processing of such data, by addressing a written request, at any time. The Company makes every effort to put in place suitable procedures to safeguard the security and privacy of personal data and to prevent it from being altered, destroyed, corrupted, destroyed or accessed by unauthorized third parties. However, the Company cannot control and cannot be made responsible for the use of the Internet and therefore cannot be held responsible for unauthorized access or misuse of the information.
            </p>

            <h3 className="font-bold text-lg text-dark">Management of personal data</h3>
            <p>
              You can view or edit your personal data online for many of our services. You can also make choices about our collection and use of your data. How you can access or control your personal data will depend on which services you use. You can choose whether you wish to receive promotional communications from our store by email, SMS, physical mail and telephone. If you receive promotional material or SMS messages from us and would like to opt out, you can do so by following the instructions in those messages. You can also make choices about the receipt of promotional email, telephone calls and postal mail by visiting our account settings and contacting the Customer Promotion or Communications Manager, which allows you to update contact information, manage contact preferences, opt out of email subscriptions, and choose whether to share your contact information with our partners. These choices do not apply to mandatory service communications that are part of certain store services.
            </p>

            <h3 className="font-bold text-lg text-dark">Information we collect</h3>
            <p>
              Our store collects data to operate effectively and provide you the best experiences with our services. You provide some of this data directly, such as when you create a personal account. We get some of it by recording how you interact with our services by, for example, using technologies like cookies, and receiving error reports or usage data from software running on your devices. We also obtain data from third parties, including other store partners. For example, we supplement the data we collect by purchasing data from data companies to improve our services and help us determine a location-based on your IP address in order to provide tailored content and advertising. The data we collect depends on the services and features you use.
            </p>

            <h3 className="font-bold text-lg text-dark">How we use your information</h3>
            <p>
              Our store uses the data we collect for three basic purposes: to operate our business and provide (including improving and personalizing) the services we offer, to send communications, including promotional communications, and to display advertising. In carrying out these purposes, we combine data we collect through the various store services you use to give you a more seamless, consistent and personalized experience. However, to enhance privacy, we have built in technological and procedural safeguards designed to prevent certain data combinations. For example, we store data we collect from you when you are unauthenticated (not signed in), separately from account information that directly identifies you, such as your name, email address or phone number.
            </p>

            <h3 className="font-bold text-lg text-dark">Sharing your information</h3>
            <p>
              We share your personal data with your consent or as necessary to complete any transaction or provide any service you have requested or authorized. For example, we share your content with third parties when you ask us to do so. When you provide payment details to make a purchase, we will share payment data with banks and other entities that process payment transactions or provide other financial services, and for fraud prevention and credit risk reduction. In addition, when we share your personal data among our controlled affiliates and subsidiary stores.
            </p>

            <p className="text-sm text-dark-3">For any other reasons, we may also disclose personal data as part of a corporate transaction, such as a merger, sale, or asset transfer, or as required by law.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
