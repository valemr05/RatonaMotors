import { useState, useEffect } from 'react';
import { getVehiculos, getClientes, crearVenta, getEmpleados } from '../services/api';
import './AgregarVenta.css';

function AgregarVenta({ show, onClose, onSuccess, usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    id_vehiculo: '',
    id_cliente: '',
    id_usuario: usuario.id_usuario || '', // Obtener el ID del usuario logueado
    precio_venta: '',
    fecha_venta: '',
    forma_pago: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      loadData();
    }
  }, [show]);

  const loadData = async () => {
    try {
      const [vehiculosData, clientesData] = await Promise.all([
        getVehiculos(),
        getClientes(),
        getEmpleados()
      ]);
      setVehiculos(vehiculosData.filter(v => v.disponible));
      setClientes(clientesData);
      setEmpleados(empleadosData.filter(e => e.activo));
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await crearVenta(formData);
      alert('Venta registrada exitosamente');
      onSuccess();
      onClose();
      // Resetear formulario
      setFormData({
        id_vehiculo: '',
        id_cliente: '',
        id_usuario: '',
        precio_venta: '',
        fecha_venta: '',
        forma_pago: '',
        observaciones: ''
      });
    } catch (error) {
      console.error('Error al crear venta:', error);
      alert('Error al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-form">
          <div>
            <h2 className="form-title">Registrar Nueva Venta</h2>
            <p className="form-subtitle">
              Rellene los detalles a continuación para registrar una nueva venta en el sistema.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sale-form">
          {/* Vehículo */}
          <div className="form-field full-width">
            <label className="form-label">
              <p className="label-text">Vehículo</p>
              <select
                name="id_vehiculo"
                value={formData.id_vehiculo}
                onChange={handleInputChange}
                className="form-select-field"
                required
              >
                <option value="" disabled>Seleccionar vehículo...</option>
                {vehiculos.map(vehiculo => (
                  <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                    {vehiculo.marca} {vehiculo.modelo} {vehiculo.año} - ${parseFloat(vehiculo.precio).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Cliente */}
          <div className="form-field full-width">
            <label className="form-label">
              <p className="label-text">Cliente</p>
              <select
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleInputChange}
                className="form-select-field"
                required
              >
                <option value="" disabled>Seleccionar cliente...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre} {cliente.apellido} - {cliente.documento}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Vendedor */}
          <div className="form-group">
            <label htmlFor="id_usuario">
              Vendedor <span className="required">*</span>
            </label>
            <input
              type="text"
              id="id_usuario"
              value={`${usuario?.nombre || ''} ${usuario?.apellido || ''}`}
              disabled
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                cursor: 'not-allowed'
              }}
            />
            <small style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
              Las ventas se registran automáticamente a tu nombre
            </small>
          </div>

          {/* Monto de Venta */}
          <div className="form-field">
            <label className="form-label">
              <p className="label-text">Monto de Venta</p>
              <div className="input-with-icon">
                <span className="input-icon">$</span>
                <input
                  type="number"
                  name="precio_venta"
                  value={formData.precio_venta}
                  onChange={handleInputChange}
                  className="form-input-field with-icon"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </label>
          </div>

          {/* Fecha de Venta */}
          <div className="form-field">
            <label className="form-label">
              <p className="label-text">Fecha de Venta</p>
              <input
                type="date"
                name="fecha_venta"
                value={formData.fecha_venta}
                onChange={handleInputChange}
                className="form-input-field"
                required
              />
            </label>
          </div>

          {/* Método de Pago */}
          <div className="form-field full-width">
            <label className="form-label">
              <p className="label-text">Método de Pago</p>
              <select
                name="forma_pago"
                value={formData.forma_pago}
                onChange={handleInputChange}
                className="form-select-field"
                required
              >
                <option value="" disabled>Seleccionar método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta de Crédito</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Financiación">Financiación</option>
              </select>
            </label>
          </div>

          {/* Notas Adicionales */}
          <div className="form-field full-width">
            <label className="form-label">
              <p className="label-text">Notas Adicionales</p>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="form-textarea-field"
                placeholder="Añadir cualquier detalle relevante sobre la venta..."
                rows="4"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="form-actions full-width">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarVenta;
