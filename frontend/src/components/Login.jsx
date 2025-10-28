import { useState } from 'react';
import { login } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      onLogin(response.usuario);
    } catch (err) {
      setError('Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Image */}
      <div className="login-background">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200"
          alt="Car interior background"
        />
        <div className="login-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Header */}
        <div className="login-header flex items-center justify-center gap-2 mb-6">
          <img
            src="/src/assets/minnieBL.png"
            alt="Logo Ratona Motors"
            style={{ width: '50px', height: '46px' }}
            className=" object-contain"
          />
          <h2 className="login-brand text-2xl font-bold text-white tracking-wide">RatonaMotors</h2>
        </div>

        {/* Login Form Card */}
        <div className="login-card">
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Bienvenido! Por favor ingresa tus datos.</p>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                placeholder="Ingresa tu email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Contraseña</label>
              </div>
              <div className="password-input-wrapper">
                <input
                  className="form-input"
                  placeholder="Ingresa tu contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>

          </form>

          {/* Credenciales */}
          <div className="credentials-box">
            <p className="credentials-title">Credenciales de prueba:</p>
            <p className="credentials-text">Admin: admin@ratonamotors.com / admin123</p>
            <p className="credentials-text">Empleado: maria@ratonamotors.com / empleado123</p>
          </div>
        </div>

        
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p className="footer-copyright">© 2024 RatonaMotors. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;