function Navbar({ currentPage, setCurrentPage, usuario, onLogout }) {
  const menuItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'vehiculos', label: 'Vehículos', icon: '🚗' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'ventas', label: 'Ventas', icon: '💰' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏁</span>
            <span className="text-xl font-bold">RatonaMotors</span>
          </div>

          {/* Menu Items */}
          <div className="flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-700 font-semibold'
                    : 'hover:bg-blue-500'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-semibold">
                {usuario.nombre} {usuario.apellido}
              </div>
              <div className="text-xs text-blue-200 capitalize">
                {usuario.rol}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;