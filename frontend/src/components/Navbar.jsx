import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ usuario, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio', icon: 'home' },
    { path: '/vehiculos', label: 'Vehículos', icon: 'directions_car' },
    { path: '/clientes', label: 'Clientes', icon: 'group' },
    { path: '/formulario-vehiculo', label: 'Agregar Vehículo', icon: 'add_circle' },
    { path: '/ventas', label: 'Ventas', icon: 'receipt_long' },
  ];

  return (
    <aside className="navbar-sidebar">
      <div className="navbar-content">
        {/* Header con Logo */}
        <div className="navbar-header">
          <div className="navbar-logo-container">
            <div 
              className="navbar-logo" 
              style={{ backgroundImage: 'url("/src/assets/minnieBL.png")' }}
            />
            <div className="navbar-title">
              <h1 className="navbar-brand">RatonaMotors</h1>
              <p className="navbar-subtitle">Panel de Control</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="navbar-menu">
            {menuItems.map((item) => (
              <a
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`navbar-item ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p>{item.label}</p>
              </a>
            ))}
          </nav>
        </div>

        {/* Footer con Usuario */}
        <div className="navbar-footer">
          <div className="navbar-user">
            <span className="material-symbols-outlined">account_circle</span>
            <p>{usuario.nombre} {usuario.apellido}</p>
          </div>
          <div className="navbar-logout" onClick={onLogout}>
            <span className="material-symbols-outlined">logout</span>
            <p>Cerrar Sesión</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
