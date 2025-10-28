import { useState, useEffect } from 'react';
import { getVentas } from '../services/api';
import AgregarVenta from './AgregarVenta';
import './Ventas.css';

function Ventas({ usuario }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState([]);
  

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      setLoading(true);
      const data = await getVentas();
      setVentas(data.ventas);
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      'Completado': { class: 'status-completed', label: 'Pagado' },
      'Pendiente': { class: 'status-pending', label: 'Pendiente' },
      'Cancelado': { class: 'status-overdue', label: 'Cancelado' }
    };
    const config = statusConfig[estado] || statusConfig['Pendiente'];
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="loading">Cargando ventas...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleSuccess = () => {
    loadVentas(); // Recargar las ventas después de crear una nueva
  };

  return (
    <div className="ventas-container">
      {/* Page Heading */}
      <header className="ventas-header">
        <h1 className="ventas-title">Registro de Ventas</h1>
        <button className="btn-add-sale" 
                onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined">add_circle</span>
          <span>Agregar nueva venta</span>
        </button>
      </header>

      {/* Stats */}
      <section className="ventas-stats">
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

      {/* Data Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="ventas-table">
            <thead>
              <tr>
                <th>Venta ID</th>
                <th>Fecha</th>
                <th>Vehículo</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th className="text-right">Monto de Venta</th>
                <th className="text-center">Estado</th>
               
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                ventas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td className="font-medium text-gray">#{venta.id_venta}</td>
                    <td className="text-gray">
                      {new Date(venta.fecha_venta).toLocaleDateString('es-CO')}
                    </td>
                    <td className="font-semibold">{venta.vehiculo}</td>
                    <td className="text-gray">{venta.cliente}</td>
                    <td className="text-gray">{venta.vendedor}</td>
                    <td className="font-semibold text-right">
                      ${parseFloat(venta.precio_venta).toLocaleString()}
                    </td>
                    <td className="text-center">
                      {getStatusBadge(venta.estado || 'Completado')}
                    </td>
                 
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav className="pagination-nav">
          <span className="pagination-info">
            Showing <span className="font-semibold">1-{ventas.length}</span> of{' '}
            <span className="font-semibold">{ventas.length}</span>
          </span>
          <ul className="pagination-list">
            <li>
              <a href="#" className="pagination-btn pagination-prev">
                <span className="sr-only">Previous</span>
                <span className="material-symbols-outlined">chevron_left</span>
              </a>
            </li>
            <li>
              <a href="#" className="pagination-btn active">1</a>
            </li>
            <li>
              <a href="#" className="pagination-btn">2</a>
            </li>
            <li>
              <a href="#" className="pagination-btn">3</a>
            </li>
            <li>
              <a href="#" className="pagination-btn pagination-next">
                <span className="sr-only">Next</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <AgregarVenta
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        usuario={usuario}  // ← Agregar esta línea
      /> 
    </div>
  );
}

export default Ventas;
