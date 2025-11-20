import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState, } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { connectSocket, disconnectSocket } from '../api/socket';
import useAuth from '../hooks/useAuth';
import type { PaginationMeta, Task, TaskFilterState, TaskPayload } from '../types/task';

// Typings for task statistics
interface TaskStatsState {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

// Shape of values exposed through TaskContext
interface TaskContextValue {
  tasks: Task[];
  meta: PaginationMeta | null;
  stats: TaskStatsState;
  filters: TaskFilterState;
  loading: boolean;
  users: { _id: string; name: string; email: string }[];
  selectedTask: Task | null;
  setFilters: (filters: TaskFilterState) => void;
  fetchTasks: (page?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  createTask: (payload: TaskPayload) => Promise<void>;
  updateTask: (id: string, payload: TaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  selectTask: (task: Task | null) => void;
}

// Create TaskContext
export const TaskContext = createContext<TaskContextValue | null>(null);

// Default states
const defaultStats: TaskStatsState = { total: 0, completed: 0, pending: 0, inProgress: 0 };
const defaultFilters: TaskFilterState = { status: 'all', priority: 'all', search: '' };

// Provider for all task features
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState(defaultStats);
  const [filters, setFiltersState] = useState<TaskFilterState>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TaskContextValue['users']>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);

  // Reset everything when user logs out
  const resetState = () => {
    setTasks([]);
    setMeta(null);
    setStats(defaultStats);
    setUsers([]);
    setSelectedTask(null);
    setPage(1);
    setFiltersState(defaultFilters);
    setLoading(false);
  };

    // Build query parameters dynamically from filters
  const buildParams = (pageParam: number) => {
    const params: Record<string, string | number> = { page: pageParam, limit: 10 };
    if (filters.status !== 'all') params.status = filters.status;
    if (filters.priority !== 'all') params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    return params;
  };

  // Fetch tasks list from backend
  const fetchTasks = useCallback(
    async (newPage = 1) => {
      if (!token) return;
      setLoading(true);
      try {
        const { data } = await api.get('/tasks', { params: buildParams(newPage) });
        setTasks(data.data);
        setMeta(data.meta);
        setPage(data.meta.page);
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Failed to load tasks';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [filters, token],
  );
  // Fetch overall task stats
  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/tasks/stats');
      setStats(data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to load stats';
      toast.error(message);
    }
  }, [token]);

  // Load all users for task assignment
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to load users';
      toast.error(message);
    }
  }, [token]);

  // Auto-fetch tasks & stats whenever token or page changes
  useEffect(() => {
    if (!token) {
      resetState();
      disconnectSocket();
      return;
    }
    fetchTasks(page);
    fetchStats();
  }, [token, fetchTasks, fetchStats, page]);

    // Fetch users once token exists
  useEffect(() => {
    if (!token) return;
    fetchUsers();
  }, [token, fetchUsers]);

  // Setup real-time socket listeners for task updates
  useEffect(() => {
    if (!token) return;
    const socket = connectSocket();
    const handleUpdate = () => {
      fetchTasks(page);
      fetchStats();
    };
    socket.on('tasks:update', handleUpdate);
    return () => {
      socket.off('tasks:update', handleUpdate);
    };
  }, [token, fetchTasks, fetchStats, page]);

    // Create a new task
  const createTask = async (payload: TaskPayload) => {
    try {
      await api.post('/tasks', payload);
      toast.success('Task created');
      await fetchTasks(page);
      await fetchStats();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to create task';
      toast.error(message);
      throw error;
    }
  };
  // Update an existing task
  const updateTask = async (id: string, payload: TaskPayload) => {
    try {
      await api.put(`/tasks/${id}`, payload);
      toast.success('Task updated');
      setSelectedTask(null);
      await fetchTasks(page);
      await fetchStats();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to update task';
      toast.error(message);
      throw error;
    }
  };
  // delete task by id
  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      setSelectedTask((current) => (current && current._id === id ? null : current));
      await fetchTasks(page);
      await fetchStats();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      throw error;
    }
  };

  // Update filter state and reset pagination
  const handleSetFilters = useCallback((nextFilters: TaskFilterState) => {
    setFiltersState(nextFilters);
    setPage(1);
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const value = useMemo<TaskContextValue>(
    () => ({ tasks, meta,stats, filters, loading, users, selectedTask, setFilters: handleSetFilters, 
      fetchTasks,fetchStats, createTask,updateTask,deleteTask, selectTask: setSelectedTask,}),
    [ tasks, meta, stats, filters, loading,users, selectedTask, fetchTasks, fetchStats,handleSetFilters,],
  );
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

