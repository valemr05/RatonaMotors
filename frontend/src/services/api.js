import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ========== VEHÍCULOS ==========
export const getVehiculos = async () => {
  try {
    const response = await axios.get(`${API_URL}/vehiculos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    throw error;
  }
};

export const getVehiculo = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/vehiculos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    throw error;
  }
};

export const crearVehiculo = async (vehiculoData) => {
  try {
    const response = await axios.post(`${API_URL}/vehiculos`, vehiculoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    throw error;
  }
};

// ========== FUNCIONES DE IMÁGENES DE VEHÍCULOS ==========

export const getImagenesVehiculo = async (id) => {
  const response = await fetch(`${API_URL}/vehiculos/${id}/imagenes`);
  
  if (!response.ok) {
    throw new Error('Error al obtener imágenes');
  }
  
  return response.json();
};

export const agregarImagenVehiculo = async (id, imagenData) => {
  const response = await fetch(`${API_URL}/vehiculos/${id}/imagenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imagenData),
  });

  if (!response.ok) {
    throw new Error('Error al agregar imagen');
  }

  return response.json();
};

export const eliminarImagen = async (id) => {
  const response = await fetch(`${API_URL}/imagenes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar imagen');
  }

  return response.json();
};

// ========== CLIENTES ==========
export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/clientes`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

export const crearCliente = async (clienteData) => {
  try {
    const response = await axios.post(`${API_URL}/clientes`, clienteData);
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
};

// ========== VENTAS ==========
export const getVentas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
};

export const crearVenta = async (ventaData) => {
  try {
    const response = await axios.post(`${API_URL}/ventas`, ventaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear venta:', error);
    throw error;
  }
};

// ========== EMPLEADOS/USUARIOS ==========

export const getEmpleados = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
};

export const crearEmpleado = async (empleadoData) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios`, empleadoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear empleado:', error);
    throw error;
  }
};

export const actualizarEstadoEmpleado = async (id, activo) => {
  try {
    const response = await axios.patch(`${API_URL}/usuarios/${id}/estado`, { activo });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado del empleado:', error);
    throw error;
  }
};

export const eliminarEmpleado = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    throw error;
  }
};

// ========== LOGIN ==========
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// ========== FUNCIONES DEL DASHBOARD ==========

export const getDashboardStats = async () => {
  const response = await fetch(`${API_URL}/dashboard/stats`);
  
  if (!response.ok) {
    throw new Error('Error al obtener estadísticas');
  }
  
  return response.json();
};

export const getDashboardActivities = async () => {
  const response = await fetch(`${API_URL}/dashboard/activities`);
  
  if (!response.ok) {
    throw new Error('Error al obtener actividades');
  }
  
  return response.json();
};

// ========== PRUEBAS DE MANEJO ==========

export const getPruebasManejo = async () => {
  try {
    const response = await axios.get(`${API_URL}/pruebas-manejo`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pruebas de manejo:', error);
    throw error;
  }
};

export const crearPruebaManejo = async (pruebaData) => {
  try {
    const response = await axios.post(`${API_URL}/pruebas-manejo`, pruebaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear prueba de manejo:', error);
    throw error;
  }
};

export const actualizarEstadoPrueba = async (id, estado, idEmpleado = null) => {
  try {
    const response = await axios.patch(`${API_URL}/pruebas-manejo/${id}`, { 
      estado,
      id_empleado_asignado: idEmpleado 
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado de prueba:', error);
    throw error;
  }
};

// Notificaciones
export const getNotificacionesPendientes = async () => {
  const response = await fetch(`${API_URL}/notificaciones/pendientes`);
  if (!response.ok) throw new Error('Error al obtener notificaciones pendientes');
  return response.json();
};

export const getNotificacionesRecientes = async () => {
  const response = await fetch(`${API_URL}/notificaciones/recientes`);
  if (!response.ok) throw new Error('Error al obtener notificaciones recientes');
  return response.json();
};



// Agrega estas funciones al final de tu api.js

// ========== FUNCIONES PARA GRÁFICOS DEL DASHBOARD ==========

export const getVentasPorMes = async () => {
  const response = await fetch(`${API_URL}/dashboard/ventas-por-mes`);
  
  if (!response.ok) {
    throw new Error('Error al obtener ventas por mes');
  }
  
  return response.json();
};

export const getVehiculosPorMarca = async () => {
  const response = await fetch(`${API_URL}/dashboard/vehiculos-por-marca`);
  
  if (!response.ok) {
    throw new Error('Error al obtener vehículos por marca');
  }
  
  return response.json();
};

export const getVentasPorVendedor = async () => {
  const response = await fetch(`${API_URL}/dashboard/ventas-por-vendedor`);
  
  if (!response.ok) {
    throw new Error('Error al obtener ventas por vendedor');
  }
  
  return response.json();
};
//actualizar estado 

