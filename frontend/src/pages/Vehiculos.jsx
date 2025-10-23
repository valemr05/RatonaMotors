import { useState, useEffect } from 'react';
import { getVehiculos, crearVehiculo } from '../services/api';

function Vehiculos({ usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      const data = await getVehiculos();
      setVehiculos(data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      alert('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

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
      setShowForm(false);
      loadVehiculos();
      // Reset form
      setFormData({
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
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      alert('Error al crear el vehículo');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Cargando vehículos...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventario de Vehículos</h1>
          <p className="text-gray-600 mt-1">{vehiculos.length} vehículos disponibles</p>
        </div>
        {usuario.rol === 'administrador' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>{showForm ? '✕' : '➕'}</span>
            <span>{showForm ? 'Cancelar' : 'Agregar Vehículo'}</span>
          </button>
        )}
      </div>

      {/* Formulario de Agregar Vehículo */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Nuevo Vehículo</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: Renault"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: Koleos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleInputChange}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: Blanco"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: 89500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraje</label>
                <input
                  type="number"
                  name="kilometraje"
                  value={formData.kilometraje}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen</label>
                <input
                  type="url"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Características */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-4">Características Técnicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motor</label>
                  <input
                    type="text"
                    name="caract_motor"
                    value={formData.caracteristicas.motor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Ej: 2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmisión</label>
                  <select
                    name="caract_transmision"
                    value={formData.caracteristicas.transmision}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatica">Automática</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Combustible</label>
                  <select
                    name="caract_tipo_combustible"
                    value={formData.caracteristicas.tipo_combustible}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diésel</option>
                    <option value="Electrico">Eléctrico</option>
                    <option value="Hibrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Puertas</label>
                  <input
                    type="number"
                    name="caract_num_puertas"
                    value={formData.caracteristicas.num_puertas}
                    onChange={handleInputChange}
                    min="2"
                    max="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <select
                    name="caract_direccion"
                    value={formData.caracteristicas.direccion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Hidraulica">Hidráulica</option>
                    <option value="Electrica">Eléctrica</option>
                    <option value="Mecanica">Mecánica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tracción</label>
                  <select
                    name="caract_control_traccion"
                    value={formData.caracteristicas.control_traccion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="4x2">4x2</option>
                    <option value="4x4">4x4</option>
                    <option value="AWD">AWD</option>
                    <option value="FWD">FWD</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Versión</label>
                <input
                  type="text"
                  name="caract_version"
                  value={formData.caracteristicas.version}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: 2.5 Intens"
                />
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  name="caract_aire_acondicionado"
                  checked={formData.caracteristicas.aire_acondicionado}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Aire Acondicionado
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Guardar Vehículo
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de Vehículos */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ border: '40px solid transparent', display: 'grid', gridTemplateColumns: 'repeat(3, 400px)', gap: '12px' }}>
        {vehiculos.map((vehiculo) => (
           <div key={vehiculo.id_vehiculo} className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
            {/* Imagen con badge de estado */}
            <div className="relative h-36 bg-gray-100 overflow-hidden">
              {vehiculo.imagen_url ? (
                <img
                  src={vehiculo.imagen_url}
                  alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <span className="text-7xl opacity-30">🚗</span>
                </div>
              )}
              
              {/* Badge flotante */}
              <div className="absolute top-2 left-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-md ${
                  vehiculo.estado === 'nuevo' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {vehiculo.estado === 'nuevo' ? 'NUEVO' : 'USADO'}
                </span>
              </div>

              {/* Icono de favorito */}
              <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors">
                <span className="text-gray-400 text-lg">♡</span>
              </button>
            </div>

            {/* Contenido */}
            <div className="p-3">
              {/* Título y versión */}
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-0.5">
                  {vehiculo.marca} {vehiculo.modelo}
                </h3>
                {vehiculo.version && (
                  <p className="text-xs text-gray-600">{vehiculo.version}</p>
                )}
              </div>

              {/* Precio destacado */}
              <div className="mb-2">
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(vehiculo.precio)}
                </p>
              </div>

              {/* Info compacta */}
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2 pb-2 border-b border-gray-100">
                <div className="flex items-center space-x-1">
                  <span>{vehiculo.año}</span>
                  <span>|</span>
                  <span>{vehiculo.kilometraje > 0 ? `${vehiculo.kilometraje.toLocaleString()} Km` : '0 Km'}</span>
                </div>
              </div>

              {/* Botón de acción */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-xs">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Mensaje si no hay vehículos */}
      {vehiculos.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay vehículos disponibles</h3>
          <p className="text-gray-600">Agrega tu primer vehículo al inventario</p>
        </div>
      )}
    </div>
  );
}

export default Vehiculos;