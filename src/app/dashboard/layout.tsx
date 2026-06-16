'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AppSidebar from '@/app/dashboard/app/components/AppSidebar'
import WebSidebar from '@/app/dashboard/website/components/WebSidebar'
import { Bell, Search, User, Globe, Smartphone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isWebMode = pathname.startsWith('/dashboard/website')
  const mode = isWebMode ? 'website' : 'app'

  const handleModeSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'app') {
      router.push('/dashboard/app')
    } else {
      router.push('/dashboard/website')
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 flex flex-col hidden md:flex shadow-sm z-10">
        <div className="p-4 border-b flex items-center justify-center bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Adhvaitha</h1>
              <span className="text-xs text-slate-500 font-medium">Control Panel</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            {mode === 'app' ? (
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            ) : (
              <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            )}
            <select 
              value={mode} 
              onChange={handleModeSwitch}
              className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-800 dark:bg-slate-950 appearance-none bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <option value="app">App Management</option>
              <option value="website">Website Management</option>
            </select>
            <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">▼</div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          {mode === 'app' ? <AppSidebar /> : <WebSidebar />}
        </div>

        <div className="p-4 border-t bg-slate-50 dark:bg-slate-900/50 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Adhvaitha Admin</p>
            <p className="text-xs text-slate-500 truncate">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="h-16 border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center flex-1">
            <div className="relative w-96 hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search dashboard..."
                className="w-full bg-slate-100/50 border-transparent focus:bg-white pl-9 dark:bg-slate-800 rounded-full transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
              <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
