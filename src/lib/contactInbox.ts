import { readDoc, writeDoc } from '@/lib/reviewInbox';

// "Contact Us" messages sent from the app wait here (doc "contact_inbox").
// The admin sees them in Customer CRM → Support Inquiries and marks them resolved.

export interface ContactItem {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  adminReply?: string;
  resolvedAt?: string;
}

export async function readContacts(): Promise<ContactItem[]> {
  const d = await readDoc('contact_inbox');
  return Array.isArray(d?.items) ? d.items : [];
}

export async function writeContacts(items: ContactItem[]) {
  await writeDoc('contact_inbox', { version: 1, items });
}
