import React, { useState } from 'react';

export function Settings() {
  const [minRam, setMinRam] = useState(1024);
  const [maxRam, setMaxRam] = useState(2048);
  const [jarName, setJarName] = useState('server.jar');

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <h2 className="text-lg font-bold tracking-tight uppercase text-gray-100">Server Settings</h2>
      
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
        <div>
          <h3 className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">Memory Allocation (RAM)</h3>
          <p className="text-sm text-gray-400 mb-4">Set the minimum and maximum memory for your Minecraft server.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Minimum RAM (MB)</label>
              <input 
                type="number" 
                value={minRam} 
                onChange={e => setMinRam(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Maximum RAM (MB)</label>
              <input 
                type="number" 
                value={maxRam} 
                onChange={e => setMaxRam(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-700" />

        <div>
          <h3 className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">Server Executable</h3>
          <p className="text-sm text-gray-400 mb-4">The jar file used to launch the server.</p>
          
          <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">Jar File Name</label>
             <input 
                type="text" 
                value={jarName} 
                onChange={e => setJarName(e.target.value)}
                className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-accent outline-none mb-3"
              />
             <div className="flex gap-4">
               <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                 Upload Jar
               </button>
               <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
                 Download Paper 1.20.4
               </button>
             </div>
          </div>
        </div>

        <hr className="border-gray-700" />

        <div>
           <button className="px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors">
              Save Settings
           </button>
        </div>
      </div>
    </div>
  );
}
