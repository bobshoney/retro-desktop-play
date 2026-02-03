import React, { useState, useRef, useCallback } from 'react';
import { Terminal, MessageCircle, Gamepad2, Trash2 } from 'lucide-react';

interface DesktopIconProps {
  title: string;
  iconSrc: string;
  onDoubleClick: () => void;
  onDragEnd?: (x: number, y: number) => void;
  position?: { x: number; y: number };
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  title, 
  iconSrc, 
  onDoubleClick,
  onDragEnd,
  position 
}) => {
  const [selected, setSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    
    const rect = iconRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setCurrentPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    setHasDragged(false);
    setSelected(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Check if we've moved enough to consider it a drag (5px threshold)
    const dx = Math.abs(e.clientX - dragStartPos.current.x);
    const dy = Math.abs(e.clientY - dragStartPos.current.y);
    if (dx > 5 || dy > 5) {
      setHasDragged(true);
    }
    
    setCurrentPos({ x: e.clientX, y: e.clientY });
  }, [isDragging]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Only call onDragEnd if we actually dragged
    if (hasDragged && onDragEnd) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onDragEnd(newX, newY);
    }
  }, [isDragging, hasDragged, dragOffset, onDragEnd]);

  // Attach global mouse listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Only trigger if we haven't dragged
    if (!hasDragged) {
      onDoubleClick();
    }
  }, [hasDragged, onDoubleClick]);

  const renderIcon = () => {
    if (iconSrc === 'cmd') {
      return (
        <div className="w-10 h-10 bg-black rounded flex items-center justify-center border border-gray-600">
          <Terminal className="w-6 h-6 text-gray-300" />
        </div>
      );
    }
    if (iconSrc === 'msn') {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-[#4b9cd3] to-[#1a5276] rounded flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      );
    }
    if (iconSrc === 'pinball') {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-800 rounded flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
      );
    }
    if (iconSrc === 'recyclebin') {
      return (
        <Trash2 className="w-10 h-10 text-gray-600 drop-shadow-lg" />
      );
    }
    
    return (
      <img 
        src={iconSrc} 
        alt={title} 
        className="w-10 h-10 object-contain drop-shadow-lg"
        draggable={false}
      />
    );
  };

  // Calculate drag position - only show dragging style if we've actually moved
  const style: React.CSSProperties = (isDragging && hasDragged)
    ? {
        position: 'fixed',
        left: currentPos.x - dragOffset.x,
        top: currentPos.y - dragOffset.y,
        zIndex: 9999,
        opacity: 0.8,
        pointerEvents: 'none',
      }
    : {};

  return (
    <div
      ref={iconRef}
      className={`xp-desktop-icon ${selected ? 'selected' : ''} ${isDragging && hasDragged ? 'cursor-grabbing' : 'cursor-pointer'}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(true);
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        {renderIcon()}
      </div>
      <span className="leading-tight">{title}</span>
    </div>
  );
};

export default DesktopIcon;
