import { useState, useEffect } from 'react';
import { getVehiculos } from '../services/api';
import {useNavigate} from 'react-router-dom';
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
      {/* Page Heading */}
      <div className="vehiculos-header">
        <div className="vehiculos-title-section">
          <h1 className="vehiculos-title">Nuestro Catálogo</h1>
          <p className="vehiculos-subtitle">Explore nuestra selección de vehículos premium.</p>
        </div>
      </div>

      <div className="vehiculos-content">
        {/* Filter Sidebar */}
        <aside className="vehiculos-sidebar">
          <div className="filter-container">
            <div className="filter-header">
              <h2 className="filter-title">Filtros</h2>
              <button onClick={resetFiltros} className="filter-reset">Reset</button>
            </div>

            {/* Marca Filter */}

            {/* Rango de Precio */}
            <div className="filter-section">
              <h3 className="filter-section-title">Rango de Precio</h3>
              <div className="price-range">
                <div className="price-slider">
                  <div className="price-slider-track">
                    <div className="price-slider-fill"></div>
                    <div className="price-slider-thumb-left"></div>
                    <div className="price-slider-thumb-right"></div>
                  </div>
                </div>
                <div className="price-labels">
                  <span>${filtros.precioMin.toLocaleString()}</span>
                  <span>${filtros.precioMax.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <hr className="filter-divider" />

            <button className="filter-apply-btn">Aplicar Filtros</button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="vehiculos-main">
          {/* Sort & View Controls */}
          <div className="vehiculos-controls">
            <p className="vehiculos-results">Mostrando {vehiculos.length} resultados</p>
            <div className="vehiculos-controls-right">
              <select 
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="vehiculos-sort-select"
              >
                <option value="precio-desc">Precio: Mayor a menor</option>
                <option value="precio-asc">Precio: Menor a mayor</option>
                <option value="año-desc">Año: Más nuevo</option>
                <option value="kilometraje-asc">Kilometraje: Más bajo</option>
              </select>
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
                    src={vehiculo.imagen_url || 'https://via.placeholder.com/400x300'}
                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                    className="vehiculo-image"
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
                  <button className="vehiculo-btn"
                  onClick={() => navigate(`/vehiculos/${vehiculo.id_vehiculo}`)}
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
