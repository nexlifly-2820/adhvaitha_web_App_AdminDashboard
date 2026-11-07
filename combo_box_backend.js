// combo_box_backend.js — "Amma's Combo Box" v2 — Node + Express + PostgreSQL
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
const money = n => Math.round(n * 100) / 100;
const norm = s => String(s || '').toLowerCase().replace(/\s+/g, '');

let cache = null, cacheAt = 0;
const clear = () => { cache = null; };

async function getSettings() {
  const { rows: [s] } = await pool.query('SELECT * FROM combo_settings WHERE id=1');
  const t = s || {};
  return {
    enabled: t.enabled !== false, eyebrow: t.eyebrow || 'BUILD YOUR BOX', titleStart: t.title_start ?? "Amma's",
    titleAccent: t.title_accent ?? 'Combo Box', jars: t.jars || 4, boxLabel: t.box_label ?? "Amma's Combo",
    lidText: t.lid_text ?? 'Made with love,\npacked by Amma', tagText: t.tag_text ?? 'For you, with love 💛',
    sizes: Array.isArray(t.sizes) && t.sizes.length ? t.sizes : ['250 g', '500 g', '1 kg'],
    tiers: (Array.isArray(t.tiers) ? t.tiers : []).map(x => ({ jars: Number(x.jars), percent: Number(x.percent) }))
      .filter(x => x.jars > 0 && x.percent > 0).sort((a, b) => a.jars - b.jars),
    categories: Array.isArray(t.categories) && t.categories.length ? t.categories : ['Pickles', 'Podis', 'Snacks', 'Sweets'],
    homeLine: t.home_line ?? 'pick any 4 jars, Amma packs them', homeTitle: t.home_title ?? 'Fill the box,',
    homeAccent: t.home_accent ?? 'save more', homeButton: t.home_button ?? 'Start building your box',
  };
}

const percentFor = (tiers, n) => tiers.reduce((p, t) => (n >= t.jars ? t.percent : p), 0);

async function comboProducts(sizes, onlyEnabled) {
  const { rows } = await pool.query(
    `SELECT c.*, p.name, p.image_url, p.is_active FROM combo_products c JOIN products p ON p.id = c.product_id
      ${onlyEnabled ? 'WHERE c.enabled AND p.is_active IS NOT FALSE' : ''} ORDER BY c.sort, c.id`);
  if (!rows.length) return [];
  const { rows: vs } = await pool.query(
    'SELECT id, product_id, label, price, mrp, in_stock, stock_qty FROM product_variants WHERE product_id = ANY($1)',
    [rows.map(r => r.product_id)]);
  return rows.map(r => {
    const prices = {};
    for (const size of sizes) {
      const v = vs.find(x => x.product_id === r.product_id && norm(x.label) === norm(size));
      if (v) prices[size] = { variantId: String(v.id), price: Number(v.price), mrp: Number(v.mrp || v.price),
        inStock: v.in_stock !== false && (v.stock_qty == null || v.stock_qty > 0) };
    }
    return { id: String(r.id), productId: String(r.product_id), name: r.name, image: abs(r.image || r.image_url),
      category: r.category || '', color1: r.color1, color2: r.color2, enabled: r.enabled, rawImage: r.image || '', prices };
  });
}

// ---------------- PUBLIC API ----------------
router.get('/combo-box', wrap(async (req, res) => {
  if (cache && Date.now() - cacheAt < 60_000) return res.json(cache);
  const s = await getSettings();
  const products = (await comboProducts(s.sizes, true)).filter(p => Object.keys(p.prices).length);
  const sizes = s.sizes.filter(z => products.filter(p => p.prices[z]).length >= s.jars);
  cache = { settings: { ...s, sizes }, products: products.map(({ enabled, rawImage, color1, color2, ...p }) => p) };
  cacheAt = Date.now();
  res.json(cache);
}));

// ---------------- ADMIN API ----------------
const admin = (req, res, next) => (req.user?.isAdmin ? next() : res.status(403).json({ error: 'Admins only' }));

router.get('/admin/combo-box/settings', admin, wrap(async (req, res) => res.json(await getSettings())));
router.put('/admin/combo-box/settings', admin, wrap(async (req, res) => {
  const b = req.body;
  await pool.query(`UPDATE combo_settings SET
    enabled = COALESCE($1, enabled),
    eyebrow = COALESCE($2, eyebrow),
    title_start = COALESCE($3, title_start),
    title_accent = COALESCE($4, title_accent),
    jars = COALESCE($5, jars),
    box_label = COALESCE($6, box_label),
    lid_text = COALESCE($7, lid_text),
    tag_text = COALESCE($8, tag_text),
    sizes = COALESCE($9, sizes),
    tiers = COALESCE($10, tiers),
    categories = COALESCE($11, categories),
    home_line = COALESCE($12, home_line),
    home_title = COALESCE($13, home_title),
    home_accent = COALESCE($14, home_accent),
    home_button = COALESCE($15, home_button)
    WHERE id = 1`, [
      b.enabled ?? null, b.eyebrow ?? null, b.titleStart ?? null, b.titleAccent ?? null,
      b.jars ?? null, b.boxLabel ?? null, b.lidText ?? null, b.tagText ?? null,
      b.sizes ? JSON.stringify(b.sizes) : null,
      b.tiers ? JSON.stringify(b.tiers) : null,
      b.categories ? JSON.stringify(b.categories) : null,
      b.homeLine ?? null, b.homeTitle ?? null, b.homeAccent ?? null, b.homeButton ?? null
    ]);
  clear();
  res.json({ ok: true });
}));

