import { useState, useEffect } from 'react';
import { getVehiculos, getClientes, getVentas } from '../services/api';

function Home({ usuario }) {
  const [stats, setStats] = useState({
    vehiculos: 0,
    clientes: 0,
    ventas: 0,
    inventarioValor: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [vehiculos, clientes, ventas] = await Promise.all([
        getVehiculos(),
        getClientes(),
        getVentas()
      ]);

      const inventarioValor = vehiculos.reduce((sum, v) => sum + parseFloat(v.precio), 0);

      setStats({
        vehiculos: vehiculos.length,
        clientes: clientes.length,
        ventas: ventas.length,
        inventarioValor
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const cards = [
    {
      title: 'Vehículos en Inventario',
      value: stats.vehiculos,
      icon: '🚗',
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Clientes Registrados',
      value: stats.clientes,
      icon: '👥',
      color: 'bg-green-500',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Ventas Realizadas',
      value: stats.ventas,
      icon: '💰',
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Valor del Inventario',
      value: formatCurrency(stats.inventarioValor),
      icon: '💵',
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50'
    }
  ];

  return (
    <div>
      {/* Bienvenida */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          ¡Bienvenido, {usuario.nombre}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Panel de control de RatonaMotors - Sistema de gestión de concesionario
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgLight} p-4 rounded-full`}>
                <span className="text-3xl">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <span>🚗</span>
            <span>Ver Inventario</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <span>➕</span>
            <span>Agregar Vehículo</span>
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <span>💼</span>
            <span>Registrar Venta</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;