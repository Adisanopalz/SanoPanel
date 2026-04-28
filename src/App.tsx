import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './pages/Dashboard';
import { Console } from './pages/Console';
import { Settings } from './pages/Settings';
import { useServerAPI } from './hooks/useServerAPI';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { status, logs, startServer, stopServer, sendCommand } = useServerAPI();

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden text-gray-100">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav 
          serverStatus={status} 
          onStart={startServer}
          onStop={stopServer}
          onRestart={async () => {
            await stopServer();
            setTimeout(startServer, 2000);
          }}
        />
        
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'console' && <Console logs={logs} onCommand={sendCommand} />}
          {currentTab === 'settings' && <Settings />}
          {currentTab === 'files' && (
            <div className="p-6">
              <h2 className="text-lg font-bold tracking-tight uppercase text-gray-100 mb-4">File Manager</h2>
              <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
                <p className="text-gray-400">File manager module activated. In a full implementation, you can browse, edit, and zip files here.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
