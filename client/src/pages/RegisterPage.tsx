import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

//handling new users.
const RegisterPage = () => {
  const { register, user, authLoading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await register(formData);
    } catch {
      // handled via toast
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
          <h2>Create an account</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Andy chart" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="andy@example.com"
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
                minLength={5}
                placeholder="Min. 5 characters"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: '#10b981',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {authLoading ? 'Creating...' : 'Register'}
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

