import Link from 'next/link'
import { 
  Globe, 
  Image as ImageIcon, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Phone 
} from 'lucide-react'

const navItems = [
  { title: 'Overview', icon: Globe, href: '/dashboard/website' },
  { title: 'Gallery', icon: ImageIcon, href: '/dashboard/website/gallery' },
  { title: 'Product display', icon: BookOpen, href: '/dashboard/website/products' },
  { title: 'Recipes display', icon: FileText, href: '/dashboard/website/recipes' },
  { title: 'Contact info', icon: Phone, href: '/dashboard/website/contact' },
]

export default function WebSidebar() {
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
