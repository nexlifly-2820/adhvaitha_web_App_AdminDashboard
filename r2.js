// r2.js — Cloudflare R2 S3-Compatible Client
const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET || 'adhvaitha-media';
const publicUrl = (process.env.R2_PUBLIC_URL || 'https://media.nexlifly.in').replace(/\/$/, '');

// Warn if any variables are missing
if (!accountId) console.warn('[r2] Missing R2_ACCOUNT_ID in .env');
if (!accessKeyId) console.warn('[r2] Missing R2_ACCESS_KEY_ID in .env');
if (!secretAccessKey) console.warn('[r2] Missing R2_SECRET_ACCESS_KEY in .env');
if (!bucket) console.warn('[r2] Missing R2_BUCKET in .env');
if (!publicUrl) console.warn('[r2] Missing R2_PUBLIC_URL in .env');

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

module.exports = {
  r2,
  bucket,
  publicUrl,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
};

