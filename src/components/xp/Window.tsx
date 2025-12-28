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
    isMaximized: boolean;
    zIndex: number;
    prevBounds?: { x: number; y: number; width: number; height: number };
  };
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

const Window: React.FC<WindowProps> = ({ window: win }) => {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, updateWindowPosition, updateWindowSize, activeWindowId, playClick } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, winX: 0, winY: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === win.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-buttons')) return;
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
    focusWindow(win.id);
  };

  const handleResizeStart = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: win.width,
      height: win.height,
      winX: win.x,
      winY: win.y
    });
    focusWindow(win.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - win.width));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - win.height - 32));
        updateWindowPosition(win.id, newX, newY);
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.winX;
        let newY = resizeStart.winY;

        // Handle horizontal resize
        if (isResizing.includes('e')) {
          newWidth = Math.max(200, resizeStart.width + deltaX);
        }
        if (isResizing.includes('w')) {
          const potentialWidth = resizeStart.width - deltaX;
          if (potentialWidth >= 200) {
            newWidth = potentialWidth;
            newX = resizeStart.winX + deltaX;
          }
        }

        // Handle vertical resize
        if (isResizing.includes('s')) {
          newHeight = Math.max(150, resizeStart.height + deltaY);
        }
        if (isResizing.includes('n')) {
          const potentialHeight = resizeStart.height - deltaY;
          if (potentialHeight >= 150) {
            newHeight = potentialHeight;
            newY = resizeStart.winY + deltaY;
          }
        }

        updateWindowSize(win.id, newWidth, newHeight);
        if (newX !== resizeStart.winX || newY !== resizeStart.winY) {
          updateWindowPosition(win.id, newX, newY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, win.id, win.width, win.height, updateWindowPosition, updateWindowSize]);

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

  const windowStyle = win.isMaximized 
    ? { left: 0, top: 0, width: '100%', height: 'calc(100vh - 32px)', zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      ref={windowRef}
      className="xp-window absolute"
      style={windowStyle}
      onClick={() => focusWindow(win.id)}
    >
      {/* Resize Handles */}
      <div 
        className="resize-handle absolute top-0 left-0 right-0 h-1 cursor-n-resize" 
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div 
        className="resize-handle absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" 
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      <div 
        className="resize-handle absolute top-0 bottom-0 left-0 w-1 cursor-w-resize" 
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      <div 
        className="resize-handle absolute top-0 bottom-0 right-0 w-1 cursor-e-resize" 
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      <div 
        className="resize-handle absolute top-0 left-0 w-3 h-3 cursor-nw-resize" 
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div 
        className="resize-handle absolute top-0 right-0 w-3 h-3 cursor-ne-resize" 
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div 
        className="resize-handle absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" 
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div 
        className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" 
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />

      {/* Title Bar */}
      <div 
        className={`xp-title-bar ${!isActive ? 'inactive' : ''}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => { playClick(); toggleMaximize(win.id); }}
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
          <button 
            className="xp-window-button" 
            onClick={(e) => { e.stopPropagation(); playClick(); toggleMaximize(win.id); }}
          >
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
