import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './features/App.tsx'
import './styles/index.css'
import { configure } from "mobx"

configure({
    enforceActions: "never"
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
