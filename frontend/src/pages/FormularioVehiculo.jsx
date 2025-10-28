import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormularioVehiculo.css';

function FormularioVehiculo({ onClose, onSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    color: '',
    precio: '',
    kilometraje: 0,
    estado: 'nuevo',
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

  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Manejar selección de imágenes
  const handleImagenesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagenes.length > 5) {
      alert('⚠️ Puedes subir máximo 5 imágenes');
      return;
    }

    setImagenes(prev => [...prev, ...files]);

    // Generar previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // Eliminar imagen de la selección
  const handleRemoveImage = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imagenes.length === 0) {
      alert('⚠️ Debes subir al menos una imagen');
      return;
    }

    setLoading(true);

    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      
      // Agregar datos del vehículo
      formDataToSend.append('marca', formData.marca);
      formDataToSend.append('modelo', formData.modelo);
      formDataToSend.append('año', formData.año);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('kilometraje', formData.kilometraje);
      formDataToSend.append('estado', formData.estado);
      formDataToSend.append('caracteristicas', JSON.stringify(formData.caracteristicas));

      // Agregar imágenes
      imagenes.forEach((imagen, index) => {
        formDataToSend.append('imagenes', imagen);
        if (index === 0) {
          formDataToSend.append('imagen_principal_index', 0);
        }
      });

      // Enviar al backend
      const response = await fetch('http://localhost:5000/api/vehiculos', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Error al crear vehículo');
      }

      const result = await response.json();
      alert('✅ Vehículo creado exitosamente');
      
      if (onSuccess) onSuccess();
      navigate(-1);
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
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
                className="object-contain"
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
                  <label>Marca *</label>
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
                  <label>Modelo *</label>
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
                  <label>Año *</label>
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
                  <label>Precio *</label>
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
                  <label>Color *</label>
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
              </div>
            </section>

            {/* Especificaciones Técnicas */}
            <section className="form-section">
              <h2 className="section-title">Especificaciones Técnicas</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label>Motor</label>
                  <input
                    type="text"
                    name="caract_motor"
                    value={formData.caracteristicas.motor}
                    onChange={handleInputChange}
                    placeholder="e.g., 2.0L Turbo"
                  />
                </div>

                <div className="form-field">
                  <label>Tipo de Combustible</label>
                  <select
                    name="caract_tipo_combustible"
                    value={formData.caracteristicas.tipo_combustible}
                    onChange={handleInputChange}
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Transmisión</label>
                  <select
                    name="caract_transmision"
                    value={formData.caracteristicas.transmision}
                    onChange={handleInputChange}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automático">Automático</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Número de Puertas</label>
                  <input
                    type="number"
                    name="caract_num_puertas"
                    value={formData.caracteristicas.num_puertas}
                    onChange={handleInputChange}
                    min="2"
                    max="5"
                  />
                </div>

                <div className="form-field">
                  <label>Dirección</label>
                  <select
                    name="caract_direccion"
                    value={formData.caracteristicas.direccion}
                    onChange={handleInputChange}
                  >
                    <option value="Hidraulica">Hidráulica</option>
                    <option value="Electrica">Eléctrica</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Tracción</label>
                  <select
                    name="caract_control_traccion"
                    value={formData.caracteristicas.control_traccion}
                    onChange={handleInputChange}
                  >
                    <option value="4x2">4x2</option>
                    <option value="4x4">4x4</option>
                    <option value="AWD">AWD</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Versión</label>
                  <input
                    type="text"
                    name="caract_version"
                    value={formData.caracteristicas.version}
                    onChange={handleInputChange}
                    placeholder="e.g., Limited Edition"
                  />
                </div>

                <div className="form-field checkbox-field">
                  <label>
                    <input
                      type="checkbox"
                      name="caract_aire_acondicionado"
                      checked={formData.caracteristicas.aire_acondicionado}
                      onChange={handleInputChange}
                    />
                    <span>Aire Acondicionado</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Imágenes */}
            <section className="form-section">
              <h2 className="section-title">Imágenes del Vehículo *</h2>
              
              <div className="upload-section">
                <label htmlFor="imagenes" className="upload-label">
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                  <span>Seleccionar imágenes</span>
                  <span className="upload-hint">(Máximo 5 imágenes)</span>
                </label>
                <input
                  type="file"
                  id="imagenes"
                  accept="image/*"
                  multiple
                  onChange={handleImagenesChange}
                  style={{ display: 'none' }}
                />
              </div>

              {previews.length > 0 && (
                <div className="preview-grid">
                  {previews.map((preview, index) => (
                    <div key={index} className="preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="preview-remove"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      {index === 0 && (
                        <span className="preview-badge">Principal</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Botones de acción */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="icon">💾</span>
                    Guardar Vehículo
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default FormularioVehiculo;
