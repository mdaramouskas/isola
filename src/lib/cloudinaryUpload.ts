import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function uploadImageToCloudinary(file: File, folder = "uploads"): Promise<string> {
  // Local replacement for Cloudinary: write to `public/uploads/<folder>/` and return a relative URL.
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "_");
  const destDir = path.join(PUBLIC_DIR, "uploads", safeFolder);
  await fs.promises.mkdir(destDir, { recursive: true });

  const extMatch = (file as any).name?.match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? `.${extMatch[1]}` : ".png";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const destPath = path.join(destDir, fileName);

  await fs.promises.writeFile(destPath, buffer);

  // Return a path that can be used in the app (served from /uploads/...)
  return `/uploads/${safeFolder}/${fileName}`;
}

export async function deleteImageFromCloudinary(imageUrl: string) {
  // If it's a local uploads URL (starting with /uploads/) remove the file from disk.
  try {
    if (imageUrl.startsWith("/uploads/")) {
      const localPath = path.join(PUBLIC_DIR, imageUrl.replace(/^\//, ""));
      await fs.promises.unlink(localPath).catch(() => {});
      return { deleted: true };
    }
    // No-op for external URLs
    return { deleted: false };
  } catch (err) {
    return { deleted: false, error: (err as Error).message };
  }
}



