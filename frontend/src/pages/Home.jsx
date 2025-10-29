import { useState, useEffect } from 'react';
import { 
  getDashboardStats, 
  getDashboardActivities,
  getVentasPorMes,
  getVehiculosPorMarca,
  getVentasPorVendedor
} from '../services/api';
import './Home.css';

function Home({ usuario }) {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [vehiculosPorMarca, setVehiculosPorMarca] = useState([]);
  const [ventasPorVendedor, setVentasPorVendedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [
          statsData, 
          activitiesData, 
          ventasMesData, 
          vehiculosMarcaData,
          ventasVendedorData
        ] = await Promise.all([
          getDashboardStats(),
          getDashboardActivities(),
          getVentasPorMes(),
          getVehiculosPorMarca(),
          getVentasPorVendedor()
        ]);
        
        setStats(statsData);
        setActivities(activitiesData);
        setVentasPorMes(ventasMesData);
        setVehiculosPorMarca(vehiculosMarcaData);
        setVentasPorVendedor(ventasVendedorData);
        setError(null);
        
      } catch (err) {
        setError(err.message);
        console.error('Error al obtener datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calcular máximo para normalizar las barras
  const maxVentas = Math.max(...ventasPorMes.map(v => v.cantidad), 1);
  const maxVendedor = Math.max(...ventasPorVendedor.map(v => v.cantidad), 1);

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-welcome">
          <h1 className="home-title">Bienvenido, {usuario.nombre} {usuario.apellido}</h1>
          <p className="home-subtitle">Aquí tienes un resumen de la actividad de hoy.</p>
        </div>
      </header>

      {/* Stats */}
      <section className="home-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <p className="stat-label">{stat.title}</p>
            <p className="stat-value">{stat.value}</p>
            {stat.change && (
              <p className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Charts Grid */}
      <section className="charts-grid">
        {/* Gráfico de Ventas por Mes */}
        <div className="chart-card full-width">
          <h2 className="chart-title">Ventas por Mes</h2>
          <div className="simple-chart">
            {ventasPorMes.length > 0 ? (
              <div className="bar-chart-horizontal">
                {ventasPorMes.map((venta, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-label">{venta.mes_nombre}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{
                          width: `${(venta.cantidad / maxVentas) * 100}%`,
                          backgroundColor: '#8b5cf6'
                        }}
                      >
                        <span className="bar-value">{venta.cantidad}</span>
                      </div>
                    </div>
                    <div className="bar-total">${venta.total.toLocaleString('es-CO')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">No hay datos de ventas disponibles</p>
            )}
          </div>
        </div>

        {/* Gráfico de Vehículos por Marca */}
        <div className="chart-card">
          <h2 className="chart-title">Vehículos por Marca</h2>
          <div className="simple-chart">
            {vehiculosPorMarca.length > 0 ? (
              <div className="pie-chart-list">
                {vehiculosPorMarca.map((vehiculo, index) => {
                  const total = vehiculosPorMarca.reduce((sum, v) => sum + v.value, 0);
                  const percentage = ((vehiculo.value / total) * 100).toFixed(1);
                  return (
                    <div key={index} className="pie-item">
                      <div 
                        className="pie-color" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="pie-info">
                        <span className="pie-label">{vehiculo.name}</span>
                        <span className="pie-value">{vehiculo.value} ({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data-message">No hay vehículos en inventario</p>
            )}
          </div>
        </div>

        {/* Gráfico de Ventas por Vendedor */}
        <div className="chart-card">
          <h2 className="chart-title">Ventas por Vendedor</h2>
          <div className="simple-chart">
            {ventasPorVendedor.length > 0 ? (
              <div className="bar-chart-vertical">
                {ventasPorVendedor.map((vendedor, index) => (
                  <div key={index} className="vertical-bar-item">
                    <div className="vertical-bar-container">
                      <div 
                        className="vertical-bar-fill"
                        style={{
                          height: `${(vendedor.cantidad / maxVendedor) * 100}%`,
                          backgroundColor: '#10b981'
                        }}
                      >
                        <span className="vertical-bar-value">{vendedor.cantidad}</span>
                      </div>
                    </div>
                    <div className="vertical-bar-label">{vendedor.vendedor.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">No hay datos de ventas disponibles</p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity Table */}
      <section className="home-activity">
        <h2 className="activity-title">Actividad Reciente</h2>
        <div className="table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>TIPO</th>
                <th>DESCRIPCIÓN</th>
                <th>FECHA</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.tipo}</td>
                    <td>{activity.descripcion}</td>
                    <td className="date-cell">{activity.fecha}</td>
                    <td>
                      <span className={`badge badge-${activity.estadoColor}`}>
                        {activity.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#92adc9' }}>
                    No hay actividad reciente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Home;