import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmpleados, actualizarEstadoEmpleado, eliminarEmpleado } from '../services/api';
import './Empleados.css';

function Empleados({ usuario }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const data = await getEmpleados();
      setEmpleados(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    if (!window.confirm(`¿Estás seguro de ${estadoActual ? 'desactivar' : 'activar'} este empleado?`)) {
      return;
    }

    try {
      await actualizarEstadoEmpleado(id, !estadoActual);
      alert('✅ Estado actualizado correctamente');
      fetchEmpleados();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`⚠️ ¿Estás seguro de eliminar a ${nombre}?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await eliminarEmpleado(id);
      alert('✅ Empleado eliminado exitosamente');
      fetchEmpleados();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Cargando empleados...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="empleados-container">
      {/* Header */}
      <div className="empleados-header">
        <div className="header-info">
          <h1 className="empleados-title">Gestión de Empleados</h1>
          <p className="empleados-subtitle">
            Administra los usuarios del sistema
          </p>
        </div>
        <button 
          className="btn-agregar"
          onClick={() => navigate('/formulario-empleado')}
        >
          <span className="material-symbols-outlined">person_add</span>
          Agregar Empleado
        </button>
      </div>

      {/* Stats */}
      <div className="empleados-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Empleados</p>
            <p className="stat-value">{empleados.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Activos</p>
            <p className="stat-value">{empleados.filter(e => e.activo).length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inactive">
            <span className="material-symbols-outlined">cancel</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Inactivos</p>
            <p className="stat-value">{empleados.filter(e => !e.activo).length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon admin">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <div className="stat-info">
            <p className="stat-label">Administradores</p>
            <p className="stat-value">{empleados.filter(e => e.rol === 'administrador').length}</p>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="empleados-table-container">
        {empleados.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined">group_off</span>
            <p>No hay empleados registrados</p>
            <button 
              className="btn-empty-action"
              onClick={() => navigate('/formulario-empleado')}
            >
              Agregar el primer empleado
            </button>
          </div>
        ) : (
          <table className="empleados-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id_usuario} className={!empleado.activo ? 'inactive-row' : ''}>
                  <td>
                    <div className="empleado-nombre">
                      <span className="material-symbols-outlined">account_circle</span>
                      {empleado.nombre} {empleado.apellido}
                    </div>
                  </td>
                  <td>{empleado.email}</td>
                  <td>
                    <span className={`badge-rol ${empleado.rol}`}>
                      {empleado.rol}
                    </span>
                  </td>
                  <td>{empleado.telefono || 'N/A'}</td>
                  <td>
                    <span className={`badge-estado ${empleado.activo ? 'activo' : 'inactivo'}`}>
                      {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(empleado.fecha_registro).toLocaleDateString('es-ES')}</td>
                  <td>
                    <div className="acciones">
                      <button
                        className={`btn-icon ${empleado.activo ? 'warning' : 'success'}`}
                        onClick={() => handleToggleEstado(empleado.id_usuario, empleado.activo)}
                        title={empleado.activo ? 'Desactivar' : 'Activar'}
                      >
                        <span className="material-symbols-outlined">
                          {empleado.activo ? 'block' : 'check_circle'}
                        </span>
                      </button>
                      
                      <button
                        className="btn-icon danger"
                        onClick={() => handleEliminar(empleado.id_usuario, `${empleado.nombre} ${empleado.apellido}`)}
                        title="Eliminar"
                        disabled={empleado.id_usuario === usuario?.id_usuario}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Empleados;
