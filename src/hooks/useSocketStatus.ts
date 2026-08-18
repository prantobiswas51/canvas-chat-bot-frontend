import { useEffect, useState } from 'react';
import { getSocket } from '@/services/socket';

export type SocketStatus = 'connected' | 'connecting' | 'disconnected';

// Tracks the shared socket singleton's live state so any component can show
// whether real-time updates (new messages, conversation changes) are
// actually flowing right now, instead of silently going stale until the
// user manually refreshes.
export function useSocketStatus(): SocketStatus {
  const [status, setStatus] = useState<SocketStatus>('connecting');

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setStatus('connected');
    const handleDisconnect = () => setStatus('disconnected');
    const handleReconnectAttempt = () => setStatus('connecting');

    setStatus(socket.connected ? 'connected' : 'connecting');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleDisconnect);
    // Reconnection lifecycle events live on the underlying Manager
    // (socket.io), not the Socket instance itself, in socket.io-client v4.
    socket.io.on('reconnect_attempt', handleReconnectAttempt);
    socket.io.on('reconnect', handleConnect);
    socket.io.on('reconnect_failed', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleDisconnect);
      socket.io.off('reconnect_attempt', handleReconnectAttempt);
      socket.io.off('reconnect', handleConnect);
      socket.io.off('reconnect_failed', handleDisconnect);
    };
  }, []);

  return status;
}

export default useSocketStatus;
