import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './App/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import  { io } from 'socket.io-client'
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

async function bootstrap() {
  let serverIP = null;
 
  const localip = localStorage.getItem('ip')

  try {
    // Wait for Bonjour-discovered IP before rendering
    
    if (window.electronAPI?.getLocalIP) {
      serverIP = await window.electronAPI.getLocalIP();
      console.log("✅ Bonjour Server IP:", serverIP);
    }
  } catch (err) {
    console.error("❌ Failed to get server IP:", err);
  }

  const cip = window.location.hostname
  const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(cip)

  const ip = localip ? localip : serverIP ? serverIP : isIPv4 ? cip : '192.168.0.148'  
  
  const newSocket = io(`http://${ip}:7700`, {
    autoConnect: true,        
    reconnection: true,      
    reconnectionAttempts: 10, 
    reconnectionDelay: 1000, 
    reconnectionDelayMax: 5000, 
    timeout: 20000,           
  });
  
  
  newSocket.connect()

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App serverIP={ip} newSocket={newSocket} />
      </Provider>
    </React.StrictMode>
  );
}

bootstrap();

reportWebVitals();
