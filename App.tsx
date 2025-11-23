import React, { useState } from 'react';
import NavBar from './components/NavBar';
import ChatInterface from './components/ChatInterface';
import CaseAdvisor from './components/CaseAdvisor';
import Resources from './components/Resources';
import { AppMode } from './types';

const App: React.FC = () => {
  const [currentMode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-cyber-darker text-slate-200 overflow-hidden font-sans">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 md:hidden" onClick={() => setMobileMenuOpen(false)}>
           <div className="w-64 h-full bg-cyber-darker border-r border-slate-800" onClick={e => e.stopPropagation()}>
             <NavBar currentMode={currentMode} setMode={(m) => { setMode(m); setMobileMenuOpen(false); }} />
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <NavBar currentMode={currentMode} setMode={setMode} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[url('https://picsum.photos/1920/1080?blur=10&grayscale')] bg-cover bg-center relative">
        {/* Dark overlay for background image readability */}
        <div className="absolute inset-0 bg-cyber-darker/90 backdrop-blur-sm pointer-events-none"></div>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-cyber-darker/90 backdrop-blur z-10 relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyber-accent to-blue-600 flex items-center justify-center text-white font-bold">CL</div>
            <span className="font-bold text-white">CyberLex</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 relative z-0 overflow-hidden">
          {currentMode === AppMode.CHAT && <ChatInterface />}
          {currentMode === AppMode.ADVISOR && <CaseAdvisor />}
          {currentMode === AppMode.RESOURCES && <Resources />}
        </main>
      </div>
    </div>
  );
};

export default App;