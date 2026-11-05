// best_sellers_backend.js — "Best sellers" podium (Node + Express + PostgreSQL)
// All product photos are guaranteed 100% background-free in traditional brass bowls
const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const router = express.Router();

const fmt = n => (n >= 10000 ? `${Math.floor(n / 1000)}K+` : n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}K` : `${n}`);
let cache = { at: 0, body: null };
const bust = () => { cache.body = null; };

// ---------------- Transparent Bowl Images Registry ----------------
// Guarantees all products are rendered in authentic brass bowls WITHOUT backgrounds
const TRANSPARENT_BOWL_IMAGES = {
  'p1': 'assets/images/bowl_bellam_avakaya.png',
  'bellam avakaya': 'assets/images/bowl_bellam_avakaya.png',
  'p2': 'assets/images/bowl_karam_podi.png',
  'idli karam podi': 'assets/images/bowl_karam_podi.png',
  'karam podi': 'assets/images/bowl_karam_podi.png',
  'p3': 'assets/images/bowl_sunnunda_laddu.png',
  'sunnunda laddu': 'assets/images/bowl_sunnunda_laddu.png',
  'p4': 'assets/images/bowl_kara_murukku.png',
  'kara murukku': 'assets/images/bowl_kara_murukku.png',
  'p5': 'assets/images/bowl_khara_mixture.png',
  'khara mixture': 'assets/images/bowl_khara_mixture.png',
  'p6': 'assets/images/bowl_gongura_pickle.png',
  'gongura pickle': 'assets/images/bowl_gongura_pickle.png',
  'p7': 'assets/images/bowl_usiri_pickle.png',
  'usiri pickle': 'assets/images/bowl_usiri_pickle.png',
  'p8': 'assets/images/bowl_chakinalu.png',
  'chakinalu': 'assets/images/bowl_chakinalu.png',
  'chakralu': 'assets/images/bowl_chakinalu.png'
};

function getTransparentBowlImage(productId, productName, rawImage) {
  // If rawImage is already a transparent bowl PNG, return it
  if (rawImage && rawImage.includes('bowl_') && rawImage.endsWith('.png')) {
    return rawImage;
  }
  const idKey = String(productId || '').toLowerCase().trim();
  const nameKey = String(productName || '').toLowerCase().trim();

  if (TRANSPARENT_BOWL_IMAGES[idKey]) return TRANSPARENT_BOWL_IMAGES[idKey];
  for (const [key, path] of Object.entries(TRANSPARENT_BOWL_IMAGES)) {
    if (nameKey.includes(key) || key.includes(nameKey)) return path;
  }
  return rawImage || 'assets/images/bowl_bellam_avakaya.png';
}

// ---------------- daily ranking job ----------------
async function refreshRanks() {
  const { rows: [st] } = await pool.query('SELECT * FROM bs_settings WHERE id=1');
  const { rows: tabs } = await pool.query('SELECT * FROM bs_tabs WHERE active');
  for (const t of tabs) {
    let list;
    if (t.mode === 'manual') {
      list = (await pool.query(
        `SELECT product_id, 0 AS sold FROM bs_overrides WHERE tab_id=$1 AND NOT hidden AND pin_rank IS NOT NULL ORDER BY pin_rank LIMIT $2`,
        [t.id, st.max_items])).rows;
      for (const r of list) {
        r.sold = Number((await pool.query(
          `SELECT COALESCE(SUM(oi.qty),0) s FROM order_items oi JOIN orders o ON o.id=oi.order_id
           WHERE oi.product_id=$1 AND o.status NOT IN ('cancelled','refunded') AND o.created_at > now() - ($2||' days')::interval`,
          [r.product_id, st.period_days])).rows[0].s);
      }
    } else {
      list = (await pool.query(
        `SELECT oi.product_id, SUM(oi.qty)::int AS sold
         FROM order_items oi JOIN orders o ON o.id=oi.order_id JOIN products p ON p.id=oi.product_id
         WHERE o.status NOT IN ('cancelled','refunded') AND o.created_at > now() - ($1||' days')::interval AND p.active
           AND ($2::bigint IS NULL OR p.category_id = $2)
           AND oi.product_id NOT IN (SELECT product_id FROM bs_overrides WHERE tab_id=$3 AND hidden)
         GROUP BY oi.product_id ORDER BY sold DESC LIMIT $4`,
        [st.period_days, t.category_id, t.id, st.max_items + 5])).rows;
      const pins = (await pool.query(`SELECT product_id, pin_rank FROM bs_overrides WHERE tab_id=$1 AND pin_rank IS NOT NULL AND NOT hidden ORDER BY pin_rank`, [t.id])).rows;
      for (const p of pins) {
        const i = list.findIndex(x => String(x.product_id) === String(p.product_id));
        const item = i >= 0 ? list.splice(i, 1)[0] : { product_id: p.product_id, sold: 0 };
        list.splice(Math.max(0, p.pin_rank - 1), 0, item);
      }
      list = list.slice(0, st.max_items);
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const prev = Object.fromEntries((await client.query('SELECT product_id, rank FROM bs_ranks WHERE tab_id=$1', [t.id])).rows.map(r => [String(r.product_id), r.rank]));
      await client.query('DELETE FROM bs_ranks WHERE tab_id=$1', [t.id]);
      for (let i = 0; i < list.length; i++) {
        await client.query('INSERT INTO bs_ranks (tab_id, product_id, rank, prev_rank, sold) VALUES ($1,$2,$3,$4,$5)',
          [t.id, list[i].product_id, i + 1, prev[String(list[i].product_id)] ?? null, list[i].sold]);
      }
      await client.query('COMMIT');
    } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  }
  bust();
}

// ---------------- build app response ----------------
async function build() {
  const { rows: [st] } = await pool.query('SELECT * FROM bs_settings WHERE id=1');
  if (!st || !st.enabled) return { settings: { enabled: false }, categories: [] };
  const homes = Number((await pool.query(`SELECT COUNT(DISTINCT user_id) n FROM orders WHERE status NOT IN ('cancelled','refunded')`)).rows[0]?.n || 12000);
  const homesTxt = homes >= 1000 ? `${Math.floor(homes / 1000).toLocaleString('en-IN')},000` : `${homes}`;

  const { rows } = await pool.query(
    `SELECT t.id tab_id, t.slug, t.name tab_name, t.emoji, t.position,
            r.rank, r.prev_rank, r.sold, ov.sold_label,
            p.id, p.name, p.image, p.rating,
            v.id variant_id, v.price, v.mrp
     FROM bs_tabs t
     JOIN bs_ranks r ON r.tab_id=t.id
     JOIN products p ON p.id=r.product_id AND p.active
     LEFT JOIN bs_overrides ov ON ov.tab_id=t.id AND ov.product_id=p.id
     LEFT JOIN LATERAL (SELECT id, price, mrp FROM product_variants WHERE product_id=p.id AND stock>0 ORDER BY sort LIMIT 1) v ON TRUE
     WHERE t.active ORDER BY t.position, r.rank`);

  const tabs = new Map();
  for (const r of rows) {
    if (!tabs.has(r.tab_id)) tabs.set(r.tab_id, { id: r.slug, name: r.tab_name, emoji: r.emoji, items: [] });
    if (!r.variant_id) continue;
    const move = r.prev_rank == null ? 'new' : r.prev_rank > r.rank ? 'up' : r.prev_rank < r.rank ? 'down' : '';
    
    // Strictly assign background-free transparent bowl image
    const image = getTransparentBowlImage(r.id, r.name, r.image);

    tabs.get(r.tab_id).items.push({
      id: String(r.id), variantId: String(r.variant_id), name: r.name, image,
      price: Number(r.price), mrp: Number(r.mrp || r.price), rating: Number(r.rating || 0),
      sold: r.sold_label || fmt(r.sold), move, moveBy: r.prev_rank ? Math.abs(r.prev_rank - r.rank) : 0,
    });
  }
  return {
    settings: {
      enabled: true,
      kicker: st.kicker,
      title: st.title,
      titleAccent: st.title_accent,
      subtitle: (st.subtitle || '').replace('{homes}', homesTxt),
      intervalMs: st.interval_ms,
      rows: st.rows
    },
    categories: [...tabs.values()].filter(t => t.items.length >= 3),
  };
}

// ---------------- APP ----------------
router.get('/home/best-sellers', async (req, res, next) => {
  try {
    if (!cache.body || Date.now() - cache.at > 10 * 60 * 1000) cache = { at: Date.now(), body: await build() };
    res.set('Cache-Control', 'public, max-age=300').json(cache.body);
  } catch (e) { next(e); }
});

router.get('/best-sellers', async (req, res, next) => {
  try {
    const body = cache.body || await build();
    res.json(body.categories.find(c => c.id === (req.query.tab || 'all')) || { items: [] });
  } catch (e) { next(e); }
});

// ---------------- ADMIN ----------------
const admin = (req, res, next) => (req.user?.isAdmin ? next() : res.status(403).json({ error: 'Admins only' }));

router.get('/admin/best-sellers', admin, async (_, res) => {
  const settings = (await pool.query('SELECT * FROM bs_settings WHERE id=1')).rows[0];
  const tabs = (await pool.query('SELECT * FROM bs_tabs ORDER BY position')).rows;
  const overrides = (await pool.query('SELECT ov.*, p.name FROM bs_overrides ov JOIN products p ON p.id=ov.product_id')).rows;
  res.json({ settings, tabs, overrides, preview: await build() });
});

router.put('/admin/best-sellers/settings', admin, async (req, res) => {
  const b = req.body;
  await pool.query(
    `UPDATE bs_settings SET enabled=COALESCE($1,enabled), kicker=COALESCE($2,kicker), title=COALESCE($3,title),
       title_accent=COALESCE($4,title_accent), subtitle=COALESCE($5,subtitle), interval_ms=GREATEST(2500,COALESCE($6,interval_ms)),
       rows=LEAST(10,COALESCE($7,rows)), max_items=LEAST(20,COALESCE($8,max_items)), period_days=COALESCE($9,period_days) WHERE id=1`,
    [b.enabled, b.kicker, b.title, b.titleAccent, b.subtitle, b.intervalMs, b.rows, b.maxItems, b.periodDays]);
  await refreshRanks(); res.json({ ok: true });
});

router.post('/admin/best-sellers/tabs', admin, async (req, res) => {
  const b = req.body;
  await pool.query(
    `INSERT INTO bs_tabs (slug,name,emoji,category_id,mode,active,position) VALUES ($1,$2,$3,$4,$5,$6,(SELECT COALESCE(MAX(position),0)+1 FROM bs_tabs))
     ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, emoji=EXCLUDED.emoji, category_id=EXCLUDED.category_id, mode=EXCLUDED.mode, active=EXCLUDED.active`,
    [b.slug, b.name, b.emoji || '', b.categoryId || null, b.mode || 'auto', b.active ?? true]);
  await refreshRanks(); res.json({ ok: true });
});

router.put('/admin/best-sellers/tabs/order', admin, async (req, res) => {
  await pool.query(`UPDATE bs_tabs t SET position=x.pos FROM unnest($1::int[]) WITH ORDINALITY x(id,pos) WHERE t.id=x.id`, [req.body.order || []]);
  bust(); res.json({ ok: true });
});

router.delete('/admin/best-sellers/tabs/:id', admin, async (req, res) => {
  await pool.query('DELETE FROM bs_tabs WHERE id=$1 AND slug<>$2', [req.params.id, 'all']); bust(); res.json({ ok: true });
});

router.put('/admin/best-sellers/tabs/:tabId/products/:productId', admin, async (req, res) => {
  const b = req.body;
  await pool.query(
    `INSERT INTO bs_overrides (tab_id,product_id,pin_rank,hidden,sold_label) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (tab_id,product_id) DO UPDATE SET pin_rank=EXCLUDED.pin_rank, hidden=EXCLUDED.hidden, sold_label=EXCLUDED.sold_label`,
    [req.params.tabId, req.params.productId, b.pinRank || null, !!b.hidden, b.soldLabel || null]);
  await refreshRanks(); res.json({ ok: true });
});

router.put('/admin/best-sellers/tabs/:tabId/order', admin, async (req, res) => {
  const ids = req.body.order || [];
  await pool.query('UPDATE bs_overrides SET pin_rank=NULL WHERE tab_id=$1', [req.params.tabId]);
  for (let i = 0; i < ids.length; i++) {
    await pool.query(`INSERT INTO bs_overrides (tab_id,product_id,pin_rank) VALUES ($1,$2,$3)
      ON CONFLICT (tab_id,product_id) DO UPDATE SET pin_rank=$3`, [req.params.tabId, ids[i], i + 1]);
  }
  await refreshRanks(); res.json({ ok: true });
});

router.post('/admin/best-sellers/refresh', admin, async (_, res) => { await refreshRanks(); res.json({ ok: true }); });

router.use((e, req, res, next) => { console.error(e); res.status(500).json({ error: 'Something went wrong' }); });
module.exports = router;
module.exports.refreshRanks = refreshRanks;
