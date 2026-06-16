import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Image as ImageIcon, 
  Bell, 
  Settings,
  MessageSquare
} from 'lucide-react'

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/app' },
  { title: 'Orders', icon: ShoppingCart, href: '/dashboard/app/orders' },
  { title: 'Products', icon: Package, href: '/dashboard/app/products' },
  { title: 'Content Manager', icon: ImageIcon, href: '/dashboard/app/content' },
  { title: 'Notifications', icon: Bell, href: '/dashboard/app/notifications' },
  { title: 'Customer CRM', icon: MessageSquare, href: '/dashboard/app/crm' },
  { title: 'System Settings', icon: Settings, href: '/dashboard/app/settings' },
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
