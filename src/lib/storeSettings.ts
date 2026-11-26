// Website shop settings (doc "web_store"), shared by the admin page, the catalog API and checkout.
import { readDoc, writeDoc } from '@/lib/reviewInbox'

export interface WebStore { shopEnabled: boolean; codEnabled: boolean; notice: string; hidden: string[] }
export const DEFAULT_WEB_STORE: WebStore = { shopEnabled: true, codEnabled: true, notice: '', hidden: [] }

export async function readWebStore(): Promise<WebStore> {
  const d = await readDoc('web_store').catch(() => null)
  return {
    shopEnabled: d?.shopEnabled !== false,
    codEnabled: d?.codEnabled !== false,
    notice: String(d?.notice || '').slice(0, 200),
    hidden: Array.isArray(d?.hidden) ? d.hidden.map(String).slice(0, 500) : [],
  }
}

export async function writeWebStore(s: Partial<WebStore>) {
  const cur = await readWebStore()
  const next: WebStore = {
    shopEnabled: s.shopEnabled ?? cur.shopEnabled,
    codEnabled: s.codEnabled ?? cur.codEnabled,
    notice: String(s.notice ?? cur.notice).replace(/[<>]/g, '').slice(0, 200),
    hidden: Array.isArray(s.hidden) ? s.hidden.map(String).slice(0, 500) : cur.hidden,
  }
  await writeDoc('web_store', { version: 1, ...next, updatedAt: new Date().toISOString() })
  return next
}
