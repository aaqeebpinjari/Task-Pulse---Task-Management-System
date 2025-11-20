import type { ChangeEvent } from 'react';
import type { TaskFilterState } from '../../types/task';

// Props: current filter values + update handler
interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (nextFilters: TaskFilterState) => void;
}

// Search + dropdown filters component
const TaskFilters = ({ filters, onChange }: TaskFiltersProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <div>
        <label htmlFor="search">Search Bar</label>
        <input
          id="search"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by title or description"
        />
      </div>
      <div className="grid grid-2">
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={filters.status} onChange={handleChange}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={filters.priority} onChange={handleChange}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;

