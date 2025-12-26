import React, { useState } from 'react';
import { useXPSounds } from '@/hooks/useXPSounds';

interface DesktopIconProps {
  title: string;
  iconSrc: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ title, iconSrc, onDoubleClick }) => {
  const [selected, setSelected] = useState(false);
  const { playClick } = useXPSounds();
  return (
    <div
      className={`xp-desktop-icon ${selected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        playClick();
        setSelected(true);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        playClick();
        onDoubleClick();
      }}
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <img 
          src={iconSrc} 
          alt={title} 
          className="w-10 h-10 object-contain drop-shadow-lg"
          draggable={false}
        />
      </div>
      <span className="leading-tight">{title}</span>
    </div>
  );
};

export default DesktopIcon;
