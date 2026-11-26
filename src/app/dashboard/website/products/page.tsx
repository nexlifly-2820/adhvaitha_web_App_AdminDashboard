'use client'

// Website → Products: the ONE shared product list (same editor as App → Content → Shop catalogue).
import { Toaster } from 'sonner'
import { ShopCatalogBoard } from '@/app/dashboard/app/content/components/ShopCatalogBoard'

export default function SharedProductsPage() {
  return (
    <div className="p-3 sm:p-6 space-y-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Products (shared with the app)</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Edit once, both update: name, description, sizes, prices and stock are the same in the app and on adhvaithafoods.in.
          Open a product and use its <b>🌐 Website</b> box to show it on the website, pick the website category and bowl photo.
          “Show in app” only controls the app.
        </p>
      </div>
      <ShopCatalogBoard />
      <Toaster richColors position="top-center" />
    </div>
  )
}
