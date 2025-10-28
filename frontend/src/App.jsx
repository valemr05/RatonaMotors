import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Home from './pages/Home';
import Vehiculos from './pages/Vehiculos';
import VehiculoDetalle from './pages/VehiculoDetalle';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import FormularioVehiculo from './pages/FormularioVehiculo';
import Login from './components/Login';
import Unauthorized from './pages/Unauthorized';
import FormularioEmpleado from './pages/FormularioEmpleado';
import Empleados from './pages/Empleados';
import PruebasManejo from './pages/PruebasManejo';


import './App.css';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const handleLogin = (userData) => {
    setUsuario(userData);
    localStorage.setItem('usuario', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* ========== RUTAS PÚBLICAS (Sin Login) ========== */}
          
          {/* Catálogo público para clientes */}
          <Route path="/" element={<Vehiculos usuario={null} />} />
          <Route path="/catalogo" element={<Vehiculos usuario={null} />} />
          <Route path="/catalogo/:id" element={<VehiculoDetalle />} />
          
          {/* Login - Si ya está logueado, redirige según rol */}
          <Route 
            path="/login" 
            element={
              usuario ? (
                <Navigate 
                  to={usuario.rol === 'administrador' ? '/dashboard' : '/vehiculos'} 
                  replace 
                />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />

          {/* Página de acceso denegado */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ========== RUTAS PROTEGIDAS (Con Login) ========== */}
          <Route
            path="/*"
            element={
              usuario ? (
                <div className="flex min-h-screen">
                  <Navbar usuario={usuario} onLogout={handleLogout} />
                  
                  <main className="flex-1 p-8 overflow-y-auto">
                    <Routes>
                      {/* Dashboard - Solo Administradores */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['administrador']}>
                            <Home usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />

                      {/* Vehículos - Todos los empleados y admin */}
                      <Route
                        path="/vehiculos"
                        element={
                          <ProtectedRoute allowedRoles={['administrador', 'empleado']}>
                            <Vehiculos usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/vehiculos/:id"
                        element={
                          <ProtectedRoute allowedRoles={['administrador', 'empleado']}>
                            <VehiculoDetalle />
                          </ProtectedRoute>
                        }
                      />

                      {/* Formulario Vehículo - Solo Administradores */}
                      <Route
                        path="/formulario-vehiculo"
                        element={
                          <ProtectedRoute allowedRoles={['administrador']}>
                            <FormularioVehiculo usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />

                      {/* Clientes - Todos */}
                      <Route
                        path="/clientes"
                        element={
                          <ProtectedRoute allowedRoles={['administrador', 'empleado']}>
                            <Clientes usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />

                      {/* Ventas - Todos */}
                      <Route
                        path="/ventas"
                        element={
                          <ProtectedRoute allowedRoles={['administrador', 'empleado']}>
                            <Ventas usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />

                      {/* Formulario Empleado - Solo Administradores */}
                      <Route
                        path="/formulario-empleado"
                        element={
                          <ProtectedRoute allowedRoles={['administrador']}>
                            <FormularioEmpleado usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />

                      {/* Empleados - Solo Administradores */}
                      <Route
                        path="/empleados"
                        element={
                          <ProtectedRoute allowedRoles={['administrador']}>
                            <Empleados usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />

                      {/* Ruta no encontrada dentro del área protegida */}
                      <Route 
                        path="*" 
                        element={
                          <Navigate 
                            to={usuario.rol === 'administrador' ? '/dashboard' : '/vehiculos'} 
                            replace 
                          />
                        } 
                      />

                      {/* Pruebas de Manejo - Todos */}

                      <Route
                        path="/pruebas-manejo"
                        element={
                          <ProtectedRoute allowedRoles={['administrador', 'empleado']}>
                            <PruebasManejo usuario={usuario} />
                          </ProtectedRoute>
                        }
                      />


                    </Routes>
                  </main>
                </div>
              ) : (
                // Si intenta acceder a ruta protegida sin login, redirige al catálogo público
                <Navigate to="/catalogo" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