router.get('/admin/combo-box/products', admin, wrap(async (req, res) => {
  const s = await getSettings();
  const list = await comboProducts(s.sizes, false);
  res.json(list);
}));

router.post('/admin/combo-box/products', admin, wrap(async (req, res) => {
  const pid = parseInt(req.body.productId, 10);
  if (!pid) throw bad('Product ID is required');
  const cat = String(req.body.category || 'Pickles').slice(0, 30);
  const { rows: [r] } = await pool.query(
    `INSERT INTO combo_products (product_id, category, sort) VALUES ($1,$2,(SELECT COALESCE(MAX(sort),0)+1 FROM combo_products))
     ON CONFLICT (product_id) DO UPDATE SET category = EXCLUDED.category RETURNING *`, [pid, cat]);
  clear();
  res.json(r);
}));

router.post('/admin/combo-box/products/bulk', admin, wrap(async (req, res) => {
  const ids = (Array.isArray(req.body.productIds) ? req.body.productIds : String(req.body.productIds || '').split(/[\s,]+/))
    .map(x => parseInt(x, 10)).filter(Boolean);
  if (!ids.length) throw bad('Enter product IDs');
  const category = String(req.body.category || '').slice(0, 30);
  const { rows: found } = await pool.query('SELECT id FROM products WHERE id = ANY($1)', [ids]);
  const ok = found.map(r => r.id);
  let added = 0;
  for (const pid of ids.filter(i => ok.includes(i))) {
    const { rowCount } = await pool.query(
      `INSERT INTO combo_products (product_id, category, sort) VALUES ($1,$2,(SELECT COALESCE(MAX(sort),0)+1 FROM combo_products))
       ON CONFLICT (product_id) DO NOTHING`, [pid, category]);
    added += rowCount;
  }
  clear();
  res.json({ ok: true, added, notFound: ids.filter(i => !ok.includes(i)) });
}));

router.put('/admin/combo-box/products/:id', admin, wrap(async (req, res) => {
  const b = req.body;
  const updates = [];
  const vals = [];
  let idx = 1;
  if (b.category != null) { updates.push(`category = $${idx++}`); vals.push(String(b.category)); }
  if (b.image != null) { updates.push(`image = $${idx++}`); vals.push(String(b.image)); }
  if (b.color1 != null) { updates.push(`color1 = $${idx++}`); vals.push(String(b.color1)); }
  if (b.color2 != null) { updates.push(`color2 = $${idx++}`); vals.push(String(b.color2)); }
  if (b.enabled != null) { updates.push(`enabled = $${idx++}`); vals.push(!!b.enabled); }
  if (!updates.length) return res.json({ ok: true });
  vals.push(req.params.id);
  await pool.query(`UPDATE combo_products SET ${updates.join(', ')} WHERE id = $${idx}`, vals);
  clear();
  res.json({ ok: true });
}));

router.delete('/admin/combo-box/products/:id', admin, wrap(async (req, res) => {
  await pool.query('DELETE FROM combo_products WHERE id = $1', [req.params.id]);
  clear();
  res.json({ ok: true });
}));

router.put('/admin/combo-box/products/order', admin, wrap(async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  for (let i = 0; i < ids.length; i++) {
    await pool.query('UPDATE combo_products SET sort = $1 WHERE id = $2', [i + 1, ids[i]]);
  }
  clear();
  res.json({ ok: true });
}));

fs.mkdirSync('uploads', { recursive: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, f, cb) => cb(null, /^image\/(png|jpe?g|webp)$/.test(f.mimetype)) });

router.post('/admin/combo-box/upload', admin, upload.single('image'), wrap(async (req, res) => {
  if (!req.file) throw bad('Send a PNG/JPG/WebP photo in the "image" field');
  const buf = await sharp(req.file.buffer).rotate().resize(600, 600, { fit: 'inside', withoutEnlargement: true }).png().toBuffer();
  const name = `combo_${crypto.randomBytes(8).toString('hex')}.png`;
  fs.writeFileSync(path.join('uploads', name), buf);
  res.json({ ok: true, path: `/uploads/${name}`, url: abs(`/uploads/${name}`) });
}));

module.exports = router;
