import { useState, useEffect } from 'react';
import { getVehiculos } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Vehiculos.css';

function Vehiculos({ usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    marcas: [],
    carrocerias: [],
    precioMin: 20000,
    precioMax: 75000
  });
  const [ordenamiento, setOrdenamiento] = useState('precio-desc');

  // Verificar si es vista pública (sin usuario)
  const esVistaPublica = !usuario;

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        setLoading(true);
        const data = await getVehiculos();
        setVehiculos(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar vehículos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  const handleMarcaChange = (marca) => {
    setFiltros(prev => ({
      ...prev,
      marcas: prev.marcas.includes(marca)
        ? prev.marcas.filter(m => m !== marca)
        : [...prev.marcas, marca]
    }));
  };

  const handleCarroceriaChange = (carroceria) => {
    setFiltros(prev => ({
      ...prev,
      carrocerias: prev.carrocerias.includes(carroceria)
        ? prev.carrocerias.filter(c => c !== carroceria)
        : [...prev.carrocerias, carroceria]
    }));
  };

  const resetFiltros = () => {
    setFiltros({
      marcas: [],
      carrocerias: [],
      precioMin: 20000,
      precioMax: 75000
    });
  };

  if (loading) {
    return <div className="loading">Cargando vehículos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="vehiculos-container">
      {/* Header con botón de login para vista pública */}
      {esVistaPublica && (
        <div className="vehiculos-header-publico">
          <div className="header-publico-content">
            <div className="logo-section">
              <img 
                src="/src/assets/minnieBL.png" 
                alt="RatonaMotors Logo" 
                className="logo-image"
              />
              <div className="logo-text">
                <h1 className="logo-title"> RatonaMotors</h1>
                <p className="logo-subtitle">Vehículos Premium</p>
              </div>
            </div>
            <button 
              className="btn-login-header"
              onClick={() => navigate('/login')}
            >
              <span className="material-symbols-outlined">login</span>
              Acceso Empleados
            </button>
          </div>
        </div>
      )}

      {/* Page Heading */}
      <div className="vehiculos-header">
        <div className="vehiculos-title-section">
          <h1 className="vehiculos-title">
            {esVistaPublica ? 'Nuestro Catálogo' : 'Gestión de Vehículos'}
          </h1>
          <p className="vehiculos-subtitle">
            {esVistaPublica 
              ? 'Explore nuestra selección de vehículos premium.' 
              : 'Administra el inventario de vehículos.'}
          </p>
        </div>
      </div>

      <div className="vehiculos-content">
        
        {/* Main Content Area */}
        <div className="vehiculos-main">
          {/* Sort & View Controls */}
          <div className="vehiculos-controls">
            <p className="vehiculos-results">Mostrando {vehiculos.length} resultados</p>
            <div className="vehiculos-controls-right">
              
              <div className="view-toggle">
                <button className="view-btn active">
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button className="view-btn">
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="vehiculos-grid">
            {vehiculos.map((vehiculo) => (
              <div key={vehiculo.id_vehiculo} className="vehiculo-card">
                <div className="vehiculo-image-container">
                  <img
                    className="vehiculo-image"
                    src={vehiculo.imagen_principal || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                    }}
                  />
                  <div className="vehiculo-year-badge">{vehiculo.año}</div>
                </div> 
                <div className="vehiculo-content">
                  <h3 className="vehiculo-title">{vehiculo.marca} {vehiculo.modelo}</h3>
                  <div className="vehiculo-specs">
                    <span>{vehiculo.kilometraje?.toLocaleString()} km</span>
                    <span className="vehiculo-separator">•</span>
                    <span>{vehiculo.transmision || 'Automático'}</span>
                    <span className="vehiculo-separator">•</span>
                    <span>{vehiculo.tipo_combustible || 'Gasolina'}</span>
                  </div>
                  <div className="vehiculo-footer">
                    <p className="vehiculo-price">${vehiculo.precio?.toLocaleString()}</p>
                  </div>
                  <button 
                    className="vehiculo-btn"
                    onClick={() => navigate(
                      esVistaPublica 
                        ? `/catalogo/${vehiculo.id_vehiculo}` 
                        : `/vehiculos/${vehiculo.id_vehiculo}`
                    )}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav className="vehiculos-pagination">
            <ul className="pagination-list">
              <li>
                <a href="#" className="pagination-btn pagination-prev">Anterior</a>
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
                <a href="#" className="pagination-btn pagination-next">Siguiente</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Vehiculos;
