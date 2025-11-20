// Import custom authentication hook to access user info and logout function
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        background: '#0f172a',
        color: '#fff',
        padding: '1rem 0',
        boxShadow: '0 4px 10px rgba(15, 23, 42, 0.3)',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Task Pulse</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{user?.name}</p>
            <small style={{ color: '#cbd5f5' }}>{user?.email}</small>
          </div>
          <button
            type="button"
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: 'none',
              background: '#f43f5e',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

