/**
 * ADHVAITHA REWARDS: SCRATCH & SAVE SYSTEM MODULE
 * Implements Admin Routes & Automatic Order Lifecycle Integration
 */

const express = require('express');
const router = express.Router();

// Helper database pool reference (e.g. pg Pool or MySQL / memory fallback)
let dbPool = null;

function setDb(pool) {
  dbPool = pool;
}

// ---------------------------------------------------------------------------
// 1. ADMIN API ROUTES
// ---------------------------------------------------------------------------

// GET /api/admin/rewards/ladder - View all 4 ladder step rules
router.get('/admin/rewards/ladder', async (req, res) => {
  try {
    if (dbPool) {
      const { rows } = await dbPool.query('SELECT * FROM reward_ladder ORDER BY step ASC');
      return res.json({ success: true, data: rows });
    }
    // Default fallback ladder
    return res.json({
      success: true,
      data: [
        { step: 1, unlock_after: 0, is_big: false, active: true, title: "Free on Signup" },
        { step: 2, unlock_after: 1, is_big: false, active: true, title: "1st Delivered Order" },
        { step: 3, unlock_after: 2, is_big: false, active: true, title: "2nd Delivered Order" },
        { step: 4, unlock_after: 3, is_big: true, active: true, title: "Big Prize Milestone 🎁" }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/rewards/ladder/:step - Update required delivered orders for a step
router.put('/admin/rewards/ladder/:step', async (req, res) => {
  try {
    const step = parseInt(req.params.step, 10);
    const { unlock_after, is_big, active } = req.body;
    if (dbPool) {
      const { rows } = await dbPool.query(
        `UPDATE reward_ladder 
         SET unlock_after = COALESCE($1, unlock_after),
             is_big = COALESCE($2, is_big),
             active = COALESCE($3, active)
         WHERE step = $4
         RETURNING *`,
        [unlock_after, is_big, active, step]
      );
      return res.json({ success: true, data: rows[0] });
    }
    return res.json({ success: true, message: `Step ${step} updated`, data: { step, unlock_after, is_big, active } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/rewards/offers - List all reward offers in the prize pool
router.get('/admin/rewards/offers', async (req, res) => {
  try {
    const { step, active } = req.query;
    if (dbPool) {
      let query = 'SELECT * FROM reward_offers WHERE 1=1';
      const params = [];
      if (step) {
        params.push(step);
        query += ` AND step = $${params.length}`;
      }
      if (active !== undefined) {
        params.push(active === 'true');
        query += ` AND active = $${params.length}`;
      }
      query += ' ORDER BY step ASC, weight DESC';
      const { rows } = await dbPool.query(query, params);
      return res.json({ success: true, data: rows });
    }
    // Default mock list
    return res.json({
      success: true,
      data: [
        { id: 1, step: 1, title: "₹50 OFF", subtitle: "Welcome gift on orders above ₹399", discount_type: "flat", value: 50, min_order: 399, valid_days: 7, weight: 50, budget_limit: 1000, issued_count: 245, active: true },
        { id: 2, step: 1, title: "10% OFF", subtitle: "Welcome gift on any royal order", discount_type: "percent", value: 10, max_discount: 75, min_order: 0, valid_days: 7, weight: 50, budget_limit: 1000, issued_count: 198, active: true },
        { id: 3, step: 2, title: "₹100 OFF", subtitle: "on your next order above ₹699", discount_type: "flat", value: 100, min_order: 699, valid_days: 7, weight: 60, budget_limit: 500, issued_count: 132, active: true },
        { id: 4, step: 2, title: "15% OFF", subtitle: "Special repeat order discount", discount_type: "percent", value: 15, max_discount: 150, min_order: 500, valid_days: 7, weight: 40, budget_limit: 500, issued_count: 88, active: true },
        { id: 5, step: 3, title: "₹150 OFF", subtitle: "Loyalty reward on orders above ₹899", discount_type: "flat", value: 150, min_order: 899, valid_days: 10, weight: 70, budget_limit: 300, issued_count: 64, active: true },
        { id: 6, step: 3, title: "FREE PODI PACK", subtitle: "Complimentary Idli Karam Podi", discount_type: "free_item", value: 99, free_product_id: 102, min_order: 599, valid_days: 10, weight: 30, budget_limit: 200, issued_count: 42, active: true },
        { id: 7, step: 4, title: "₹300 MEGA OFF", subtitle: "Milestone grand discount on ₹1299+", discount_type: "flat", value: 300, min_order: 1299, valid_days: 14, weight: 40, budget_limit: 100, issued_count: 28, active: true },
        { id: 8, step: 4, title: "FREE SWEET BOX", subtitle: "Grand celebration gift box with Sunnunda Laddus", discount_type: "free_item", value: 349, free_product_id: 105, min_order: 999, valid_days: 14, weight: 60, budget_limit: 100, issued_count: 36, active: true }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/rewards/offers - Create a new reward offer
router.post('/admin/rewards/offers', async (req, res) => {
  try {
    const { step, title, subtitle, image, discount_type, value, max_discount, min_order, free_product_id, valid_days, weight, budget_limit } = req.body;
    if (dbPool) {
      const { rows } = await dbPool.query(
        `INSERT INTO reward_offers 
         (step, title, subtitle, image, discount_type, value, max_discount, min_order, free_product_id, valid_days, weight, budget_limit)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING *`,
        [step, title, subtitle || '', image || '', discount_type, value, max_discount || null, min_order || 0, free_product_id || null, valid_days || 7, weight || 1, budget_limit || null]
      );
      return res.status(201).json({ success: true, data: rows[0] });
    }
    return res.status(201).json({ success: true, data: { id: Date.now(), ...req.body, issued_count: 0 } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/admin/rewards/offers/:id - Update or deactivate an offer
router.put('/admin/rewards/offers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;
    if (dbPool) {
      const keys = Object.keys(updates).filter(k => k !== 'id');
      const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
      const values = keys.map(k => updates[k]);
      values.push(id);
      const { rows } = await dbPool.query(
        `UPDATE reward_offers SET ${setClause} WHERE id = $${values.length} RETURNING *`,
        values
      );
      return res.json({ success: true, data: rows[0] });
    }
    return res.json({ success: true, message: `Offer #${id} updated`, data: { id, ...updates } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/rewards/stats - View reward usage statistics
router.get('/admin/rewards/stats', async (req, res) => {
  try {
    if (dbPool) {
      const cardsResult = await dbPool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status != 'locked') as cards_issued,
          COUNT(*) FILTER (WHERE status = 'used') as coupons_used,
          COUNT(*) FILTER (WHERE status = 'expired') as coupons_expired,
          COUNT(*) FILTER (WHERE status IN ('revealed', 'reserved')) as coupons_active
        FROM user_cards
      `);
      const row = cardsResult.rows[0];
      const issued = parseInt(row.cards_issued || 0, 10);
      const used = parseInt(row.coupons_used || 0, 10);
      const expired = parseInt(row.coupons_expired || 0, 10);
      const active = parseInt(row.coupons_active || 0, 10);
      const rate = issued > 0 ? ((used / issued) * 100).toFixed(1) : 0;

      return res.json({
        success: true,
        data: {
          cards_issued: issued,
          coupons_used: used,
          coupons_expired: expired,
          coupons_active: active,
          redemption_rate: parseFloat(rate),
          total_revenue_generated: used * 850
        }
      });
    }

    return res.json({
      success: true,
      data: {
        cards_issued: 833,
        coupons_used: 516,
        coupons_expired: 149,
        coupons_active: 168,
        redemption_rate: 61.9,
        total_revenue_generated: 438600
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 2. AUTOMATIC ORDER LIFECYCLE FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Triggered when an order status becomes DELIVERED
 */
async function onOrderDelivered(userId, orderId, orderTotal) {
  console.log(`[Rewards] onOrderDelivered: user=${userId}, order=${orderId}, total=${orderTotal}`);
  if (!dbPool) return;

  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get or create user_reward_state
    let { rows: stateRows } = await client.query(
      'SELECT * FROM user_reward_state WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    if (stateRows.length === 0) {
      const inserted = await client.query(
        'INSERT INTO user_reward_state (user_id, cycle, delivered_count, counted_orders) VALUES ($1, 1, 0, $2) RETURNING *',
        [userId, [orderId]]
      );
      stateRows = inserted.rows;
    }

    const state = stateRows[0];
    if (state.counted_orders.includes(String(orderId)) || state.counted_orders.includes(Number(orderId))) {
      await client.query('COMMIT');
      return; // Order already counted
    }

    // 2. Increment delivered count
    const newDelivered = state.delivered_count + 1;
    const newCounted = [...state.counted_orders, orderId];
    await client.query(
      'UPDATE user_reward_state SET delivered_count = $1, counted_orders = $2 WHERE user_id = $3',
      [newDelivered, newCounted, userId]
    );

    // 3. Check ladder steps to unlock
    const { rows: ladderSteps } = await client.query(
      'SELECT * FROM reward_ladder WHERE active = true ORDER BY step ASC'
    );

    for (const step of ladderSteps) {
      if (newDelivered >= step.unlock_after) {
        // Unlock card if currently locked or absent
        await client.query(
          `INSERT INTO user_cards (user_id, cycle, step, unlock_after, is_big, status, unlocked_at)
           VALUES ($1, $2, $3, $4, $5, 'new', now())
           ON CONFLICT (user_id, cycle, step) DO UPDATE
             SET status = CASE WHEN user_cards.status = 'locked' THEN 'new' ELSE user_cards.status END,
                 unlocked_at = COALESCE(user_cards.unlocked_at, now())`,
          [userId, state.cycle, step.step, step.unlock_after, step.is_big]
        );
      }
    }

    // 4. If all 4 steps completed and cycle finishes, advance cycle if needed
    if (newDelivered >= 4) {
      // User can roll over to cycle + 1
      await client.query(
        'UPDATE user_reward_state SET cycle = cycle + 1, delivered_count = 0 WHERE user_id = $1',
        [userId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Rewards] Error in onOrderDelivered:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Triggered when an order is CANCELLED or REFUNDED
 */
async function onOrderCancelled(userId, orderId) {
  console.log(`[Rewards] onOrderCancelled: user=${userId}, order=${orderId}`);
  if (!dbPool) return;

  try {
    await dbPool.query(
      `UPDATE user_reward_state 
       SET delivered_count = GREATEST(0, delivered_count - 1),
           counted_orders = array_remove(counted_orders, $1::bigint)
       WHERE user_id = $2 AND $1 = ANY(counted_orders)`,
      [orderId, userId]
    );
  } catch (err) {
    console.error('[Rewards] Error in onOrderCancelled:', err);
  }
}

/**
 * Hourly cron job to expire old revealed coupons
 */
async function expireOld() {
  console.log('[Rewards] Running expireOld cron job...');
  if (!dbPool) return;

  try {
    const result = await dbPool.query(`
      UPDATE user_cards
      SET status = 'expired'
      WHERE status IN ('revealed', 'reserved')
        AND expires_at IS NOT NULL
        AND expires_at < now()
    `);
    console.log(`[Rewards] Expired ${result.rowCount || 0} old cards.`);
  } catch (err) {
    console.error('[Rewards] Error in expireOld:', err);
  }
}

module.exports = {
  router,
  setDb,
  onOrderDelivered,
  onOrderCancelled,
  expireOld
};
