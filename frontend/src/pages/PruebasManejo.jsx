import { useState, useEffect } from 'react';
import { getPruebasManejo, actualizarEstadoPrueba, getEmpleados } from '../services/api';
import './PruebasManejo.css';

function PruebasManejo({ usuario }) {
  const [pruebas, setPruebas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pruebasData, empleadosData] = await Promise.all([
        getPruebasManejo(),
        getEmpleados()
      ]);
      setPruebas(pruebasData);
      setEmpleados(empleadosData.filter(e => e.activo));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (idPrueba, nuevoEstado, idEmpleado = null) => {
    try {
      await actualizarEstadoPrueba(idPrueba, nuevoEstado, idEmpleado);
      alert('✅ Estado actualizado correctamente');
      fetchData();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleAsignarEmpleado = async (idPrueba, idEmpleado) => {
    try {
      await actualizarEstadoPrueba(idPrueba, 'confirmada', idEmpleado);
      alert('✅ Empleado asignado y prueba confirmada');
      fetchData();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      'pendiente': 'badge-pendiente',
      'confirmada': 'badge-confirmada',
      'completada': 'badge-completada',
      'cancelada': 'badge-cancelada'
    };
    return classes[estado] || 'badge-pendiente';
  };

  const pruebasFiltradas = filtroEstado === 'todos' 
    ? pruebas 
    : pruebas.filter(p => p.estado === filtroEstado);

  if (loading) {
    return <div className="loading">Cargando pruebas de manejo...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="pruebas-container">
      {/* Header */}
      <div className="pruebas-header">
        <div className="header-info">
          <h1 className="pruebas-title">Pruebas de Manejo</h1>
          <p className="pruebas-subtitle">
            Gestiona las solicitudes de pruebas de manejo
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="pruebas-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Total</p>
            <p className="stat-value">{pruebas.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pendiente">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Pendientes</p>
            <p className="stat-value">
              {pruebas.filter(p => p.estado === 'pendiente').length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon confirmada">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Confirmadas</p>
            <p className="stat-value">
              {pruebas.filter(p => p.estado === 'confirmada').length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completada">
            <span className="material-symbols-outlined">done_all</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Completadas</p>
            <p className="stat-value">
              {pruebas.filter(p => p.estado === 'completada').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="pruebas-filtros">
        <button
          className={`filtro-btn ${filtroEstado === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('todos')}
        >
          Todas ({pruebas.length})
        </button>
        <button
          className={`filtro-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('pendiente')}
        >
          Pendientes ({pruebas.filter(p => p.estado === 'pendiente').length})
        </button>
        <button
          className={`filtro-btn ${filtroEstado === 'confirmada' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('confirmada')}
        >
          Confirmadas ({pruebas.filter(p => p.estado === 'confirmada').length})
        </button>
        <button
          className={`filtro-btn ${filtroEstado === 'completada' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('completada')}
        >
          Completadas ({pruebas.filter(p => p.estado === 'completada').length})
        </button>
      </div>

      {/* Lista de Pruebas */}
      <div className="pruebas-lista">
        {pruebasFiltradas.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined">event_busy</span>
            <p>No hay pruebas de manejo {filtroEstado !== 'todos' ? filtroEstado + 's' : ''}</p>
          </div>
        ) : (
          pruebasFiltradas.map((prueba) => (
            <div key={prueba.id_prueba} className="prueba-card">
              {/* Header de la tarjeta */}
              <div className="prueba-card-header">
                <div className="prueba-info-principal">
                  <span className="material-symbols-outlined vehiculo-icon">
                    directions_car
                  </span>
                  <div>
                    <h3 className="prueba-vehiculo">
                      {prueba.marca} {prueba.modelo} {prueba.año}
                    </h3>
                    <p className="prueba-fecha">
                      <span className="material-symbols-outlined">calendar_today</span>
                      {new Date(prueba.fecha_prueba).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} - {prueba.hora_prueba}
                    </p>
                  </div>
                </div>
                <span className={`badge-estado ${getEstadoBadgeClass(prueba.estado)}`}>
                  {prueba.estado}
                </span>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="prueba-card-content">
                <div className="prueba-seccion">
                  <h4 className="seccion-titulo">
                    <span className="material-symbols-outlined">person</span>
                    Datos del Cliente
                  </h4>
                  <div className="datos-grid">
                    <div className="dato">
                      <span className="dato-label">Nombre:</span>
                      <span className="dato-valor">{prueba.nombre} {prueba.apellido}</span>
                    </div>
                    <div className="dato">
                      <span className="dato-label">Documento:</span>
                      <span className="dato-valor">{prueba.documento}</span>
                    </div>
                    <div className="dato">
                      <span className="dato-label">Teléfono:</span>
                      <span className="dato-valor">{prueba.telefono}</span>
                    </div>
                    <div className="dato">
                      <span className="dato-label">Email:</span>
                      <span className="dato-valor">{prueba.email}</span>
                    </div>
                  </div>
                </div>

                {prueba.observaciones && (
                  <div className="prueba-observaciones">
                    <h4 className="seccion-titulo">
                      <span className="material-symbols-outlined">description</span>
                      Observaciones
                    </h4>
                    <p>{prueba.observaciones}</p>
                  </div>
                )}

                {/* Empleado asignado y selector */}
                <div className="prueba-seccion">
                  <h4 className="seccion-titulo">
                    <span className="material-symbols-outlined">badge</span>
                    Empleado Asignado
                  </h4>
                  {prueba.estado === 'pendiente' ? (
                    <select
                      className="select-empleado"
                      value={prueba.id_empleado_asignado || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAsignarEmpleado(prueba.id_prueba, parseInt(e.target.value));
                        }
                      }}
                    >
                      <option value="">Seleccionar empleado...</option>
                      {empleados.map(emp => (
                        <option key={emp.id_usuario} value={emp.id_usuario}>
                          {emp.nombre} {emp.apellido}
                        </option>
                      ))}
                    </select>
                  ) : prueba.empleado_asignado ? (
                    <p className="empleado-asignado-nombre">
                      {prueba.empleado_asignado}
                    </p>
                  ) : (
                    <p className="sin-asignar">Sin asignar</p>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="prueba-card-actions">
                <div className="action-buttons">
                  {prueba.estado === 'pendiente' && (
                    <>
                      <button
                        className="btn-action confirmar"
                        onClick={() => {
                          if (!prueba.id_empleado_asignado) {
                            alert('⚠️ Debes asignar un empleado primero');
                            return;
                          }
                          handleCambiarEstado(prueba.id_prueba, 'confirmada', prueba.id_empleado_asignado);
                        }}
                        disabled={!prueba.id_empleado_asignado}
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                        Confirmar
                      </button>
                      <button
                        className="btn-action cancelar"
                        onClick={() => handleCambiarEstado(prueba.id_prueba, 'cancelada')}
                      >
                        <span className="material-symbols-outlined">close</span>
                        Cancelar
                      </button>
                    </>
                  )}

                  {prueba.estado === 'confirmada' && (
                    <>
                      <button
                        className="btn-action completar"
                        onClick={() => handleCambiarEstado(prueba.id_prueba, 'completada')}
                      >
                        <span className="material-symbols-outlined">done</span>
                        Completar
                      </button>
                      <button
                        className="btn-action cancelar"
                        onClick={() => handleCambiarEstado(prueba.id_prueba, 'cancelada')}
                      >
                        <span className="material-symbols-outlined">close</span>
                        Cancelar
                      </button>
                    </>
                  )}

                  {(prueba.estado === 'completada' || prueba.estado === 'cancelada') && (
                    <p className="estado-final">
                      Prueba {prueba.estado}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PruebasManejo;