import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SoftwareTestingPresentation from './SoftwareTestingPresentation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoftwareTestingPresentation />
  </StrictMode>,
)
