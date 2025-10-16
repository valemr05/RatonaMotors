import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vehiculos from './pages/Vehiculos';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Login from './components/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [usuario, setUsuario] = useState(null);

  const handleLogin = (userData) => {
    setUsuario(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUsuario(null);
    setCurrentPage('home');
  };

  // Si no hay usuario logueado, mostrar login
  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  // Renderizar página según selección
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home usuario={usuario} />;
      case 'vehiculos':
        return <Vehiculos usuario={usuario} />;
      case 'clientes':
        return <Clientes usuario={usuario} />;
      case 'ventas':
        return <Ventas usuario={usuario} />;
      default:
        return <Home usuario={usuario} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        usuario={usuario}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;