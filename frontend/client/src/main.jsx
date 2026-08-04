import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { SocketProvider } from './components/context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
  <App />
  </SocketProvider>
   
  
)
