import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

// Custom hook to access authentication state and actions from AuthContext.
const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export default useTasks;

