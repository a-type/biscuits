import { AppId, isValidAppId } from '@biscuits/apps';
import { Router } from 'itty-router';
import { URL } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { Readable } from 'stream';

export const appsRouter = Router({});

appsRouter.get('*', (req) => {
  // if the request URL has a subdomain that matches an app ID,
  // serve that app's static files
  // otherwise, do not handle the request (return undefined/void)
  const url = new URL(req.url);
  const [subdomain, domain, tld] = url.hostname.split('.');
  // support localhost, too... for localhost, there will only
  // be 2 parts. for deployed hosts, there should be 3.
  if (subdomain === 'localhost' || (!tld && domain !== 'localhost')) {
    return;
  }
  // if the subdomain is an app ID, serve the app
  // otherwise, do not handle the request
  if (isValidAppId(subdomain)) {
    const path = url.pathname;
    const stream = appFile(subdomain, path);
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': getContentType(path),
      } as any,
    });
  }
});

function appFile(appId: AppId, path: string): ReadableStream {
  return Readable.toWeb(fs.createReadStream(appPath(appId, path))) as any;
}

function appPath(appId: AppId, filePath: string) {
  if (isIndex(filePath)) {
    filePath = 'index.html';
  }
  return path.join(process.cwd(), '..', 'apps', appId, 'web', 'dist', filePath);
}

function getContentType(filePath: string): string | undefined {
  if (isIndex(filePath)) {
    return 'text/html';
  }
  const ext = path.extname(filePath);
  switch (ext) {
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpg';
    case '.wav':
      return 'audio/wav';
    case '.mp4':
      return 'video/mp4';
    case '.woff':
      return 'application/font-woff';
    case '.woff2':
      return 'application/font-woff2';
    case '.ttf':
      return 'application/font-ttf';
    case '.eot':
      return 'application/vnd.ms-fontobject';
    case '.otf':
      return 'application/font-otf';

    default:
      return undefined;
  }
}

function isIndex(filePath: string) {
  return filePath === '/' || filePath === '';
}
