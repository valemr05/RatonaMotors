import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Si no hay usuario logueado, redirigir al catálogo público
  if (!usuario) {
    return <Navigate to="/catalogo" replace />;
  }

  // Si el rol del usuario no está en los roles permitidos
  if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
