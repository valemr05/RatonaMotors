import { useState, useEffect } from 'react';
import { getClientes, crearCliente } from '../services/api';
import './Clientes.css';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCliente(formData);
      alert('Cliente creado exitosamente');
      setShowModal(false);
      loadClientes();
      setFormData({
        nombre: '',
        apellido: '',
        documento: '',
        telefono: '',
        email: '',
        direccion: ''
      });
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert('Error al crear el cliente');
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = 
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono?.includes(searchTerm);
    
    return matchesSearch;
  });

  if (loading) {
    return <div className="loading">Cargando clientes...</div>;
  }

  return (
    <div className="clientes-container">
      {/* Page Heading */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de Clientes</h1>
          <p className="page-subtitle">Administra y visualiza la información de tus clientes.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span className="icon">+</span>
          <span>Agregar Cliente</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="action-bar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          <button 
            className={`chip ${filterStatus === 'todos' ? 'chip-active' : ''}`}
            onClick={() => setFilterStatus('todos')}
          >
            Todos
          </button>
          
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="clientes-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Contacto</th>
                <th>Documento</th>
                <th>Dirección</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td className="font-medium">
                    {cliente.nombre} {cliente.apellido}
                  </td>
                  <td className="contact-cell">
                    <div>{cliente.email || 'N/A'}</div>
                    <div className="text-secondary">{cliente.telefono || 'N/A'}</div>
                  </td>
                  <td>{cliente.documento}</td>
                  <td className="address-cell">{cliente.direccion || 'N/A'}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>

          {filteredClientes.length === 0 && (
            <div className="empty-state">
              <p>No se encontraron clientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <p className="pagination-info">
          Mostrando <span className="font-medium">1</span> a{' '}
          <span className="font-medium">{filteredClientes.length}</span> de{' '}
          <span className="font-medium">{clientes.length}</span> resultados
        </p>
        <div className="pagination-buttons">
          <button className="pagination-btn" disabled>
            ‹
          </button>
          <button className="pagination-btn">
            ›
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Cliente</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Documento</label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;