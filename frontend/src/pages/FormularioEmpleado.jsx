import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {crearEmpleado } from '../services/api';
import './FormularioEmpleado.css';

function FormularioEmpleado({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'empleado',
    telefono: '',
    activo: true
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
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
      const result = await crearEmpleado(formData);
      alert('✅ Empleado creado exitosamente');
      if (onSuccess) onSuccess();
      navigate('/empleados');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <div className="header-brand">
            <div className="brand-icon flex items-center justify-center gap-2 mb-6">
          <img
            src="/src/assets/minnieBL.png"
            alt="Logo Ratona Motors"
            style={{ width: '50px', height: '46px' }}
            className=" object-contain"
          />
            </div>
            <h2>Nuevo Empleado</h2>
          </div>
          <button onClick={handleClose} className="close-button">×</button>
        </div>

        {/* Main */}
        <div className="form-main">
          <div className="form-title-wrapper">
            <h1 className="form-title">Registrar Empleado</h1>
          </div>

          <form onSubmit={handleSubmit} className="employee-form">
            {/* Información Personal */}
            <div className="form-section">
              <h2 className="section-title">Información Personal</h2>
              
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

                <div className={`form-field ${errors.email ? 'error' : ''}`}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@ratonamotors.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className={`form-field ${errors.telefono ? 'error' : ''}`}>
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 612345678"
                  />
                  {errors.telefono && <span className="error-text">{errors.telefono}</span>}
                </div>
              </div>
            </div>

            {/* Credenciales y Acceso */}
            <div className="form-section">
              <h2 className="section-title">Credenciales y Acceso</h2>
              
              <div className="form-grid">
                <div className={`form-field ${errors.password ? 'error' : ''}`}>
                  <label htmlFor="password">Contraseña *</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="rol">Rol *</label>
                  <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>

                <div className="form-field full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                    />
                    <span>Usuario activo (puede iniciar sesión)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button type="button" onClick={handleClose} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                <span className="icon">✓</span>
                Guardar Empleado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormularioEmpleado;
