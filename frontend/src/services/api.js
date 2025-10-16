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