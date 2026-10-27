export interface RewardLadderStep {
  step: number;
  unlock_after: number;
  is_big: boolean;
  active: boolean;
  title?: string;
  description?: string;
}

export interface RewardOffer {
  id: number;
  step: number;
  title: string;
  subtitle: string;
  image?: string;
  discount_type: 'flat' | 'percent' | 'free_item';
  value: number;
  max_discount?: number;
  min_order: number;
  free_product_id?: number;
  free_product_name?: string;
  valid_days: number;
  weight: number;
  budget_limit?: number;
  issued_count: number;
  starts_at?: string;
  ends_at?: string;
  active: boolean;
  created_at?: string;
}

export interface RewardStats {
  cards_issued: number;
  coupons_used: number;
  coupons_expired: number;
  coupons_active: number;
  redemption_rate: number;
  total_revenue_generated: number;
  step_breakdown: {
    step: number;
    name: string;
    issued: number;
    used: number;
    rate: number;
  }[];
  top_offers: {
    id: number;
    title: string;
    step: number;
    issued: number;
    used: number;
  }[];
}

export const DEFAULT_LADDER: RewardLadderStep[] = [
  { step: 1, unlock_after: 0, is_big: false, active: true, title: "Signup Welcome Gift", description: "Free on signup · Instant card" },
  { step: 2, unlock_after: 1, is_big: false, active: true, title: "1st Order Delivered", description: "Unlocks after 1 delivered order" },
  { step: 3, unlock_after: 2, is_big: false, active: true, title: "2nd Order Delivered", description: "Unlocks after 2 delivered orders" },
  { step: 4, unlock_after: 3, is_big: true, active: true, title: "Grand Celebration 🎁", description: "Big Milestone Prize after 3 orders" }
];

export const DEFAULT_OFFERS: RewardOffer[] = [
  {
    id: 1,
    step: 1,
    title: "₹50 OFF",
    subtitle: "Welcome gift on orders above ₹399",
    discount_type: "flat",
    value: 50,
    min_order: 399,
    valid_days: 7,
    weight: 50,
    budget_limit: 1000,
    issued_count: 245,
    active: true,
    created_at: "2026-09-27T00:00:00.000Z"
  },
  {
    id: 2,
    step: 1,
    title: "10% OFF",
    subtitle: "Welcome gift on any royal order",
    discount_type: "percent",
    value: 10,
    max_discount: 75,
    min_order: 0,
    valid_days: 7,
    weight: 50,
    budget_limit: 1000,
    issued_count: 198,
    active: true,
    created_at: "2026-09-29T00:00:00.000Z"
  },
  {
    id: 3,
    step: 2,
    title: "₹100 OFF",
    subtitle: "on your next order above ₹699",
    discount_type: "flat",
    value: 100,
    min_order: 699,
    valid_days: 7,
    weight: 60,
    budget_limit: 500,
    issued_count: 132,
    active: true,
    created_at: "2026-10-02T00:00:00.000Z"
  },
  {
    id: 4,
    step: 2,
    title: "15% OFF",
    subtitle: "Special repeat order discount",
    discount_type: "percent",
    value: 15,
    max_discount: 150,
    min_order: 500,
    valid_days: 7,
    weight: 40,
    budget_limit: 500,
    issued_count: 88,
    active: true,
    created_at: "2026-10-07T00:00:00.000Z"
  },
  {
    id: 5,
    step: 3,
    title: "₹150 OFF",
    subtitle: "Loyalty reward on orders above ₹899",
    discount_type: "flat",
    value: 150,
    min_order: 899,
    valid_days: 10,
    weight: 70,
    budget_limit: 300,
    issued_count: 64,
    active: true,
    created_at: "2026-10-12T00:00:00.000Z"
  },
  {
    id: 6,
    step: 3,
    title: "FREE PODI PACK",
    subtitle: "Complimentary Idli Karam Podi",
    discount_type: "free_item",
    value: 99,
    free_product_id: 102,
    free_product_name: "Special Idli Karam Podi (100g)",
    min_order: 599,
    valid_days: 10,
    weight: 30,
    budget_limit: 200,
    issued_count: 42,
    active: true,
    created_at: "2026-10-15T00:00:00.000Z"
  },
  {
    id: 7,
    step: 4,
    title: "₹300 MEGA OFF",
    subtitle: "Milestone grand discount on ₹1299+",
    discount_type: "flat",
    value: 300,
    min_order: 1299,
    valid_days: 14,
    weight: 40,
    budget_limit: 100,
    issued_count: 28,
    active: true,
    created_at: "2026-10-17T00:00:00.000Z"
  },
  {
    id: 8,
    step: 4,
    title: "FREE SWEET BOX",
    subtitle: "Grand celebration gift box with Sunnunda Laddus",
    discount_type: "free_item",
    value: 349,
    free_product_id: 105,
    free_product_name: "Royal Sunnunda Laddu Box (250g)",
    min_order: 999,
    valid_days: 14,
    weight: 60,
    budget_limit: 100,
    issued_count: 36,
    active: true,
    created_at: "2026-10-20T00:00:00.000Z"
  }
];
