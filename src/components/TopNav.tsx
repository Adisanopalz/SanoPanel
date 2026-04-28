import React, { useEffect, useState } from 'react';
import { Cpu, MemoryStick, Play, Square, RefreshCcw } from 'lucide-react';
import { useServerAPI } from '../hooks/useServerAPI';

export function TopNav({ serverStatus, onStart, onStop, onRestart }: any) {
  const [stats, setStats] = useState({ cpu: 0, memUsed: 0, memTotal: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/system');
        const data = await res.json();
        setStats(data);
      } catch (e) {}
    };
    fetchStats();
    const int = setInterval(fetchStats, 3000);
    return () => clearInterval(int);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'starting': return 'bg-yellow-500 animate-pulse';
      case 'stopping': return 'bg-orange-500 animate-pulse';
      default: return 'bg-red-500';
    }
  };

  const memPercent = stats.memTotal ? Math.round((stats.memUsed / stats.memTotal) * 100) : 0;

  return (
    <div className="h-16 border-b border-gray-700 bg-gray-900/80 backdrop-blur flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-700">
          <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(serverStatus)}`} />
          <span className="text-sm font-medium capitalize">{serverStatus || 'Offline'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Cpu size={16} />
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${Math.round(stats.cpu)}%` }} />
            </div>
            <span>{Math.round(stats.cpu)}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MemoryStick size={16} />
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${memPercent}%` }} />
            </div>
            <span>{memPercent}%</span>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-700"></div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onStart}
            disabled={serverStatus !== 'offline'}
            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={18} />
          </button>
          <button 
            onClick={onRestart}
            disabled={serverStatus === 'offline'}
            className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCcw size={18} />
          </button>
          <button 
            onClick={onStop}
            disabled={serverStatus === 'offline'}
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Square size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
