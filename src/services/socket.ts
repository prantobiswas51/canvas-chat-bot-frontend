import { io, Socket } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3234/api';
// The WebSocket gateway isn't mounted under the REST '/api' prefix — strip it
// to get the raw server origin the socket should connect to.
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

let socket: Socket | null = null;

// Singleton — one connection shared across the app, opened lazily on first use.
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
