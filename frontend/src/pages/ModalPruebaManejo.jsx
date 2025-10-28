// ModalPruebaManejo.jsx
import { useState } from 'react';
import { crearPruebaManejo } from '../services/api';
import './ModalPruebaManejo.css';

function ModalPruebaManejo({ vehiculo, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    email: '',
    fecha_prueba: '',
    hora_prueba: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Obtener fecha máxima (30 días desde hoy)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.documento.trim()) {
      newErrors.documento = 'El documento es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.fecha_prueba) {
      newErrors.fecha_prueba = 'La fecha es requerida';
    }

    if (!formData.hora_prueba) {
      newErrors.hora_prueba = 'La hora es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const pruebaData = {
        ...formData,
        id_vehiculo: vehiculo.id_vehiculo
      };

      const result = await crearPruebaManejo(pruebaData);
      alert(`✅ Prueba de manejo agendada exitosamente!\n\nSe le asignará un empleado que lo contactará pronto.`);
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <span className="material-symbols-outlined">directions_car</span>
            <div>
              <h2>Agendar Prueba de Manejo</h2>
              <p className="vehiculo-info">
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.año}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Información Personal</h3>
            
            <div className="form-grid">
              <div className={`form-field ${errors.nombre ? 'error' : ''}`}>
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}
              </div>

              <div className={`form-field ${errors.apellido ? 'error' : ''}`}>
                <label htmlFor="apellido">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                />
                {errors.apellido && <span className="error-text">{errors.apellido}</span>}
              </div>

              <div className={`form-field ${errors.documento ? 'error' : ''}`}>
                <label htmlFor="documento">Documento *</label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  placeholder="Ej: 1234567890"
                />
                {errors.documento && <span className="error-text">{errors.documento}</span>}
              </div>

              <div className={`form-field ${errors.telefono ? 'error' : ''}`}>
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 3001234567"
                />
                {errors.telefono && <span className="error-text">{errors.telefono}</span>}
              </div>

              <div className={`form-field full-width ${errors.email ? 'error' : ''}`}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Fecha y Hora de la Prueba</h3>
            
            <div className="form-grid">
              <div className={`form-field ${errors.fecha_prueba ? 'error' : ''}`}>
                <label htmlFor="fecha_prueba">Fecha *</label>
                <input
                  type="date"
                  id="fecha_prueba"
                  name="fecha_prueba"
                  value={formData.fecha_prueba}
                  onChange={handleChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                />
                {errors.fecha_prueba && <span className="error-text">{errors.fecha_prueba}</span>}
              </div>

              <div className={`form-field ${errors.hora_prueba ? 'error' : ''}`}>
                <label htmlFor="hora_prueba">Hora *</label>
                <input
                  type="time"
                  id="hora_prueba"
                  name="hora_prueba"
                  value={formData.hora_prueba}
                  onChange={handleChange}
                  min="08:00"
                  max="18:00"
                />
                {errors.hora_prueba && <span className="error-text">{errors.hora_prueba}</span>}
                <small className="field-hint">Horario: 8:00 AM - 6:00 PM</small>
              </div>

              <div className="form-field full-width">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Comentarios adicionales (opcional)"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="info-box">
            <span className="material-symbols-outlined">info</span>
            <p>Un empleado será asignado automáticamente y se pondrá en contacto contigo para confirmar la prueba de manejo.</p>
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              <span className="material-symbols-outlined">check_circle</span>
              Agendar Prueba
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPruebaManejo;