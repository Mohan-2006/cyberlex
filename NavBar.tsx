import React from 'react';
import { AppMode } from '../types';

interface NavBarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { label: 'Legal Chat', mode: AppMode.CHAT, icon: '💬' },
    { label: 'Case Advisor', mode: AppMode.ADVISOR, icon: '⚖️' },
    { label: 'Resources', mode: AppMode.RESOURCES, icon: '📚' },
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0 glass-panel border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-accent to-blue-600 flex items-center justify-center text-white font-bold text-lg">
          CL
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">CyberLex</h1>
          <p className="text-xs text-cyber-accent uppercase tracking-widest font-mono">Legal AI</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              currentMode === item.mode
                ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-xs text-slate-500">
          <p className="font-semibold text-slate-400 mb-1">Status: Online</p>
          <p className="font-mono">v2.1.0 • Gemini 2.5 Flash</p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;