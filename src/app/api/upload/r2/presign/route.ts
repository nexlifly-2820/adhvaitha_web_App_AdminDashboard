import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const accountId = process.env.R2_ACCOUNT_ID || '6067b17e50f7aea148f74320af42e7c9';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '38594874e05b5b58e3526c578afd851c';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '740007304d0bf35d317a1974638c259b98620ca6c924d02b1a68da47033bf8c0';
const bucket = process.env.R2_BUCKET || 'adhvaitha-media';
const publicUrl = (process.env.R2_PUBLIC_URL || 'https://media.nexlifly.in').replace(/\/$/, '');

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filename = String(body.filename || 'media.mp4');
    const contentType = String(body.contentType || 'video/mp4');
    const folder = String(body.folder || 'adhvaitha_foods_videos');

    const ext = filename.includes('.') ? `.${filename.split('.').pop()}` : '';
    const cleanExt = ext.toLowerCase();
    const randomHex = crypto.randomBytes(8).toString('hex');
    const safeBaseName = filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const key = `${folder.replace(/^\/|\/$/g, '')}/${safeBaseName}_${randomHex}${cleanExt}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    const finalPublicUrl = `${publicUrl}/${key}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl: finalPublicUrl,
      key,
    });
  } catch (error: any) {
    console.error('Presign error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

