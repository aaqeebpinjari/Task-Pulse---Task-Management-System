import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { Task, TaskPayload } from '../../types/task';

// Props include submit handler, user list, and optional initial task
interface TaskFormProps
{
  onSubmit: (payload: TaskPayload) => Promise<void>;
  users: { _id: string; name: string; email: string }[];
  initialData?: Task | null;
  submitLabel?: string;
}

// Shape of the form's 
type FormState =
{
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  dueDate: string;
  tags: string;
  assignedTo: string;
};

// empty values for this
const createEmptyFormState = (): FormState => ({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  tags: '',
  assignedTo: '',
});

// Task creation/edit form component
const TaskForm = ({ onSubmit, users, initialData, submitLabel = 'Create Task' }: TaskFormProps) => {
  const [formState, setFormState] = useState<FormState>(createEmptyFormState());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormState({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        priority: initialData.priority,
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        tags: initialData.tags?.join(', ') || '',
        assignedTo: initialData.assignedTo?._id || '',
      });
    } else {
      setFormState(createEmptyFormState());
    }
  }, [initialData]);

  
// Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const payload: TaskPayload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      status: formState.status as Task['status'],
      priority: formState.priority as Task['priority'],
      dueDate: formState.dueDate || undefined,
      tags: formState.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      assignedTo: formState.assignedTo || null,
    };

    try {
      await onSubmit(payload);
      if (!initialData) {
        setFormState(createEmptyFormState());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

// Update form values on input
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <label htmlFor="title">Task Addition Form</label>
        <input
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          required
          placeholder="Provide task details"
        />
      </div>
      <div className="grid grid-2">
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formState.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formState.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-2">
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input id="dueDate" type="date" name="dueDate" value={formState.dueDate} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="assignedTo">Assign To</label>
          <select id="assignedTo" name="assignedTo" value={formState.assignedTo} onChange={handleChange}>
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          id="tags"
          name="tags"
          value={formState.tags}
          onChange={handleChange}
          placeholder="design, ui, bug"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        style=
        {{
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default TaskForm;

