import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Tag, 
  Bell, 
  Settings 
} from 'lucide-react'

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/app' },
  { title: 'Products', icon: Package, href: '/dashboard/products' },
  { title: 'Orders', icon: ShoppingCart, href: '/dashboard/orders' },
  { title: 'Coupons', icon: Tag, href: '/dashboard/coupons' },
  { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function AppSidebar() {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {navItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <item.icon className="h-5 w-5 text-slate-500" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
