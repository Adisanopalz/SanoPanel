import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useServerAPI(serverId: string = 'server-1') {
  const [status, setStatus] = useState<string>('offline');
  const [logs, setLogs] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Determine the base URL. In development with Vite proxy, it goes to the same origin normally,
    // but we use an absolute URL if needed.
    const url = window.location.origin;
    const s = io(url);
    setSocket(s);

    s.on('serverStatus', (data: { id: string, status: string }) => {
      if (data.id === serverId) {
        setStatus(data.status);
      }
    });

    s.on('console', (data: { id: string, data: string }) => {
      if (data.id === serverId) {
        setLogs(prev => {
          const newLogs = [...prev, data.data];
          if (newLogs.length > 500) return newLogs.slice(newLogs.length - 500); // keep last 500 lines
          return newLogs;
        });
      }
    });

    // Initial fetch
    fetch('/api/servers')
      .then(res => res.json())
      .then(data => {
        const server = data.find((s: any) => s.id === serverId);
        if (server) setStatus(server.status);
      });

    return () => {
      s.disconnect();
    };
  }, [serverId]);

  const startServer = useCallback(async () => {
    await fetch(`/api/servers/${serverId}/start`, { method: 'POST' });
  }, [serverId]);

  const stopServer = useCallback(async () => {
    await fetch(`/api/servers/${serverId}/stop`, { method: 'POST' });
  }, [serverId]);

  const sendCommand = useCallback(async (command: string) => {
    await fetch(`/api/servers/${serverId}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
  }, [serverId]);

  return {
    status,
    logs,
    startServer,
    stopServer,
    sendCommand
  };
}
