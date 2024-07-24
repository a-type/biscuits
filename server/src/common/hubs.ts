import * as path from 'path';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';

const assetFileTypes: Record<string, string> = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export async function staticFile(
  basePath: string,
  prefix: string,
  req: Request,
) {
  const url = new URL(req.url);
  const filePath = path.join(basePath, url.pathname.replace(`/${prefix}`, ''));

  if (!fsSync.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const file = await fs.readFile(filePath, 'utf-8');
  return new Response(file, {
    headers: {
      'Content-Type': assetFileTypes[path.extname(filePath)] ?? 'text/plain',
    },
  });
}

export function renderTemplate(
  indexTemplate: string,
  appHtml: string,
  data?: any,
) {
  let val = indexTemplate.replace(`<!--app-html-->`, appHtml);
  if (data) {
    val = val.replace(`{/*snapshot*/}`, JSON.stringify(data));
  }
  return new Response(val, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
