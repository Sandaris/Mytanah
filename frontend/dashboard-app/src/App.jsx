import { Routes, Route } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell.jsx'
import TransactionMapPage from '@/pages/TransactionMapPage.jsx'
import MarketOverviewPage from '@/pages/MarketOverviewPage.jsx'
import RoiCalculator from '@/pages/RoiCalculator.jsx'
import SentimentPage from '@/pages/SentimentPage.jsx'
import IntroPage from '@/pages/IntroPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/intro" element={<IntroPage />} />
      <Route element={<AppShell />}>
        <Route index element={<TransactionMapPage />} />
        <Route path="/market" element={<MarketOverviewPage />} />
        <Route path="/roi" element={<RoiCalculator />} />
        <Route path="/sentiment" element={<SentimentPage />} />
      </Route>
    </Routes>
  )
}
