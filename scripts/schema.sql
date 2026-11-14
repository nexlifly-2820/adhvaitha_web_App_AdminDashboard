-- ==============================================================================
-- ADHVAITHA REWARDS: SCRATCH & SAVE DATABASE SCHEMA
-- PostgreSQL schema for 4-Step Reward Ladder, Prize Pool, User Cards & State
-- ==============================================================================

-- 1. LADDER STEPS (4 steps)
CREATE TABLE IF NOT EXISTS reward_ladder (
  step          INT PRIMARY KEY,               -- 1, 2, 3, 4
  unlock_after  INT NOT NULL,                  -- Delivered orders required (0 = free on signup)
  is_big        BOOLEAN NOT NULL DEFAULT FALSE,
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO reward_ladder (step, unlock_after, is_big) VALUES
  (1, 0, false),
  (2, 1, false),
  (3, 2, false),
  (4, 3, true)
ON CONFLICT (step) DO UPDATE SET 
  unlock_after = EXCLUDED.unlock_after,
  is_big = EXCLUDED.is_big;

-- 2. PRIZE POOL OFFERS
CREATE TABLE IF NOT EXISTS reward_offers (
  id            SERIAL PRIMARY KEY,
  step          INT NOT NULL REFERENCES reward_ladder(step) ON DELETE CASCADE,
  title         TEXT NOT NULL,                 -- e.g. "₹100 OFF"
  subtitle      TEXT NOT NULL,                 -- e.g. "on orders above ₹799"
  image         TEXT,                          -- Product image URL
  discount_type TEXT NOT NULL CHECK (discount_type IN ('flat','percent','free_item')),
  value         NUMERIC(10,2) NOT NULL,        -- 100 (₹) or 15 (%)
  max_discount  NUMERIC(10,2),                 -- Cap for percentage discounts
  min_order     NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_product_id INT,                         -- For free_item offers
  valid_days    INT NOT NULL DEFAULT 7,        -- Validity period in days
  weight        INT NOT NULL DEFAULT 1,        -- Probability weight (higher = more frequent)
  budget_limit  INT,                           -- Max times this prize can be won
  issued_count  INT NOT NULL DEFAULT 0,
  starts_at     TIMESTAMPTZ,
  ends_at       TIMESTAMPTZ,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Initial Authentic Prize Pool
INSERT INTO reward_offers (step, title, subtitle, discount_type, value, max_discount, min_order, valid_days, weight, budget_limit, issued_count) VALUES
  (1, '₹50 OFF', 'Welcome gift on orders above ₹399', 'flat', 50.00, NULL, 399.00, 7, 50, 1000, 245),
  (1, '10% OFF', 'Welcome gift on any royal order', 'percent', 10.00, 75.00, 0.00, 7, 50, 1000, 198),
  (2, '₹100 OFF', 'on your next order above ₹699', 'flat', 100.00, NULL, 699.00, 7, 60, 500, 132),
  (2, '15% OFF', 'Special repeat order discount', 'percent', 15.00, 150.00, 500.00, 7, 40, 500, 88),
  (3, '₹150 OFF', 'Loyalty reward on orders above ₹899', 'flat', 150.00, NULL, 899.00, 10, 70, 300, 64),
  (3, 'FREE PODI PACK', 'Complimentary Idli Karam Podi', 'free_item', 99.00, NULL, 599.00, 10, 30, 200, 42),
  (4, '₹300 MEGA OFF', 'Milestone grand discount on ₹1299+', 'flat', 300.00, NULL, 1299.00, 14, 40, 100, 28),
  (4, 'FREE SWEET BOX', 'Grand celebration gift box with Sunnunda Laddus', 'free_item', 349.00, NULL, 999.00, 14, 60, 100, 36)
ON CONFLICT DO NOTHING;

-- 3. USER CARDS
CREATE TABLE IF NOT EXISTS user_cards (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL,
  cycle         INT NOT NULL DEFAULT 1,
  step          INT NOT NULL,
  unlock_after  INT NOT NULL,
  is_big        BOOLEAN NOT NULL DEFAULT FALSE,
  status        TEXT NOT NULL DEFAULT 'locked'
                CHECK (status IN ('locked','new','revealed','reserved','used','expired')),
  offer_id      INT REFERENCES reward_offers(id),
  code          TEXT UNIQUE,
  unlocked_at   TIMESTAMPTZ,
  scratched_at  TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ,
  order_id      BIGINT,
  used_at       TIMESTAMPTZ,
  UNIQUE (user_id, cycle, step)
);

-- 4. USER REWARD STATE
CREATE TABLE IF NOT EXISTS user_reward_state (
  user_id          BIGINT PRIMARY KEY,
  cycle            INT NOT NULL DEFAULT 1,
  delivered_count  INT NOT NULL DEFAULT 0,
  counted_orders   BIGINT[] NOT NULL DEFAULT '{}'
);

-- INDEXES FOR FAST APP REWARD QUERYING
CREATE INDEX IF NOT EXISTS idx_user_cards_user_status ON user_cards(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_cards_code ON user_cards(code);
CREATE INDEX IF NOT EXISTS idx_reward_offers_step_active ON reward_offers(step, active);

-- ==============================================================================
-- 5. GLASS CATEGORY TABS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS category_tabs (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,          -- all, pickles, snacks, sweets, podis, combos
  label TEXT NOT NULL,                -- shown under the circle
  image TEXT DEFAULT '',              -- dish photo (transparent PNG)
  badge TEXT DEFAULT '',              -- e.g. NEW (empty = none)
  enabled BOOLEAN DEFAULT TRUE,
  sort INT DEFAULT 0
);

INSERT INTO category_tabs (slug, label, sort) VALUES
  ('all', 'All', 1),
  ('pickles', 'Pickles', 2),
  ('snacks', 'Snacks', 3),
  ('sweets', 'Sweets', 4),
  ('podis', 'Podis', 5),
  ('combos', 'Combos', 6)
ON CONFLICT (slug) DO NOTHING;

UPDATE category_tabs SET badge='NEW' WHERE slug='snacks' AND badge='';

-- ==============================================================================
-- 6. THE ART OF PAIRING
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pairing_settings (
  id INT PRIMARY KEY DEFAULT 1,
  enabled BOOLEAN DEFAULT TRUE,
  eyebrow VARCHAR(100) DEFAULT 'CURATED COMBOS',
  title VARCHAR(100) DEFAULT 'The Art of',
  title_accent VARCHAR(100) DEFAULT 'Pairing',
  subtitle VARCHAR(255) DEFAULT '',
  explain_text TEXT DEFAULT '',
  match_text VARCHAR(100) DEFAULT 'Made for each other',
  button_text VARCHAR(100) DEFAULT 'Meet Amma''s perfect couples',
  more_text VARCHAR(100) DEFAULT 'MORE PERFECT COUPLES'
);

CREATE TABLE IF NOT EXISTS pairing_couples (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  tag VARCHAR(30) DEFAULT '',
  meal_icon VARCHAR(10) DEFAULT '',
  meal_name VARCHAR(30) DEFAULT '',
  loved_text VARCHAR(60) DEFAULT '',
  tip VARCHAR(100) DEFAULT '',
  a JSONB DEFAULT '{}',
  b JSONB DEFAULT '{}',
  weights JSONB DEFAULT '[]',
  enabled BOOLEAN DEFAULT TRUE,
  sort INT DEFAULT 0
);

-- ==============================================================================
-- 7. AMMA'S COMBO BOX
-- ==============================================================================
CREATE TABLE IF NOT EXISTS combo_settings (
  id INT PRIMARY KEY DEFAULT 1,
  enabled BOOLEAN DEFAULT TRUE,
  eyebrow VARCHAR(100) DEFAULT 'BUILD YOUR BOX',
  title_start VARCHAR(100) DEFAULT 'Amma''s',
  title_accent VARCHAR(100) DEFAULT 'Combo Box',
  jars INT DEFAULT 4,
  box_label VARCHAR(100) DEFAULT 'Amma''s Combo',
  lid_text TEXT DEFAULT 'Made with love,\npacked by Amma',
  tag_text VARCHAR(100) DEFAULT 'For you, with love 💛',
  sizes JSONB DEFAULT '["250 g", "500 g", "1 kg"]',
  tiers JSONB DEFAULT '[{"jars":4,"percent":10},{"jars":6,"percent":15},{"jars":8,"percent":20}]',
  categories JSONB DEFAULT '["Pickles", "Podis", "Snacks", "Sweets"]',
  home_line VARCHAR(255) DEFAULT 'pick any 4 jars, Amma packs them',
  home_title VARCHAR(100) DEFAULT 'Fill the box,',
  home_accent VARCHAR(100) DEFAULT 'save more',
  home_button VARCHAR(100) DEFAULT 'Start building your box'
);

CREATE TABLE IF NOT EXISTS combo_products (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL UNIQUE,
  category VARCHAR(50) DEFAULT 'Pickles',
  image TEXT DEFAULT NULL,
  color1 VARCHAR(20) DEFAULT '#8A1A10',
  color2 VARCHAR(20) DEFAULT '#2A0806',
  enabled BOOLEAN DEFAULT TRUE,
  sort INT DEFAULT 0
);
