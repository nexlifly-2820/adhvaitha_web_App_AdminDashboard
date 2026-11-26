import { readDoc, writeDoc } from '@/lib/reviewInbox';

// Account deletion requests from the app (Profile → Delete my account). Doc "account_deletions".
export interface DeletionItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  status: 'pending' | 'done';
  createdAt: string;
  doneAt?: string;
}

export async function readDeletions(): Promise<DeletionItem[]> {
  const d = await readDoc('account_deletions');
  return Array.isArray(d?.items) ? d.items : [];
}

export async function writeDeletions(items: DeletionItem[]) {
  await writeDoc('account_deletions', { version: 1, items });
}
