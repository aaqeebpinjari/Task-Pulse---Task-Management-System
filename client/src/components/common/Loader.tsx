// Props for customizing loader message and optional full-height display
interface LoaderProps {
  message?: string;
  fullHeight?: boolean;
}


// Reusable Loader component with optional message and height control
const Loader = ({ message = 'Loading...', fullHeight = false }: LoaderProps) => (
  <div
    style={{
      minHeight: fullHeight ? '50vh' : undefined,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}
  >
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="spinner" />
      <p>{message}</p>
    </div>
  </div>
);

export default Loader;

