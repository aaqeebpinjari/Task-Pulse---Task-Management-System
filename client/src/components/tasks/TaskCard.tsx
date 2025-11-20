import type { CSSProperties } from 'react';
import type { Task } from '../../types/task';

// Expected props: task + edit and delete handlers
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// Color-coded style
const chipStyles: Record<string, CSSProperties> = {
  pending: { background: '#fef3c7', color: '#92400e' },
  'in-progress': { background: '#dbeafe', color: '#1d4ed8' },
  completed: { background: '#dcfce7', color: '#166534' },
  low: { background: '#e0f2fe', color: '#0369a1' },
  medium: { background: '#ede9fe', color: '#5b21b6' },
  high: { background: '#fee2e2', color: '#b91c1c' },
};

// Card showing task details + action buttons
const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
      <div>
        <h3 style={{ margin: 0 }}>{task.title}</h3>
        <p style={{ margin: '0.25rem 0', color: '#475569' }}>{task.description}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <span style={{ ...chipStyles[task.status], padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>
          {task.status.replace('-', ' ')}
        </span>
        <span style={{ ...chipStyles[task.priority], padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>
          {task.priority}
        </span>
      </div>
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.9rem', color: '#0f172a' }}>
      {task.dueDate && (
        <span style={{ fontWeight: 600 }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      <span>Owner: {task.createdBy.name}</span>
      {task.assignedTo && <span>Assigned: {task.assignedTo.name}</span>}
    </div>

    {task.tags?.length ? (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {task.tags.map((tag) => (
          <span key={tag} style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>
            #{tag}
          </span>
        ))}
      </div>
    ) : null}

    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
      <button
        type="button"
        onClick={() => onEdit(task)}
        style={{ borderRadius: '0.75rem', border: '1px solid #cbd5f5', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(task)}
        style={{ borderRadius: '0.75rem', border: 'none', padding: '0.5rem 1rem', background: '#f43f5e', color: '#fff', cursor: 'pointer' }}
      >
        Delete
      </button>
    </div>
  </div>
);

export default TaskCard;

