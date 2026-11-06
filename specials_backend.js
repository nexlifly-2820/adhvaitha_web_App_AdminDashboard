// specials_backend.js — "Ambhujakshi Specials" (home tiles + Lotus Eye page) — Node + Express + PostgreSQL
//   npm i express pg multer sharp
//   app.use(express.json());
//   app.use('/uploads', express.static('uploads'));
//   app.use('/api', auth, require('./specials_backend'));

const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();
const wrap = fn => (req, res, next) => fn(req, res).catch(next);
const PUBLIC = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
const abs = u => (!u ? '' : /^https?:\/\//.test(u) ? u : PUBLIC + (u.startsWith('/') ? u : '/' + u));
const bad = msg => Object.assign(new Error(msg), { status: 400 });
const ICONS = ['recipe', 'leaf', 'jar', 'sun', 'fire', 'hand', 'ghee', 'heart', 'star', 'truck'];
let cache = null, cacheAt = 0;
const clear = () => { cache = null; };

router.get('/specials', wrap(async (req, res) => {
  if (cache && Date.now() - cacheAt < 60_000) return res.json(cache);
  const { rows: [s] } = await pool.query('SELECT * FROM specials_settings WHERE id=1');
  const { rows } = await pool.query('SELECT * FROM specials WHERE enabled ORDER BY sort, id');
  const items = rows.map(r => ({
    id: String(r.id), productId: r.product_id || '', name: r.name, story: r.story || '', image: abs(r.image),
    features: (r.features || []).filter(f => f && f.text).slice(0, 3).map(f => ({ icon: ICONS.includes(f.icon) ? f.icon : 'star', text: String(f.text) })),
    variants: (r.variants || []).filter(v => v && v.label && Number(v.price) > 0)
      .map(v => ({ id: String(v.id || ''), label: String(v.label), price: Number(v.price), mrp: Number(v.mrp) || 0 })),
    defaultVariant: r.default_variant || 0,
  })).filter(i => i.image && i.variants.length);
  const t = s || {};
  cache = {
    settings: { enabled: t.enabled !== false, title: t.title || 'AMBHUJAKSHI', subtitle: t.subtitle || 'SPECIALS',
      tagline: t.tagline || 'Seen through the Lotus Eye', tagText: t.tag_text || "AMMA'S SPECIAL", moreText: t.more_text || 'MORE SPECIALS',
      showIntro: t.show_intro !== false },
    items,
  };
  cacheAt = Date.now();
  res.json(cache);
}));

// ---------------- ADMIN ----------------
const admin = (req, res, next) => (req.user?.isAdmin ? next() : res.status(403).json({ error: 'Admins only' }));

router.get('/admin/specials/settings', admin, wrap(async (req, res) =>
  res.json((await pool.query('SELECT * FROM specials_settings WHERE id=1')).rows[0])));
router.put('/admin/specials/settings', admin, wrap(async (req, res) => {
  const b = req.body;
  await pool.query(`UPDATE specials_settings SET enabled=COALESCE($1,enabled), title=COALESCE($2,title), subtitle=COALESCE($3,subtitle),
    tagline=COALESCE($4,tagline), tag_text=COALESCE($5,tag_text), more_text=COALESCE($6,more_text), show_intro=COALESCE($7,show_intro) WHERE id=1`,
    [b.enabled ?? null, b.title ?? null, b.subtitle ?? null, b.tagline ?? null, b.tagText ?? null, b.moreText ?? null, b.showIntro ?? null]);
  clear();
  res.json({ ok: true });
}));

router.get('/admin/specials', admin, wrap(async (req, res) =>
  res.json((await pool.query('SELECT * FROM specials ORDER BY sort, id')).rows)));

const MAP = { productId: 'product_id', name: 'name', story: 'story', image: 'image', features: 'features', variants: 'variants', defaultVariant: 'default_variant', enabled: 'enabled' };
function check(b) {
  if (b.name != null && (!String(b.name).trim() || String(b.name).length > 18)) throw bad('Name is required, max 18 letters');
  if (b.story != null && String(b.story).length > 80) throw bad('Story max 80 letters (one line in the app)');
  if (b.features != null) {
    if (!Array.isArray(b.features) || b.features.length > 3) throw bad('Up to 3 features');
    b.features = JSON.stringify(b.features.map(f => ({ icon: ICONS.includes(f.icon) ? f.icon : 'star', text: String(f.text || '').slice(0, 28) })).filter(f => f.text));
  }
  if (b.variants != null) {
    if (!Array.isArray(b.variants) || !b.variants.length || b.variants.length > 3) throw bad('Add 1 to 3 weights');
    b.variants = JSON.stringify(b.variants.map(v => {
      if (!String(v.label || '').trim() || !(Number(v.price) > 0)) throw bad('Every weight needs a label (e.g. 250 g) and a price');
      return { id: String(v.id || ''), label: String(v.label).trim().slice(0, 8), price: Number(v.price), mrp: Number(v.mrp) || 0 };
    }));
  }
  if (b.defaultVariant != null) b.defaultVariant = Math.max(0, Math.min(2, parseInt(b.defaultVariant, 10) || 0));
}

router.post('/admin/specials', admin, wrap(async (req, res) => {
  const b = req.body;
  if (!b.name) throw bad('Name is required');
  check(b);
  const keys = Object.keys(MAP).filter(k => k in b);
  const { rows: [r] } = await pool.query(
    `INSERT INTO specials (${keys.map(k => MAP[k]).concat('sort')}) VALUES (${keys.map((_, i) => `$${i + 1}`).concat('(SELECT COALESCE(MAX(sort),0)+1 FROM specials)')}) RETURNING *`,
    keys.map(k => b[k]));
  clear();
  res.json(r);
}));
router.put('/admin/specials/:id', admin, wrap(async (req, res) => {
  const b = req.body; check(b);
  const keys = Object.keys(MAP).filter(k => k in b);
  if (!keys.length) throw bad('Nothing to update');
  const { rowCount } = await pool.query(`UPDATE specials SET ${keys.map((k, i) => `${MAP[k]}=$${i + 1}`)} WHERE id=$${keys.length + 1}`, [...keys.map(k => b[k]), req.params.id]);
  if (!rowCount) return res.status(404).json({ error: 'Not found' });
  clear();
  res.json({ ok: true });
}));
router.delete('/admin/specials/:id', admin, wrap(async (req, res) => {
  await pool.query('DELETE FROM specials WHERE id=$1', [req.params.id]);
  clear();
  res.json({ ok: true });
}));
router.put('/admin/specials-order', admin, wrap(async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  for (let i = 0; i < ids.length; i++) await pool.query('UPDATE specials SET sort=$1 WHERE id=$2', [i + 1, ids[i]]);
  clear();
  res.json({ ok: true });
}));

fs.mkdirSync('uploads', { recursive: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, f, cb) => cb(null, /^image\/(png|jpe?g|webp)$/.test(f.mimetype)) });
router.post('/admin/specials-upload', admin, upload.single('image'), wrap(async (req, res) => {
  if (!req.file) throw bad('Send a PNG/JPG/WebP photo in the "image" field');
  const buf = await sharp(req.file.buffer).rotate().resize(800, 800, { fit: 'inside', withoutEnlargement: true }).png().toBuffer();
  const name = `special_${crypto.randomBytes(8).toString('hex')}.png`;
  fs.writeFileSync(path.join('uploads', name), buf);
  res.json({ ok: true, path: `/uploads/${name}`, url: abs(`/uploads/${name}`) });
}));

module.exports = router;
