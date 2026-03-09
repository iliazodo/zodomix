import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { VoiceContextProvider } from "./context/VoiceContext.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <VoiceContextProvider>
            <App />
          </VoiceContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
