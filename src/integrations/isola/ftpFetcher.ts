import FTPClient from 'basic-ftp';
import fs from 'fs';
import path from 'path';

const IMAGE_ROOT = path.join(process.cwd(), 'public', 'images', 'ftp');

export async function downloadImageIfNeeded(filename: string) {
  const folder = filename.slice(0, 3);
  const destDir = path.join(IMAGE_ROOT, folder);
  const destPath = path.join(destDir, filename);

  if (fs.existsSync(destPath)) return `/images/ftp/${folder}/${filename}`;

  await fs.promises.mkdir(destDir, { recursive: true });

  const client = new FTPClient.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: process.env.ISOLA_FTP_HOST,
      port: Number(process.env.ISOLA_FTP_PORT ?? 21),
      user: process.env.ISOLA_FTP_USER,
      password: process.env.ISOLA_FTP_PASS,
      secure: false,
    });

  const remotePath = `${process.env.ISOLA_FTP_ROOT ?? ''}/${folder}/${filename}`.replace(/\\/g, '/');
  await client.downloadTo(destPath, remotePath);
    return `/images/ftp/${folder}/${filename}`;
  } catch (err) {
    console.error('FTP download failed for', filename, err);
    // leave the file missing but return a placeholder path
    return `/images/placeholder.png`;
  } finally {
    client.close();
  }
}
