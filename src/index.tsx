import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { AppProvider } from '@/context/AppContext'

import App from './components/App/App'
import './styles/global.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
)
