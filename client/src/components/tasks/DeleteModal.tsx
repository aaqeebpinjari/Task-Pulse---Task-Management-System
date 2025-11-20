// Props for controlling delete confirmation modal behavior
interface DeleteModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Reusable delete confirmation popup
const DeleteModal = ({ title, onConfirm, onCancel }: DeleteModalProps) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}
  >
    <div className="card" style={{ width: 'min(400px, 100%)' }}>
      <h3>Delete Task</h3>
      <p>Are you sure you want to delete “{title}”? This action cannot be undone.</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none', background: '#ef4444', color: '#fff' }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;

