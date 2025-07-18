import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CSSReset, ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import App from './App.jsx'
import './index.css'
import { AlertProvider } from "./contexts/AlertContext.jsx"
import NavProvider from './contexts/NavContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <CSSReset />
      <AlertProvider>
        <AuthProvider>
          <NavProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NavProvider>
        </AuthProvider>
      </AlertProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
