import React, { useRef, useEffect, useState } from 'react';

export function Console({ logs, onCommand }: { logs: string[], onCommand: (c: string) => void }) {
  const [cmd, setCmd] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cmd.trim()) {
      onCommand(cmd);
      setCmd('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-700 m-6 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
        <span className="font-mono text-sm text-gray-300">server-console ~ /run/server.jar</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>
      </div>
      
      <div className="flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap font-medium">
        {logs.map((log, i) => {
          let colorClass = 'text-gray-300';
          if (log.includes('INFO')) colorClass = 'text-blue-300';
          if (log.includes('WARN')) colorClass = 'text-yellow-300';
          if (log.includes('ERROR')) colorClass = 'text-red-400';
          if (log.startsWith('>')) colorClass = 'text-emerald-400';
          
          return (
            <div key={i} className={`${colorClass} leading-relaxed`}>
              {log}
            </div>
          )
        })}
        {logs.length === 0 && <div className="text-gray-500 italic">Console is empty... Start the server to see logs.</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-gray-800/80 border-t border-gray-700 flex gap-3">
        <span className="text-gray-400 font-mono mt-2 ml-2">{'>'}</span>
        <input 
          type="text" 
          value={cmd}
          onChange={e => setCmd(e.target.value)}
          className="flex-1 bg-transparent outline-none font-mono text-gray-100 placeholder-gray-600"
          placeholder="Enter a command (e.g. /say Hello)"
          autoComplete="off"
        />
        <button type="submit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded font-medium text-sm transition-colors">
          Send
        </button>
      </form>
    </div>
  );
}
