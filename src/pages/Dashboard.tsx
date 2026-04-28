import React from 'react';
import { Activity, Users, HardDrive, Wifi } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-bold tracking-tight uppercase text-gray-100">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users size={20} className="text-blue-400" />} title="Players Online" value="0 / 20" colorClass="bg-blue-500/10" />
        <StatCard icon={<Activity size={20} className="text-emerald-400" />} title="Server TPS" value="20.0" colorClass="bg-emerald-500/10" />
        <StatCard icon={<HardDrive size={20} className="text-purple-400" />} title="Disk Usage" value="2.1 GB" colorClass="bg-purple-500/10" />
        <StatCard icon={<Wifi size={20} className="text-yellow-400" />} title="Network Tx/Rx" value="24 kbps" colorClass="bg-yellow-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 min-h-[300px]">
          <h3 className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span className="font-medium text-sm">Backup World</span>
            </button>
            <button className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span className="font-medium text-sm">Update PaperMC</span>
            </button>
            <button className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span className="font-medium text-sm">Install Plugin</span>
            </button>
            <button className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-2">
              <span className="font-medium text-sm">Share via Playit.gg</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-4">System Information</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
               <span className="text-sm text-gray-400">Java Version</span>
               <span className="text-sm font-medium">Java 21 (Temurin)</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
               <span className="text-sm text-gray-400">OS</span>
               <span className="text-sm font-medium">Linux x64</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
               <span className="text-sm text-gray-400">Panel Version</span>
               <span className="text-sm font-medium">v1.0.0</span>
             </div>
             <div className="flex justify-between items-center py-2">
               <span className="text-sm text-gray-400">Server Type</span>
               <span className="text-sm font-medium">Paper 1.20.4</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, colorClass }: any) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClass || 'bg-gray-900'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{title}</p>
        <p className="text-xl font-mono text-gray-200 mt-1">{value}</p>
      </div>
    </div>
  )
}
