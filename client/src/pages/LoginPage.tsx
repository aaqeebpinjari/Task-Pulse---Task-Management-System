import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


// main login page
const LoginPage = () => {
  const { login, user, authLoading } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });

  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(formData);
    } catch {
      // handled via toast in react itself
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page" style={{ justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card">
          <h2>Sign in</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {authLoading ? 'Signing in…' : 'Login'}
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

