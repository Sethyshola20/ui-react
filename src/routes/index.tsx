import BinomialTreeForm from '@/components/binomialtree-form'
import GreeksChart from '@/components/greeks-chart'
import MarketDataPanel from '@/components/market.data-panel'
import OptionForm from '@/components/bs-form'
import BSForm from '@/components/bs-form'
import { createFileRoute } from '@tanstack/react-router'
import OptionPricingDashboard from '@/components/option-pricing'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
   <OptionPricingDashboard/>
  )
}
