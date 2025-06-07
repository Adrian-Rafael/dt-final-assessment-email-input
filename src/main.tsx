import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SimpleEmailInput from './email-input-picker'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleEmailInput />
  </StrictMode>,
)
