import * as fs from 'fs/promises';
import * as path from 'path';
import { URL } from 'url';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';

export interface SsgResult {
  url: string;
}

export interface SsgStorage {
  upload: (pathname: string, html: string) => Promise<SsgResult>;
  delete: (pathname: string) => Promise<void>;
  readonly origin: string;
}

interface SsgLocalStorageOptions {
  rootRelativeToRepo: string;
  localAppOrigin: string;
}

export class SsgLocalStorage implements SsgStorage {
  constructor(private opts: SsgLocalStorageOptions) {}

  get origin() {
    return this.opts.localAppOrigin;
  }

  async upload(pathname: string, html: string): Promise<SsgResult> {
    await fs.writeFile(
      path.join(this.opts.rootRelativeToRepo, pathname, 'index.html'),
      html,
    );
    const url = new URL(pathname, this.opts.localAppOrigin).toString();
    return { url };
  }

  async delete(pathname: string): Promise<void> {
    await fs.rm(path.join(this.opts.rootRelativeToRepo, pathname), {
      recursive: true,
    });
  }
}

export class SsgS3Storage implements SsgStorage {
  private client: S3Client;

  constructor(private opts: { bucket: string; origin: string }) {
    this.client = new S3Client({});
  }

  get origin() {
    return this.opts.origin;
  }

  async upload(pathname: string, html: string): Promise<SsgResult> {
    const { client } = this;
    await client.send(
      new PutObjectCommand({
        Bucket: this.opts.bucket,
        Key: pathname + '/index.html',
        Body: html,
        ContentType: 'text/html',
      }),
    );
    return { url: new URL(pathname, this.opts.origin).toString() };
  }

  async delete(pathname: string): Promise<void> {
    const { client } = this;
    // delete all objects in the directory
    const { Contents } = await client.send(
      new ListObjectsCommand({
        Bucket: this.opts.bucket,
        Prefix: pathname,
      }),
    );
    if (Contents) {
      await Promise.all(
        Contents.map((content) => {
          return client.send(
            new DeleteObjectCommand({
              Bucket: this.opts.bucket,
              Key: content.Key!,
            }),
          );
        }),
      );
    }
  }
}
