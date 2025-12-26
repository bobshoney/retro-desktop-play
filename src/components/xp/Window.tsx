import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { useWindows } from '@/pages/Index';
import ResumeApp from './apps/ResumeApp';
import AboutApp from './apps/AboutApp';
import ContactApp from './apps/ContactApp';
import MinesweeperApp from './apps/MinesweeperApp';
import PaintApp from './apps/PaintApp';
import NotepadApp from './apps/NotepadApp';
import MediaPlayerApp from './apps/MediaPlayerApp';
import NapsterApp from './apps/NapsterApp';
import LimeWireApp from './apps/LimeWireApp';
import AOLApp from './apps/AOLApp';
import InternetExplorerApp from './apps/InternetExplorerApp';

interface WindowProps {
  window: {
    id: string;
    title: string;
    component: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isMinimized: boolean;
    zIndex: number;
  };
}

const Window: React.FC<WindowProps> = ({ window: win }) => {
  const { closeWindow, focusWindow, minimizeWindow, updateWindowPosition, activeWindowId, playClick } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === win.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-buttons')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
    focusWindow(win.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - win.width));
      const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - win.height - 32));
      updateWindowPosition(win.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, win.id, win.width, win.height, updateWindowPosition]);

  const renderContent = () => {
    switch (win.component) {
      case 'resume': return <ResumeApp />;
      case 'about': return <AboutApp />;
      case 'contact': return <ContactApp />;
      case 'minesweeper': return <MinesweeperApp />;
      case 'paint': return <PaintApp />;
      case 'notepad': return <NotepadApp />;
      case 'mediaplayer': return <MediaPlayerApp />;
      case 'napster': return <NapsterApp />;
      case 'limewire': return <LimeWireApp />;
      case 'aol': return <AOLApp />;
      case 'ie': return <InternetExplorerApp />;
      default: return <div className="p-4">Unknown application</div>;
    }
  };

  if (win.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className="xp-window absolute"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onClick={() => focusWindow(win.id)}
    >
      {/* Title Bar */}
      <div 
        className={`xp-title-bar ${!isActive ? 'inactive' : ''}`}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <span className="truncate">{win.title}</span>
        <div className="window-buttons flex items-center gap-0.5">
          <button 
            className="xp-window-button"
            onClick={(e) => { e.stopPropagation(); playClick(); minimizeWindow(win.id); }}
          >
            <Minus className="w-3 h-3" />
          </button>
          <button className="xp-window-button" onClick={playClick}>
            <Square className="w-2.5 h-2.5" />
          </button>
          <button 
            className="xp-window-button close"
            onClick={(e) => { e.stopPropagation(); playClick(); closeWindow(win.id); }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="xp-window-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Window;
