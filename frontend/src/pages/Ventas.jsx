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
  
  // Stats de ejemplo (luego conectar con API)
  const stats = [
    {
      label: 'Total Sales (This Month)',
      value: '$1,250,000',
      change: '+5.2%',
      positive: true
    },
    {
      label: 'Vehicles Sold',
      value: '25',
      change: '+2.1%',
      positive: true
    },
    {
      label: 'Average Sale Value',
      value: '$50,000',
      change: '-1.5%',
      positive: false
    }
  ];

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      setLoading(true);
      const data = await getVentas();
      setVentas(data);
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
          <span>Add New Sale</span>
        </button>
      </header>

      {/* Stats */}
      <section className="ventas-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
            <p className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </section>

      {/* Toolbar & Search */}
      <section className="ventas-toolbar">
        <div className="search-container">
          <label className="search-bar">
            <div className="search-wrapper">
              <div className="search-icon-wrapper">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search by Sale ID, Client, or Vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>
        <div className="toolbar-actions">
          <button className="toolbar-btn" aria-label="Filter">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="toolbar-btn" aria-label="Sort">
            <span className="material-symbols-outlined">swap_vert</span>
          </button>
          <button className="toolbar-btn" aria-label="Export">
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
      </section>

      {/* Data Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="ventas-table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Client</th>
                <th className="text-right">Sale Amount</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
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
                    <td className="font-semibold text-right">
                      ${parseFloat(venta.precio_venta).toLocaleString()}
                    </td>
                    <td className="text-center">
                      {getStatusBadge(venta.estado || 'Completado')}
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button className="action-btn" aria-label="Ver Detalles">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button className="action-btn" aria-label="Generar Factura">
                          <span className="material-symbols-outlined">receipt</span>
                        </button>
                      </div>
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
      {/* Modal para agregar venta */}
      <AgregarVenta
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />      
    </div>
  );
}

export default Ventas;
