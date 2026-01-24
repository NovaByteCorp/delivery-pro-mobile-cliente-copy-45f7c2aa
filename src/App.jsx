import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Pages />
      <Toaster />
    </LanguageProvider>
  )
}

export default App