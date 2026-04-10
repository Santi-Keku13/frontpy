import React, { useState } from 'react';
import Cajero from './Cajero';
import Cliente from './Cliente';
import './index.css';

function App() {
  const [modo, setModo] = useState('cajero');
  
  // URL BASE
  const BASE_URL = import.meta.env.PROD 
    ? 'https://purchases-programmes-southampton-adjusted.trycloudflare.com'
    : 'http://localhost:5000';
  
  const API_URL = `${BASE_URL}/api`;

  console.log('🔧 URLs configuradas (Sin WebSocket):');
  console.log('  API:', API_URL);
  
  return (
    <div className="app">
      <div className="modo-selector">
        <button 
          className={modo === 'cajero' ? 'active' : ''}
          onClick={() => setModo('cajero')}
        >
          👨‍💼 Modo Cajero
        </button>
        <button 
          className={modo === 'cliente' ? 'active' : ''}
          onClick={() => setModo('cliente')}
        >
          👥 Modo Cliente
        </button>
      </div>

      {modo === 'cajero' ? (
        <Cajero apiUrl={API_URL} />
      ) : (
        <Cliente apiUrl={API_URL} /> 
      )}

      <div className="info-dev">
        <p>
          {import.meta.env.PROD ? '🚀 PRODUCCIÓN' : '🛠️ DESARROLLO'} | 
          Modo: <strong>{modo.toUpperCase()}</strong>
        </p>
        <p>
          Desarrollado por FullStack Vera Santiago
        </p>
        <p className="hint">
          Sistema de Turnos - Backend Python (Sin WebSocket)
        </p>
      </div>
    </div>
  );
}

export default App;