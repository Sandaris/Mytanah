import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, BarChart2, Calculator, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'valuation', label: 'Valuation', icon: Home, path: '/' },
  { id: 'market', label: 'Market Overview', icon: BarChart2, path: '/market' },
  { id: 'roi', label: 'ROI Calculator', icon: Calculator, path: '/roi' },
  { id: 'sentiment', label: 'Sentiment Index', icon: TrendingUp, path: '/sentiment' },
]

const PAGE_TITLES = {
  '/': 'Valuation',
  '/market': 'Market Overview',
  '/roi': 'ROI Calculator',
  '/sentiment': 'Sentiment Index',
}

function Sidebar() {
  return (
    <aside className="flex flex-col w-[220px] shrink-0 h-screen bg-[#2C3930]">
      {/* Logo area */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8">
        <Home className="w-5 h-5 text-[#A27B5C] shrink-0" strokeWidth={1.5} />
        <span className="font-display text-lg text-white leading-none tracking-wide">
          MyPropertyIQ
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 px-2 py-4">
        {NAV.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-colors',
                isActive
                  ? 'bg-[#3F4F44] text-white border-l-2 border-[#A27B5C] pl-[10px]'
                  : 'text-white/60 hover:text-white border-l-2 border-transparent pl-[10px]',
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer note */}
      <div className="px-5 py-4 border-t border-white/8">
        <p className="text-[10px] text-white/30 font-mono leading-relaxed">
          Data: NAPIC 2021–2025
        </p>
      </div>
    </aside>
  )
}

function Header({ title }) {
  return (
    <header className="flex items-center justify-between h-14 shrink-0 px-6 bg-[#EDE9E1] border-b border-[#C8C3B8]">
      <h1 className="font-display text-xl text-[#2C3930] leading-none">
        {title}
      </h1>
      <span className="bg-[#2C3930] text-white/80 text-[11px] font-mono px-3 py-1 rounded-full tracking-wider">
        Q1 2025
      </span>
    </header>
  )
}

export default function AppShell() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'MyPropertyIQ'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-auto bg-[#EDE9E1]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
