import React from 'react';
import { LayoutDashboard, Terminal, FolderOpen, Settings, Play, Square, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (t: string) => void }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'console', label: 'Console', icon: <Terminal size={20} /> },
    { id: 'files', label: 'File Manager', icon: <FolderOpen size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-white font-bold">
          <Layers size={18} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Sanopalz</h1>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-lg" />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10 font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-900/50 p-4 rounded-xl shadow-inner text-sm">
          <p className="text-gray-400">Version 1.0.0</p>
          <p className="text-gray-500 text-xs mt-1">Sanopalz Server Panel</p>
        </div>
      </div>
    </div>
  );
}
