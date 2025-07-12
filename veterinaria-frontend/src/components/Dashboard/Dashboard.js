import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import clienteService from '../../services/cliente.service';
import pacienteService from '../../services/paciente.service';
import citaService from '../../services/cita.service';

const Dashboard = () => {
  // Estado para detectar el modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'));
  // Estado para el número de clientes registrados
  const [clientesCount, setClientesCount] = useState(0);
  // Estado para el número de pacientes registrados
  const [pacientesCount, setPacientesCount] = useState(0);
  // Estado para la distribución de especies
  const [especiesDistribution, setEspeciesDistribution] = useState({
    perros: 0,
    gatos: 0,
    otros: 0
  });
  // Estado para el último paciente registrado
  const [latestPaciente, setLatestPaciente] = useState(null);
  // Estado para el número de citas agendadas
  const [citasCount, setCitasCount] = useState(0);
  // Estado para las citas por mes (últimos 6 meses)
  const [citasPorMes, setCitasPorMes] = useState([]);
  // Estado para la última cita agendada
  const [latestCita, setLatestCita] = useState(null);

  // Función para obtener el ícono según la especie
  const getSpeciesIcon = (especie) => {
    const especieLower = especie?.toLowerCase();
    switch (especieLower) {
      case 'perro':
        return '🐶';
      case 'gato':
        return '🐱';
      case 'ave':
      case 'pajaro':
        return '🐦';
      case 'conejo':
        return '🐰';
      case 'hamster':
        return '🐹';
      case 'reptil':
        return '🦎';
      case 'pez':
        return '🐠';
      default:
        return '🐾';
    }
  };

  // Función para calcular el tiempo transcurrido o mostrar información básica
  const getActivityInfo = (paciente) => {
    if (!paciente) return 'Sin información';
    return 'Último registro';
  };

  // Función para obtener los últimos 6 meses basado en la última cita registrada
  const getUltimos6Meses = (citas) => {
    if (!citas || citas.length === 0) {
      // Si no hay citas, usar los últimos 6 meses desde hoy
      const meses = [];
      const hoy = new Date();
      for (let i = 5; i >= 0; i--) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        meses.push({
          year: fecha.getFullYear(),
          month: fecha.getMonth() + 1,
          nombre: fecha.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
          count: 0
        });
      }
      return meses;
    }

    // Encontrar la fecha más reciente
    const fechasOrdenadas = citas
      .map(cita => new Date(cita.fecha))
      .sort((a, b) => b - a);
    
    const fechaMasReciente = fechasOrdenadas[0];
    const yearReciente = fechaMasReciente.getFullYear();
    const monthReciente = fechaMasReciente.getMonth();

    // Generar los últimos 6 meses desde la fecha más reciente
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(yearReciente, monthReciente - i, 1);
      meses.push({
        year: fecha.getFullYear(),
        month: fecha.getMonth() + 1,
        nombre: fecha.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
        count: 0
      });
    }

    // Contar citas por mes
    citas.forEach(cita => {
      const fechaCita = new Date(cita.fecha);
      const yearCita = fechaCita.getFullYear();
      const monthCita = fechaCita.getMonth() + 1;

      const mes = meses.find(m => m.year === yearCita && m.month === monthCita);
      if (mes) {
        mes.count++;
      }
    });

    return meses;
  };

  // Función para formatear fecha de cita
  const formatFechaCita = (fecha) => {
    if (!fecha) return '';
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  // Función para formatear hora de cita
  const formatHoraCita = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); // HH:MM
  };
  
  // Actualizar el estado del modo oscuro si cambia
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };
    
    // Verificar inicialmente
    checkDarkMode();
    
    // Crear un observador para detectar cambios en el body
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Cargar el número de clientes, pacientes y citas al montar el componente
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Obtener clientes
        const clientes = await clienteService.getAll();
        setClientesCount(clientes.length);
        
        // Obtener pacientes
        const pacientes = await pacienteService.getAll();
        setPacientesCount(pacientes.length);
        
        // Obtener citas
        const citas = await citaService.getAll();
        setCitasCount(citas.length);
        
        // Calcular citas por mes (últimos 6 meses)
        const citasPorMesData = getUltimos6Meses(citas);
        setCitasPorMes(citasPorMesData);

        // Obtener la última cita agendada
        if (citas && citas.length > 0) {
          const citasOrdenadas = citas
            .filter(cita => cita.fecha) // Filtrar citas con fecha válida
            .sort((a, b) => {
              const fechaA = new Date(a.fecha + 'T' + (a.hora || '00:00:00'));
              const fechaB = new Date(b.fecha + 'T' + (b.hora || '00:00:00'));
              return fechaB - fechaA; // Más reciente primero
            });
          
          if (citasOrdenadas.length > 0) {
            setLatestCita(citasOrdenadas[0]);
          }
        }
        
        // Calcular distribución de especies
        const distribution = pacientes.reduce((acc, paciente) => {
          const especie = paciente.especie?.toLowerCase();
          if (especie === 'perro') {
            acc.perros++;
          } else if (especie === 'gato') {
            acc.gatos++;
          } else {
            acc.otros++;
          }
          return acc;
        }, { perros: 0, gatos: 0, otros: 0 });
        
        setEspeciesDistribution(distribution);

        // Obtener el último paciente registrado
        try {
          const ultimoPaciente = await pacienteService.getLatest();
          setLatestPaciente(ultimoPaciente);
        } catch (error) {
          console.log('No hay pacientes registrados o error al obtener el último:', error);
          setLatestPaciente(null);
        }
      } catch (error) {
        console.error('Error al obtener datos para el dashboard:', error);
      }
    };
    
    fetchCounts();
  }, []);

  // Datos para estadísticas
  const stats = [
    { id: 1, title: 'Citas Agendadas', value: citasCount, icon: '📅', color: '#e74c3c', class: 'appointments' },
    { id: 2, title: 'Pacientes Activos', value: pacientesCount, icon: '🐾', color: '#3498db', class: 'patients' },
    { id: 3, title: 'Clientes Registrados', value: clientesCount, icon: '👪', color: '#f39c12', class: 'clients' }
  ];

  // Colores adaptados según el modo
  const barColor = isDarkMode ? '#5cad8a' : '#3498db';

  // Calcular porcentajes para la distribución de especies
  const calculatePercentages = () => {
    const total = especiesDistribution.perros + especiesDistribution.gatos + especiesDistribution.otros;
    
    if (total === 0) {
      return { perros: 0, gatos: 0, otros: 0 };
    }
    
    return {
      perros: Math.round((especiesDistribution.perros / total) * 100),
      gatos: Math.round((especiesDistribution.gatos / total) * 100),
      otros: Math.round((especiesDistribution.otros / total) * 100)
    };
  };

  const percentages = calculatePercentages();

  // Calcular ángulos para el gráfico de torta (cada 1% = 3.6 grados)
  const getAngles = () => {
    const perrosAngle = percentages.perros * 3.6;
    const gatosAngle = percentages.gatos * 3.6;
    
    return {
      perros: { start: 0, percentage: percentages.perros },
      gatos: { start: perrosAngle, percentage: percentages.gatos },
      otros: { start: perrosAngle + gatosAngle, percentage: percentages.otros }
    };
  };

  const angles = getAngles();

  return (
    <div className="dashboard-content">
      <h2 className="dashboard-title">Panel de Control</h2>
      <p className="dashboard-welcome">Bienvenido al panel de control de la Veterinaria Mordisco</p>

      <div className="stats-container">
        {stats.map(stat => (
          <div 
            key={stat.id} 
            className={`dashboard-card ${stat.class}`}
            style={{borderTopColor: stat.color}}
          >
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon" style={{backgroundColor: `${stat.color}20`}}>
                <span style={{fontSize: '1.5rem'}}>{stat.icon}</span>
              </div>
              <h3 className="dashboard-card-title">{stat.title}</h3>
            </div>
            <div className="dashboard-card-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3 className="chart-title">Citas por Mes (Últimos 6 Meses)</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {citasPorMes.map((mes, index) => {
                const maxCount = Math.max(...citasPorMes.map(m => m.count), 1);
                const height = citasPorMes.length > 0 ? (mes.count / maxCount) * 90 : 10;
                
                return (
                  <div 
                    key={`${mes.year}-${mes.month}`} 
                    className="chart-bar" 
                    style={{ 
                      height: `${Math.max(height, 10)}%`, 
                      backgroundColor: barColor,
                      position: 'relative'
                    }}
                  >
                    <span>{mes.nombre}</span>
                    {mes.count > 0 && (
                      <div className="chart-value" style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: isDarkMode ? '#fff' : '#333'
                      }}>
                        {mes.count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {citasPorMes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                <p>No hay citas registradas</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Distribución de Pacientes</h3>
          <div className="chart-placeholder" style={{ position: 'relative', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {pacientesCount > 0 ? (
              <>
                <div className="pie-chart" style={{ position: 'relative' }}>
                  {percentages.perros > 0 && (
                    <div className="pie-slice" style={{ 
                      '--percentage': `${percentages.perros}%`, 
                      '--color': '#5cad8a',
                      '--start-angle': `${angles.perros.start}deg`
                    }}></div>
                  )}
                  {percentages.gatos > 0 && (
                    <div className="pie-slice" style={{ 
                      '--percentage': `${percentages.gatos}%`, 
                      '--color': '#4a6da7',
                      '--start-angle': `${angles.gatos.start}deg`
                    }}></div>
                  )}
                  {percentages.otros > 0 && (
                    <div className="pie-slice" style={{ 
                      '--percentage': `${percentages.otros}%`, 
                      '--color': '#f39c12',
                      '--start-angle': `${angles.otros.start}deg`
                    }}></div>
                  )}
                </div>
                <div className="pie-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#5cad8a' }}></span>
                    <span>Perros ({percentages.perros}%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#4a6da7' }}></span>
                    <span>Gatos ({percentages.gatos}%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
                    <span>Otros ({percentages.otros}%)</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                <p>No hay pacientes registrados</p>
                <p style={{ fontSize: '0.9em' }}>Los datos aparecerán cuando se registren pacientes</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3 className="section-title">Actividad Reciente</h3>
        <div className="activity-list">
          {latestPaciente && (
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: '#e8f5e9' }}>
                <span role="img" aria-label={latestPaciente.especie}>
                  {getSpeciesIcon(latestPaciente.especie)}
                </span>
              </div>
              <div className="activity-content">
                <h4>Nuevo paciente registrado</h4>
                <p>
                  {latestPaciente.nombre} ({latestPaciente.especie}) - {latestPaciente.edad} 
                  {latestPaciente.edad === 1 ? ' año' : ' años'}
                </p>
                <span className="activity-time">
                  {getActivityInfo(latestPaciente)}
                </span>
              </div>
            </div>
          )}
          
          {latestCita && (
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: '#fff3e0' }}>
                <span role="img" aria-label="cita">📅</span>
              </div>
              <div className="activity-content">
                <h4>Última cita agendada</h4>
                <p>
                  {latestCita.Paciente?.nombre || 'Paciente no especificado'} - {formatFechaCita(latestCita.fecha)} a las {formatHoraCita(latestCita.hora)}
                </p>
                <p style={{ fontSize: '0.9em', color: '#666', margin: '4px 0 0 0' }}>
                  {latestCita.motivo && latestCita.motivo.length > 50 
                    ? `${latestCita.motivo.substring(0, 50)}...` 
                    : latestCita.motivo || 'Sin motivo especificado'}
                </p>
                <span className="activity-time">
                  Última cita programada
                </span>
              </div>
            </div>
          )}
          
          {!latestPaciente && !latestCita && (
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: '#f5f5f5' }}>
                <span role="img" aria-label="info">ℹ️</span>
              </div>
              <div className="activity-content">
                <h4>Sin actividad reciente</h4>
                <p>No hay pacientes ni citas registradas aún</p>
                <span className="activity-time">-</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;