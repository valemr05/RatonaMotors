import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehiculo, getImagenesVehiculo } from '../services/api';
import ModalPruebaManejo from './ModalPruebaManejo';
import './VehiculoDetalle.css';

function VehiculoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehiculo, setVehiculo] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [tabActiva, setTabActiva] = useState('descripcion');
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar vehículo
        const vehiculoData = await getVehiculo(id);
        setVehiculo(vehiculoData);
        
        // Cargar imágenes
        // Las imágenes ya vienen en el objeto vehiculoData
        if (vehiculoData.imagenes && vehiculoData.imagenes.length > 0) {
          // Las URLs ya vienen completas desde el endpoint
          setImagenes(vehiculoData.imagenes);
        } else if (vehiculoData.imagen_principal) {
          // Usar imagen principal si existe
          setImagenes([vehiculoData.imagen_principal]);
        } else {
          // Placeholder si no hay imágenes
          setImagenes(['https://via.placeholder.com/800x600?text=Sin+Imagen']);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar vehículo:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Cargando información del vehículo...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!vehiculo) {
    return <div className="error">Vehículo no encontrado</div>;
  }

  return (
    <div className="detalle-container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/vehiculos'); }}>
          Inicio
        </a>
        <span className="breadcrumb-separator">/</span>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/vehiculos'); }}>
          Vehículos
        </a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">
          {vehiculo.año} {vehiculo.marca} {vehiculo.modelo}
        </span>
      </div>

      <div className="detalle-grid">
        {/* Left Column: Image Gallery */}
        <div className="detalle-galeria">
          <div className="imagen-principal" >
            <img
              src={imagenes[imagenActiva]}
              alt={`${vehiculo.marca} ${vehiculo.modelo}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Sin+Imagen';
              }}
            /> 

          </div>
          
          {/* Thumbnails - Solo mostrar si hay más de una imagen */}
          {imagenes.length > 1 && (
            <div className="thumbnails-grid">
              {imagenes.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${imagenActiva === index ? 'active' : ''}`}
                  style={{ 
                    backgroundImage: `url(${img})`,
                    backgroundColor: '#2a1f3d'
                  }}
                  onClick={() => setImagenActiva(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Vehicle Info */}
        <div className="detalle-info">
          <h1 className="detalle-titulo">
            {vehiculo.año} {vehiculo.marca} {vehiculo.modelo}
          </h1>
          <p className="detalle-version">{vehiculo.version || 'Versión Estándar'}</p>
          
          <h2 className="detalle-precio">
            ${parseFloat(vehiculo.precio).toLocaleString('es-CO')}
          </h2>

          {/* Specs Grid */}
          <div className="specs-grid">
            <div className="spec-item">
              <span className="material-symbols-outlined spec-icon">speed</span>
              <div>
                <p className="spec-label">Kilometraje</p>
                <p className="spec-value">{vehiculo.kilometraje?.toLocaleString()} km</p>
              </div>
            </div>

            <div className="spec-item">
              <span className="material-symbols-outlined spec-icon">settings</span>
              <div>
                <p className="spec-label">Transmisión</p>
                <p className="spec-value">{vehiculo.transmision}</p>
              </div>
            </div>

            <div className="spec-item">
              <span className="material-symbols-outlined spec-icon">local_gas_station</span>
              <div>
                <p className="spec-label">Motor</p>
                <p className="spec-value">{vehiculo.motor}L {vehiculo.tipo_combustible}</p>
              </div>
            </div>

            <div className="spec-item">
              <span className="material-symbols-outlined spec-icon">palette</span>
              <div>
                <p className="spec-label">Color</p>
                <p className="spec-value">{vehiculo.color}</p>
              </div>
            </div>

            <div className="spec-item">
              <span className="material-symbols-outlined spec-icon">door_front</span>
              <div>
                <p className="spec-label">Puertas</p>
                <p className="spec-value">{vehiculo.num_puertas}</p>
              </div>
            </div>

            <div className="spec-item">
              <span className="material-symbols-outlined spec-icon">ac_unit</span>
              <div>
                <p className="spec-label">A/C</p>
                <p className="spec-value">{vehiculo.aire_acondicionado ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="detalle-actions">
            <button 
              className="btn-prueba-manejo"
              onClick={() => setMostrarModal(true)}
            >
              <span className="material-symbols-outlined">directions_car</span>
              Agendar Prueba de Manejo
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="detalle-tabs-section">
        {/* Tab Navigation */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${tabActiva === 'descripcion' ? 'active' : ''}`}
            onClick={() => setTabActiva('descripcion')}
          >
            Descripción
          </button>
          <button
            className={`tab-btn ${tabActiva === 'especificaciones' ? 'active' : ''}`}
            onClick={() => setTabActiva('especificaciones')}
          >
            Especificaciones Técnicas
          </button>
          <button
            className={`tab-btn ${tabActiva === 'equipamiento' ? 'active' : ''}`}
            onClick={() => setTabActiva('equipamiento')}
          >
            Equipamiento
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabActiva === 'descripcion' && (
            <div className="tab-panel">
              <h3 className="panel-title">Descripción del Vehículo</h3>
              <p className="panel-text">
                Descubre el {vehiculo.año} {vehiculo.marca} {vehiculo.modelo}, 
                un vehículo {vehiculo.estado === 'nuevo' ? 'completamente nuevo' : 'seminuevo en excelente estado'} 
                con solo {vehiculo.kilometraje?.toLocaleString()} kilómetros recorridos.
              </p>
              <p className="panel-text">
                Este {vehiculo.modelo} viene equipado con motor {vehiculo.motor}L de {vehiculo.tipo_combustible}, 
                transmisión {vehiculo.transmision?.toLowerCase()}, y acabado en color {vehiculo.color}. 
                La dirección {vehiculo.direccion?.toLowerCase()} y el sistema de control de tracción {vehiculo.control_traccion} 
                garantizan una experiencia de manejo excepcional.
              </p>
              <p className="panel-text">
                Registrado el {new Date(vehiculo.fecha_registro).toLocaleDateString('es-CO')}, 
                este vehículo representa una excelente oportunidad de inversión con características premium 
                y un precio competitivo de ${parseFloat(vehiculo.precio).toLocaleString('es-CO')}.
              </p>
            </div>
          )}

          {tabActiva === 'especificaciones' && (
            <div className="tab-panel">
              <h3 className="panel-title">Especificaciones Técnicas</h3>
              <div className="specs-table">
                <div className="spec-row">
                  <span className="spec-label-table">Marca</span>
                  <span className="spec-value-table">{vehiculo.marca}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Modelo</span>
                  <span className="spec-value-table">{vehiculo.modelo}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Versión</span>
                  <span className="spec-value-table">{vehiculo.version || 'Estándar'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Año</span>
                  <span className="spec-value-table">{vehiculo.año}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Motor</span>
                  <span className="spec-value-table">{vehiculo.motor}L</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Tipo de Combustible</span>
                  <span className="spec-value-table">{vehiculo.tipo_combustible}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Transmisión</span>
                  <span className="spec-value-table">{vehiculo.transmision}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Número de Puertas</span>
                  <span className="spec-value-table">{vehiculo.num_puertas}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Dirección</span>
                  <span className="spec-value-table">{vehiculo.direccion}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Control de Tracción</span>
                  <span className="spec-value-table">{vehiculo.control_traccion}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Kilometraje</span>
                  <span className="spec-value-table">{vehiculo.kilometraje?.toLocaleString()} km</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label-table">Estado</span>
                  <span className="spec-value-table capitalize">{vehiculo.estado}</span>
                </div>
              </div>
            </div>
          )}

          {tabActiva === 'equipamiento' && (
            <div className="tab-panel">
              <h3 className="panel-title">Equipamiento y Características</h3>
              <div className="equipamiento-grid">
                <div className="equipamiento-item">
                  <span className="material-symbols-outlined equipamiento-icon">
                    {vehiculo.aire_acondicionado ? 'check_circle' : 'cancel'}
                  </span>
                  <span>Aire Acondicionado</span>
                </div>
                <div className="equipamiento-item">
                  <span className="material-symbols-outlined equipamiento-icon">check_circle</span>
                  <span>Dirección {vehiculo.direccion}</span>
                </div>
                <div className="equipamiento-item">
                  <span className="material-symbols-outlined equipamiento-icon">check_circle</span>
                  <span>Transmisión {vehiculo.transmision}</span>
                </div>
                <div className="equipamiento-item">
                  <span className="material-symbols-outlined equipamiento-icon">check_circle</span>
                  <span>Control de Tracción {vehiculo.control_traccion}</span>
                </div>
                <div className="equipamiento-item">
                  <span className="material-symbols-outlined equipamiento-icon">check_circle</span>
                  <span>Motor {vehiculo.motor}L</span>
                </div>
                <div className="equipamiento-item">
                  <span className="material-symbols-outlined equipamiento-icon">check_circle</span>
                  <span>{vehiculo.num_puertas} Puertas</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Fuera de todo el contenido principal */}
      {mostrarModal && (
        <ModalPruebaManejo
          vehiculo={vehiculo}
          onClose={() => setMostrarModal(false)}
          onSuccess={() => {
            console.log('Prueba agendada exitosamente');
          }}
        />
      )}
    </div>
  );
}

export default VehiculoDetalle;