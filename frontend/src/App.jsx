import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vehiculos from './pages/Vehiculos';
import VehiculoDetalle from './pages/VehiculoDetalle';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Login from './components/Login';
import FormularioVehiculo from './pages/FormularioVehiculo';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);

  const handleLogin = (userData) => setUsuario(userData);
  const handleLogout = () => setUsuario(null);

  // Si no hay usuario logueado → solo mostrar Login
  if (!usuario) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen">
      <Navbar usuario={usuario} onLogout={handleLogout} />

      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home usuario={usuario} />} />
          <Route path="/vehiculos" element={<Vehiculos usuario={usuario} />} />
          <Route path="/vehiculos/:id" element={<VehiculoDetalle usuario={usuario} />} />
          <Route path="/clientes" element={<Clientes usuario={usuario} />} />
          <Route path="/formulario-vehiculo" element={<FormularioVehiculo usuario={usuario} />} />
          <Route path="/ventas" element={<Ventas usuario={usuario} />} />

          {/* Si no existe la ruta, redirige al home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
