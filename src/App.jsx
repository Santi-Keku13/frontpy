import React, { useState } from 'react';
import Cajero from './Cajero';
import Cliente from './Cliente';
import './index.css';

function App() {
  const [modo, setModo] = useState('cajero');
  
  // URL BASE
  const BASE_URL = import.meta.env.PROD 
    ? 'https://boxing-mario-richards-stay.trycloudflare.com'
    : 'http://localhost:5000';
  
  const API_URL = `${BASE_URL}/api`;

  return (
    <div className="app">
      {/* Barra superior de selección */}
      <div className="modo-selector">
        <button 
          className={modo === 'cajero' ? 'active' : ''}
          onClick={() => setModo('cajero')}
        >
          Modo Cajero
        </button>
        <button 
          className={modo === 'cliente' ? 'active' : ''}
          onClick={() => setModo('cliente')}
        >
          Modo Cliente
        </button>
      </div>

      {/* Vista principal (ocupa todo el espacio sobrante) */}
      <div className="app-content">
        {modo === 'cajero' ? (
          <Cajero apiUrl={API_URL} />
        ) : (
          <Cliente apiUrl={API_URL} /> 
        )}
      </div>

      {/* Pie de página con altura fija */}
      <footer className="footer-profesional">
        <p className="footer-copyright">
          © {new Date().getFullYear()} <strong>Blowmax</strong>. Todos los derechos reservados.
        </p>
        <p className="footer-autor">
          desarrollado por Vera Santiago
        </p>
      </footer>
    </div>
  );
}

export default App;