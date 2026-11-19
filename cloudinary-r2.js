// cloudinary-r2.js — Drop-in Cloudflare R2 adapter for Cloudinary v2 SDK
const { r2, bucket, publicUrl, PutObjectCommand, DeleteObjectCommand } = require('./r2');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

async function upload(fileSource, options = {}) {
  let buffer;
  let filename = '';
  let contentType = 'application/octet-stream';

  const folder = options.folder ? options.folder.replace(/^\/|\/$/g, '') : 'uploads';

  if (Buffer.isBuffer(fileSource)) {
    buffer = fileSource;
  } else if (typeof fileSource === 'string') {
    if (fileSource.startsWith('data:')) {
      const match = fileSource.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        contentType = match[1];
        buffer = Buffer.from(match[2], 'base64');
      }
    } else if (fileSource.startsWith('http://') || fileSource.startsWith('https://')) {
      const res = await fetch(fileSource);
      const arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      contentType = res.headers.get('content-type') || contentType;
    } else if (fs.existsSync(fileSource)) {
      buffer = fs.readFileSync(fileSource);
      filename = path.basename(fileSource);
    }
  }

  if (!buffer) {
    throw new Error('Invalid file source for R2 upload');
  }

  const ext = filename ? path.extname(filename) : (contentType.split('/')[1] ? `.${contentType.split('/')[1]}` : '.bin');
  const publicId = options.public_id || crypto.randomBytes(12).toString('hex');
  const key = `${folder}/${publicId}${ext}`;

  await r2.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  const url = `${publicUrl}/${key}`;

  return {
    public_id: publicId,
    key,
    version: Date.now(),
    url,
    secure_url: url,
    format: ext.replace(/^\./, ''),
    resource_type: options.resource_type || (contentType.startsWith('video/') ? 'video' : 'image'),
    bytes: buffer.length,
    created_at: new Date().toISOString()
  };
}

async function destroy(publicId, options = {}) {
  await r2.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: publicId
  })).catch(() => {});

  return { result: 'ok' };
}

const v2 = {
  config: (cfg) => {},
  uploader: {
    upload,
    destroy,
    upload_stream: (options, callback) => {
      const chunks = [];
      const { Writable } = require('stream');
      return new Writable({
        write(chunk, encoding, next) {
          chunks.push(chunk);
          next();
        },
        async final(done) {
          try {
            const result = await upload(Buffer.concat(chunks), options);
            if (callback) callback(null, result);
            done();
          } catch (err) {
            if (callback) callback(err);
            done(err);
          }
        }
      });
    }
  },
  url: (publicId, options = {}) => {
    return `${publicUrl}/${publicId}`;
  }
};

module.exports = { v2 };

