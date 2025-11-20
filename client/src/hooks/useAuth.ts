import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to access task-related state and actions from TaskContext.
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default useAuth;

