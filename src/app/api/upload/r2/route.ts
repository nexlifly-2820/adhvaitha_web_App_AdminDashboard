import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const accountId = process.env.R2_ACCOUNT_ID || '6067b17e50f7aea148f74320af42e7c9';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '38594874e05b5b58e3526c578afd851c';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '740007304d0bf35d317a1974638c259b98620ca6c924d02b1a68da47033bf8c0';
const bucket = process.env.R2_BUCKET || 'adhvaitha-media';
const publicUrl = (process.env.R2_PUBLIC_URL || 'https://media.nexlifly.in').replace(/\/$/, '');

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: 'r2-active',
    bucket,
    publicUrl,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'adhvaitha_foods_media';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize extension
    const ext = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
    const cleanExt = ext.toLowerCase();
    const randomHex = crypto.randomBytes(8).toString('hex');
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const key = `${folder.replace(/^\/|\/$/g, '')}/${safeBaseName}_${randomHex}${cleanExt}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
      })
    );

    const fileUrl = `${publicUrl}/${key}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      secure_url: fileUrl,
      key,
      size: file.size,
      type: file.type
    });
  } catch (error: any) {
    console.error('[R2 Upload Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload to Cloudflare R2' }, { status: 500 });
  }
}

