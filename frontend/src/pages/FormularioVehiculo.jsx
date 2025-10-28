import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Importar hook
import { crearVehiculo } from '../services/api';
import './FormularioVehiculo.css';

function FormularioVehiculo({ onClose, onSuccess }) {
  const navigate = useNavigate(); // ✅ Inicializar navegación

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    color: '',
    precio: '',
    kilometraje: 0,
    estado: 'nuevo',
    imagen_url: '',
    caracteristicas: {
      num_puertas: 4,
      tipo_combustible: 'Gasolina',
      motor: '',
      transmision: 'Manual',
      aire_acondicionado: true,
      direccion: 'Hidraulica',
      control_traccion: '4x2',
      version: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('caract_')) {
      const caracName = name.replace('caract_', '');
      setFormData({
        ...formData,
        caracteristicas: {
          ...formData.caracteristicas,
          [caracName]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await crearVehiculo(formData);
      alert('Vehículo creado exitosamente');
      if (onSuccess) onSuccess();
      navigate(-1); // 
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      alert('Error al crear el vehículo');
    }
  };

  // ✅ Nueva función para cerrar (sirve tanto en modal como en ruta)
  const handleClose = () => {
    if (onClose) onClose(); // Si se abrió como modal
    else navigate(-1);      // Si se abrió como ruta (por URL)
  };

  return (
    <div className="form-overlay" onClick={handleClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="form-header">
          <div className="header-brand">
            <div className="brand-icon flex items-center justify-center gap-2 mb-6">
          <img
            src="/src/assets/minnieBL.png"
            alt="Logo Ratona Motors"
            style={{ width: '50px', height: '46px' }}
            className=" object-contain"
          />
            </div>
            <h2>RatonaMotors</h2>
          </div>
          <button className="close-button" onClick={handleClose}>✕</button>
        </header>

        {/* Main Content */}
        <main className="form-main">
          <div className="form-title-wrapper">
            <h1 className="form-title">Añadir Nuevo Vehículo al Inventario</h1>
          </div>

          <form onSubmit={handleSubmit} className="vehicle-form">
            {/* Información Básica */}
            <section className="form-section">
              <h2 className="section-title">Información Básica</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label>Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    placeholder="e.g., Renault"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="e.g., Koleos"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Año</label>
                  <input
                    type="number"
                    name="año"
                    value={formData.año}
                    onChange={handleInputChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    placeholder="e.g., 89500000"
                    step="100000"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Kilometraje</label>
                  <input
                    type="number"
                    name="kilometraje"
                    value={formData.kilometraje}
                    onChange={handleInputChange}
                    placeholder="e.g., 15000"
                    min="0"
                  />
                </div>

                <div className="form-field">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Blanco Perla"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado</option>
                  </select>
                </div>

                <div className="form-field full-width">
                  <label>URL de Imagen</label>
                  <input
                    type="url"
                    name="imagen_url"
                    value={formData.imagen_url}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>
            </section>

            {/* Especificaciones Técnicas */}
            <section className="form-section">
              <h2 className="section-title">Especificaciones Técnicas</h2>
              <div className="form-grid">
                {/* Aquí van tus campos técnicos como antes */}
                {/* (omito para que no se repita todo, pero no cambian) */}
              </div>
            </section>

            {/* Botones de acción */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                <span className="icon">💾</span>
                Guardar Vehículo
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default FormularioVehiculo;
