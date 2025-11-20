// Import socket.io client and Socket type for TypeScript typing
import { io, Socket } from 'socket.io-client';

// Store a single shared socket instance (singleton pattern)
let socket: Socket | null = null;

// Create or return the existing socket instance with lazy initialization
const getSocket = () =>
  {
  if (!socket) 
    {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      autoConnect: false, // Prevent auto connection until manually triggered
    });
  }
  return socket;
};

// Connect the socket only if it's not connected
export const connectSocket = () =>
  {
  const activeSocket = getSocket();
  if (!activeSocket.connected) {
    activeSocket.connect();
  }
  return activeSocket;
};

// Safely disconnect the socket if it's currently connected
export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

// Export the getter for accessing the shared socket instance
export default getSocket;
