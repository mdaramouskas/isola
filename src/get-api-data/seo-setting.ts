import "server-only"
import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

// get all seo settings
export const getSeoSettings = unstable_cache(
  async () => {
    return await prisma.seoSetting.findFirst();
  },
  ['seo-setting'], { tags: ['seo-setting'] }
);

export const getSiteName = unstable_cache(
  async () => {
    const siteName = await prisma.seoSetting.findFirst({
      select: {
        siteName: true,
      },
    });
  return siteName ? siteName.siteName : process.env.SITE_NAME ? process.env.SITE_NAME : "Isola Boutique";
  },
  ['site-name'], { tags: ['site-name'] }
);

// get logo 
export const getLogo = unstable_cache(
  async () => {
    const headerLogo = await prisma.headerSetting.findFirst({
      select: {
        headerLogo: true,
      },
    });
    // prefer DB value, otherwise use local logo in `public/images/logo/logo.svg`
    const logo = headerLogo ? headerLogo.headerLogo : '/images/logo/logo.svg';
    return logo;
  },
  ['header-logo'], { tags: ['header-logo'] }
);

// get email logo
export const getEmailLogo = unstable_cache(
  async () => {
    const emailLogo = await prisma.headerSetting.findFirst({
      select: {
        emailLogo: true,
      },
    });
    const logo = emailLogo ? emailLogo.emailLogo : '/images/logo/logo.svg';
    return logo;
  },
  ['email-logo'], { tags: ['email-logo'] }
);

