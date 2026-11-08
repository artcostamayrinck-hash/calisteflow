import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { pwaManager } from './utils/pwaManager'

// Inicia o registro seguro do Service Worker do CalisteFlow
pwaManager.register()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
