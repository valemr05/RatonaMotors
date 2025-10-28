import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <span className="material-symbols-outlined error-icon">block</span>
        <h1>Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <button onClick={() => navigate(-1)} className="btn-back">
          Volver
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
