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
