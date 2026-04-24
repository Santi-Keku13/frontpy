import React, { useState, useEffect, useRef } from 'react';

const Cliente = ({ apiUrl }) => {  // ✅ Ya no necesita wsUrl
  const [ultimoTurno, setUltimoTurno] = useState(null);
  const timerRef = useRef(null);
  const pollingRef = useRef(null);

  // Temporizador de 10 minutos para borrar el turno
  useEffect(() => {
    if (ultimoTurno) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setUltimoTurno(null);
      }, 10 * 60 * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [ultimoTurno]);

  // ✅ Polling: consultar cada 3 segundos si hay nuevo turno
  useEffect(() => {
    const fetchUltimoTurno = async () => {
      try {
        const response = await fetch(`${apiUrl}/ultimo-turno`);
        const data = await response.json();
        
        if (data.ultimoTurno) {
          const turnoActual = {
            caja: data.ultimoTurno.caja,
            turno: data.ultimoTurno.turno,
            hora: data.ultimoTurno.hora
          };
          
          // Solo actualizar si es un turno nuevo (diferente al actual)
          if (!ultimoTurno || ultimoTurno.turno !== turnoActual.turno || ultimoTurno.caja !== turnoActual.caja) {
            setUltimoTurno(turnoActual);
            reproducirSonido();
          }
        }
      } catch (error) {
        console.error("Error obteniendo último turno:", error);
      }
    };

    // Consultar inmediatamente al montar
    fetchUltimoTurno();
    
    // Consultar cada 3 segundos
    pollingRef.current = setInterval(fetchUltimoTurno, 3000);
    
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [apiUrl, ultimoTurno]);

  const reproducirSonido = () => {
    const audio = new Audio('/assets/llamador.mp3');
    audio.play().catch(() => {});
  };

  const imagenPropaganda = "/assets/propaganda2.png";

  return (
    <div style={styles.viewPort}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.tituloPrincipal}>BLOW MAX</h1>
          <p style={styles.eslogan}>El mayorista del centro</p>
        </header>

        <main style={styles.mainContent}>
          <div style={{
            ...styles.videoSection,
            backgroundImage: `url(${imagenPropaganda})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <div style={styles.blurOverlay}>
              <img 
                key="video-display"
                src={imagenPropaganda} 
                style={styles.videoPlayer}
                alt="Propaganda"
              />
            </div>
          </div>

          <div style={styles.turnoSection}>
            <div style={{
              ...styles.display,
              ...(ultimoTurno ? styles.displayActivo : {})
            }}>
              {ultimoTurno ? (
                <div style={styles.contentWrapper}>
                  <div style={styles.mensaje}>PASE A</div>
                  <div style={styles.cajaNumero}>
                    {ultimoTurno.caja}
                  </div>
                  <div style={styles.cajaLabel}>CAJA</div>
                </div>
              ) : (
                <div style={styles.esperando}>
                  <div style={styles.textoEspera}>BIENVENIDOS</div>
                  <div style={styles.subtextoEspera}>aguarde su turno...</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Tus estilos se mantienen IGUALES
const styles = {
  viewPort: { 
    height: 'calc(100vh - 160px)', 
    width: '100%', 
    overflow: 'hidden', 
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
  container: { 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '10px 20px',
    boxSizing: 'border-box'
  },
  header: { 
    textAlign: 'center', 
    height: '12%', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  tituloPrincipal: { 
    fontSize: '7vh', 
    color: '#FF0000', 
    fontWeight: '900', 
    margin: 0,
    lineHeight: 1
  },
  eslogan: { fontSize: '2.5vh', color: '#cc0000', margin: 0 },
  mainContent: { 
    display: 'flex', 
    height: '88%', 
    gap: '20px', 
    paddingBottom: '10px'
  },
  videoSection: { 
    flex: 1.8, 
    backgroundColor: '#000', 
    borderRadius: '25px', 
    overflow: 'hidden',
    height: '100%',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  blurOverlay: {
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoPlayer: { 
    maxWidth: '100%', 
    maxHeight: '100%', 
    objectFit: 'contain',
    display: 'block',
    zIndex: 2
  },
  turnoSection: { flex: 1, height: '100%' },
  display: { 
    height: '100%',
    borderRadius: '25px', 
    backgroundColor: '#fff',
    border: '1.2vh solid #FF0000', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    boxSizing: 'border-box',
    padding: '2vh'
  },
  contentWrapper: { 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'space-between', height: '100%', width: '100%' 
  },
  mensaje: { fontSize: '5vh', fontWeight: 'bold', color: '#FF0000' },
  cajaLabel: { fontSize: '6vh', fontWeight: 'bold', color: '#FF0000' },
  cajaNumero: { fontSize: '30vh', fontWeight: '900', color: '#FF0000', lineHeight: 0.8 },
  esperando: { textAlign: 'center', color: '#FF0000' },
  textoEspera: { fontSize: '7vh', fontWeight: 'bold' },
  subtextoEspera: { fontSize: '3vh', opacity: 0.5 },
  displayActivo: { boxShadow: '0 0 40px rgba(255, 0, 0, 0.4)' }
};

export default Cliente;