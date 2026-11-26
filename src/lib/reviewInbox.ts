import { fetchApi, postApi } from '@/lib/api-client';

// Customer letters sent from the app's "Write to Amma" button wait here (doc "review_inbox")
// until an admin approves them. Approved letters are copied into the "reviews" doc,
// which is what the app's Letters from Home section shows.

export type InboxStatus = 'pending' | 'approved' | 'rejected';

export interface InboxItem {
  id: string;
  userId?: string;
  name: string;
  city: string;
  phone: string;
  productId: string;
  productName: string;
  stars: number;
  text: string;
  status: InboxStatus;
  verified: boolean;
  createdAt: string;
  reviewedAt?: string;
}

const unwrap = (raw: any) => {
  const d = raw?.content ?? raw?.data ?? raw;
  if (typeof d === 'string') { try { return JSON.parse(d); } catch { return {}; } }
  return d && typeof d === 'object' ? d : {};
};

export async function readDoc(docId: string): Promise<any> {
  try { return unwrap(await fetchApi(`/app_settings.php?doc_id=${docId}`)); } catch { return {}; }
}

export async function writeDoc(docId: string, data: any) {
  await postApi(`/app_settings.php?doc_id=${docId}`, data);
}

export async function readInbox(): Promise<InboxItem[]> {
  const d = await readDoc('review_inbox');
  return Array.isArray(d?.items) ? d.items : [];
}

export async function writeInbox(items: InboxItem[]) {
  await writeDoc('review_inbox', { version: 1, items });
}

export const clean = (v: unknown, max: number) =>
  String(v ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
