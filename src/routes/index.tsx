import BSForm from '@/components/option-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <BSForm  />
  )
}
