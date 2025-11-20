import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Loader from '../components/common/Loader';
import TaskStats from '../components/tasks/TaskStats';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import TaskCard from '../components/tasks/TaskCard';
import DeleteModal from '../components/tasks/DeleteModal';
import useTasks from '../hooks/useTasks';
import type { Task } from '../types/task';

const DashboardPage = () => {
  const {
    tasks,stats, filters,setFilters, loading,users, createTask, updateTask, deleteTask,selectedTask,selectTask,
  } = useTasks();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete._id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ flex: 1, display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
        <TaskStats stats={stats} />

        <div className="grid grid-2">
          <TaskForm users={users} onSubmit={createTask} submitLabel="Create Task" />
          <div className="grid" style={{ gap: '1rem', alignSelf: 'flex-start' }}>
            <TaskFilters filters={filters} onChange={setFilters} />
            {selectedTask ? (
              <TaskForm users={users} initialData={selectedTask} onSubmit={(payload) => updateTask(selectedTask._id, payload)} submitLabel="Update Task" />
            ) : (
              <div className="card">
                <h3>Need to edit?</h3>
                <p>Select a task From the Below.</p>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <Loader message="Loading tasks..." />
        ) : (
          <div className="grid" style={{ gap: '1rem' }}>
            {tasks.length ? (
              tasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={selectTask} onDelete={setTaskToDelete} />
              ))
            ) : (
              <div className="card">
                <p style={{ margin: 0 }}>No tasks match your filters yet.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {taskToDelete ? (
        <DeleteModal
          title={taskToDelete.title}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </div>
  );
};

export default DashboardPage;

