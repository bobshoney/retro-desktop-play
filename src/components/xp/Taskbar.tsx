import React, { useState, useEffect } from 'react';
import { Volume2, Wifi } from 'lucide-react';
import { useWindows } from '@/pages/Index';

interface TaskbarProps {
  startMenuOpen: boolean;
  onStartClick: (e: React.MouseEvent) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ startMenuOpen, onStartClick }) => {
  const [time, setTime] = useState(new Date());
  const { windows, focusWindow, minimizeWindow, activeWindowId, playClick } = useWindows();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleWindowClick = (windowId: string, isMinimized: boolean) => {
    playClick();
    if (isMinimized) {
      focusWindow(windowId);
    } else if (activeWindowId === windowId) {
      minimizeWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };

  return (
    <div className="xp-taskbar">
      {/* Start Button */}
      <button 
        className={`xp-start-button ${startMenuOpen ? 'active' : ''}`}
        onClick={(e) => {
          playClick();
          onStartClick(e);
        }}
      >
        <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
          <div className="w-1.5 h-1.5 bg-[#f65314] rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-[#7cbb00] rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-[#00a1f1] rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-[#ffbb00] rounded-sm"></div>
        </div>
        <span>start</span>
      </button>

      {/* Quick Launch Separator */}
      <div className="w-px h-5 bg-blue-400/50 mx-2"></div>

      {/* Open Windows */}
      <div className="flex-1 flex items-center gap-1 overflow-hidden px-1">
        {windows.map((window) => {
          const isActive = activeWindowId === window.id && !window.isMinimized;
          return (
            <button
              key={window.id}
              onClick={() => handleWindowClick(window.id, window.isMinimized)}
              className={`h-7 px-2 text-xs text-white truncate max-w-44 rounded-sm border transition-all flex items-center gap-1.5
                ${isActive 
                  ? 'border-blue-300/50 shadow-inner' 
                  : 'border-transparent hover:border-blue-400/30'
                }`}
              style={{
                background: isActive
                  ? 'linear-gradient(180deg, #1e4a8a 0%, #0d3a6e 50%, #0a2d52 100%)'
                  : window.isMinimized 
                    ? 'linear-gradient(180deg, #4a7fc5 0%, #3b6eb5 100%)'
                    : 'linear-gradient(180deg, #3b7dd8 0%, #2a6bc8 50%, #1e5ab8 100%)'
              }}
            >
              {window.iconSrc && (
                <img src={window.iconSrc} alt="" className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="truncate">{window.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div 
        className="flex items-center gap-2 px-2 h-full"
        style={{
          background: 'linear-gradient(180deg, #0f4c9c 0%, #1565c0 50%, #0d47a1 100%)'
        }}
      >
        <Volume2 className="w-4 h-4 text-white/80" />
        <Wifi className="w-4 h-4 text-white/80" />
        <div className="text-white text-xs font-medium pl-2">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
