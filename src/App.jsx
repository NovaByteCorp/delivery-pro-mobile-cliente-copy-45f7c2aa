import './App.css'
import { useState } from 'react'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/contexts/LanguageContext'
import SplashScreen from '@/components/SplashScreen'
import logo from '@/assets/CD-white-logo.png' // ← ajuste o caminho do seu logo aqui

function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <LanguageProvider>
      {!splashDone && (
        <SplashScreen
          logo={logo}
          backgroundColor="#F97316"
          duration={2800}
          onFinish={() => setSplashDone(true)}
        />
      )}
      <Pages />
      <Toaster />
    </LanguageProvider>
  )
}

export default App