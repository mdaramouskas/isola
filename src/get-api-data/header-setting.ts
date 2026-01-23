import { prisma } from "@/lib/prismaDB";
import { unstable_cache } from "next/cache";

// get all header settings (sanitize Cloudinary-hosted logos)
export const getHeaderSettings = unstable_cache(
  async () => {
    const setting = await prisma.headerSetting.findFirst();
    if (!setting) return setting;
    const sanitized: any = { ...setting };
    if (sanitized.headerLogo && typeof sanitized.headerLogo === 'string' && sanitized.headerLogo.includes('res.cloudinary.com')) {
      sanitized.headerLogo = '/images/logo/logo.png';
    }
    if (sanitized.emailLogo && typeof sanitized.emailLogo === 'string' && sanitized.emailLogo.includes('res.cloudinary.com')) {
      sanitized.emailLogo = '/images/logo/logo.png';
    }
    return sanitized;
  },
  ['header-setting'], { tags: ['header-setting'] }
);
