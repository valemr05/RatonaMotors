import { useState, useEffect } from 'react';
import { getDashboardStats, getDashboardActivities } from '../services/api';
import './Home.css';

function Home({ usuario }) {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de la API
        const statsData = await getDashboardStats();
        const activitiesData = await getDashboardActivities();
        
        setStats(statsData);
        setActivities(activitiesData);
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

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      {/* Header: Page Heading + Search Bar */}
      <header className="home-header">
        <div className="home-welcome">
          <h1 className="home-title">Bienvenido, {usuario.nombre} {usuario.apellido}</h1>
          <p className="home-subtitle">Aquí tienes un resumen de la actividad de hoy.</p>
        </div>
        <div className="home-search-wrapper">
          <label className="home-search">
            <div className="home-search-container">
              
            
            </div>
          </label>
        </div>
      </header>

      {/* Stats */}
      <section className="home-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <p className="stat-label">{stat.title}</p>
            <p className="stat-value">{stat.value}</p>
            <p className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
            </p>
          </div>
        ))}
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
              {activities.map((activity, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Home;
