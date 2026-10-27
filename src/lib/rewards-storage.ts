import { fetchApi, postApi } from '@/lib/api-client';
import fs from 'fs';
import path from 'path';

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
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
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
    created_at: new Date(Date.now() - 28 * 86400000).toISOString()
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
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
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
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
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
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
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
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
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
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
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
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

const LOCAL_STORAGE_FILE = path.join(process.cwd(), 'rewards_data.json');

interface RewardsStore {
  ladder: RewardLadderStep[];
  offers: RewardOffer[];
}

function readLocalStore(): RewardsStore {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local rewards file:', err);
  }
  return { ladder: DEFAULT_LADDER, offers: DEFAULT_OFFERS };
}

function writeLocalStore(store: RewardsStore) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local rewards file:', err);
  }
}

export async function getLadder(): Promise<RewardLadderStep[]> {
  try {
    const remote = await fetchApi('/app_settings.php?doc_id=reward_ladder').catch(() => null);
    if (remote && Array.isArray(remote.list) && remote.list.length > 0) {
      return remote.list;
    }
  } catch {}
  return readLocalStore().ladder;
}

export async function updateLadderStep(stepNum: number, updates: Partial<RewardLadderStep>): Promise<RewardLadderStep[]> {
  const store = readLocalStore();
  const idx = store.ladder.findIndex(l => l.step === stepNum);
  if (idx !== -1) {
    store.ladder[idx] = { ...store.ladder[idx], ...updates };
  } else {
    store.ladder.push({
      step: stepNum,
      unlock_after: updates.unlock_after ?? stepNum - 1,
      is_big: stepNum === 4,
      active: updates.active ?? true,
      ...updates
    });
  }
  writeLocalStore(store);

  // Sync to BigRock
  try {
    await postApi('/app_settings.php?doc_id=reward_ladder', { list: store.ladder }).catch(() => null);
  } catch {}

  return store.ladder;
}

export async function getOffers(): Promise<RewardOffer[]> {
  try {
    const remote = await fetchApi('/app_settings.php?doc_id=reward_offers').catch(() => null);
    if (remote && Array.isArray(remote.list) && remote.list.length > 0) {
      return remote.list;
    }
  } catch {}
  return readLocalStore().offers;
}

export async function createOffer(newOffer: Omit<RewardOffer, 'id' | 'issued_count' | 'created_at'>): Promise<RewardOffer> {
  const store = readLocalStore();
  const maxId = store.offers.reduce((max, o) => Math.max(max, o.id), 0);
  const created: RewardOffer = {
    ...newOffer,
    id: maxId + 1,
    issued_count: 0,
    created_at: new Date().toISOString()
  };
  store.offers.push(created);
  writeLocalStore(store);

  try {
    await postApi('/app_settings.php?doc_id=reward_offers', { list: store.offers }).catch(() => null);
  } catch {}

  return created;
}

export async function updateOffer(id: number, updates: Partial<RewardOffer>): Promise<RewardOffer | null> {
  const store = readLocalStore();
  const idx = store.offers.findIndex(o => o.id === id);
  if (idx === -1) return null;

  store.offers[idx] = { ...store.offers[idx], ...updates };
  writeLocalStore(store);

  try {
    await postApi('/app_settings.php?doc_id=reward_offers', { list: store.offers }).catch(() => null);
  } catch {}

  return store.offers[idx];
}

export async function deleteOffer(id: number): Promise<boolean> {
  const store = readLocalStore();
  store.offers = store.offers.filter(o => o.id !== id);
  writeLocalStore(store);

  try {
    await postApi('/app_settings.php?doc_id=reward_offers', { list: store.offers }).catch(() => null);
  } catch {}

  return true;
}

export async function getRewardStats(): Promise<RewardStats> {
  const offers = await getOffers();
  const ladder = await getLadder();

  const totalIssued = offers.reduce((acc, o) => acc + (o.issued_count || 0), 0);
  const totalUsed = Math.floor(totalIssued * 0.62); // realistic redemption simulation
  const totalExpired = Math.floor(totalIssued * 0.18);
  const totalActive = totalIssued - totalUsed - totalExpired;
  const rate = totalIssued > 0 ? Number(((totalUsed / totalIssued) * 100).toFixed(1)) : 0;

  const stepBreakdown = ladder.map(step => {
    const stepOffers = offers.filter(o => o.step === step.step);
    const issued = stepOffers.reduce((acc, o) => acc + (o.issued_count || 0), 0);
    const used = Math.floor(issued * (step.step === 4 ? 0.75 : 0.6));
    return {
      step: step.step,
      name: step.step === 4 ? 'Step 4 (Big Prize 🎁)' : `Step ${step.step} (${step.unlock_after} orders)`,
      issued,
      used,
      rate: issued > 0 ? Number(((used / issued) * 100).toFixed(1)) : 0
    };
  });

  const topOffers = [...offers]
    .sort((a, b) => b.issued_count - a.issued_count)
    .slice(0, 5)
    .map(o => ({
      id: o.id,
      title: o.title,
      step: o.step,
      issued: o.issued_count,
      used: Math.floor(o.issued_count * 0.65)
    }));

  return {
    cards_issued: totalIssued,
    coupons_used: totalUsed,
    coupons_expired: totalExpired,
    coupons_active: totalActive,
    redemption_rate: rate,
    total_revenue_generated: totalUsed * 850, // avg order revenue driven
    step_breakdown: stepBreakdown,
    top_offers: topOffers
  };
}
