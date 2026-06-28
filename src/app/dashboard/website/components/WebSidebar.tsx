'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Globe, 
  Image as ImageIcon, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Phone,
  Home,
  HelpCircle
} from 'lucide-react'

const navItems = [
  { title: 'Overview', icon: Globe, href: '/dashboard/website' },
  { title: 'Homepage', icon: Home, href: '/dashboard/website/homepage' },
  { title: 'FAQ', icon: HelpCircle, href: '/dashboard/website/faq' },
  { title: 'Gallery', icon: ImageIcon, href: '/dashboard/website/gallery' },
  { title: 'Product display', icon: BookOpen, href: '/dashboard/website/products' },
  { title: 'Recipes display', icon: FileText, href: '/dashboard/website/recipes' },
  { title: 'Contact info', icon: Phone, href: '/dashboard/website/contact' },
]

export default function WebSidebar() {
  const pathname = usePathname() || '';

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navItems.map((item) => {
        const isActive = item.href === '/dashboard/website' 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
