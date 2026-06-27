import { C } from '@/lib/colors'

export const DASHBOARD = '/dashboard'

export const Icon = {
  Home: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12 L12 4 L21 12" /><path d="M5 10 V20 H19 V10" />
    </svg>
  ),
  Trend: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" />
    </svg>
  ),
  Calculator: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="9" cy="16" r="0.8" fill="currentColor" stroke="none" />
      <line x1="14" y1="16" x2="16" y2="16" />
    </svg>
  ),
  Bars: (p) => (
    <svg viewBox="0 0 24 24" width={p.size || 18} height={p.size || 18} fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="21" x2="21" y2="21" />
      <rect x="5" y="11" width="3.4" height="8" />
      <rect x="10.3" y="6" width="3.4" height="13" />
      <rect x="15.6" y="14" width="3.4" height="5" />
    </svg>
  ),
  HouseMark: () => (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke={C.earth}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16 L16 4 L29 16" /><path d="M6 14 L6 28 L26 28 L26 14" />
      <path d="M13 28 L13 19 L19 19 L19 28" />
    </svg>
  ),
}

export const NAV_ITEMS = [
  { id: 'valuation', label: 'Valuation', icon: Icon.Home, path: DASHBOARD },
  { id: 'market', label: 'Market Overview', icon: Icon.Bars, path: `${DASHBOARD}/market` },
  { id: 'roi', label: 'ROI Calculator', icon: Icon.Calculator, path: `${DASHBOARD}/roi` },
  { id: 'sentiment', label: 'Housing Cycle Index', icon: Icon.Trend, path: `${DASHBOARD}/sentiment` },
]

export const PAGE_TITLES = {
  '/dashboard': 'Valuation',
  '/dashboard/market': 'Property Market Overview',
  '/dashboard/roi': 'ROI Calculator',
  '/dashboard/sentiment': 'Housing Cycle Index',
}
