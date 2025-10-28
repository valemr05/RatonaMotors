import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ usuario, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Definir items según el rol del usuario
  const getMenuItems = () => {
    const items = [];

    // Dashboard/Inicio - Solo administradores
    if (usuario?.rol === 'administrador') {
      items.push({ path: '/dashboard', label: 'Dashboard', icon: 'dashboard' });
    }

    // Vehículos - Todos
    items.push({ path: '/vehiculos', label: 'Vehículos', icon: 'directions_car' });

    // Clientes - Todos
    items.push({ path: '/clientes', label: 'Clientes', icon: 'group' });

    // Ventas - Todos
    items.push({ path: '/ventas', label: 'Ventas', icon: 'receipt_long' });

    // Agregar Vehículo - Solo administradores
    if (usuario?.rol === 'administrador') {
      items.push({ path: '/formulario-vehiculo', label: 'Agregar Vehículo', icon: 'add_circle' });
    }

    // Empleados - Solo administradores
    if (usuario?.rol === 'administrador') {
      items.push({ path: '/empleados', label: 'Empleados', icon: 'manage_accounts' });
    }

    // Pruebas de Manejo - Todos
    items.push({ path: '/pruebas-manejo', label: 'Pruebas de Manejo', icon: 'drive_eta' });

    return items;
  };

  const menuItems = getMenuItems();

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
            <div className="navbar-user-info">
              <p className="navbar-user-name">{usuario.nombre} {usuario.apellido}</p>
              <p className="navbar-user-role">{usuario.rol}</p>
            </div>
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
