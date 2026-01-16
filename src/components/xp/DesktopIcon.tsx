import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

interface DesktopIconProps {
  title: string;
  iconSrc: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ title, iconSrc, onDoubleClick }) => {
  const [selected, setSelected] = useState(false);

  const renderIcon = () => {
    if (iconSrc === 'cmd') {
      return (
        <div className="w-10 h-10 bg-black rounded flex items-center justify-center border border-gray-600">
          <Terminal className="w-6 h-6 text-gray-300" />
        </div>
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

  return (
    <div
      className={`xp-desktop-icon ${selected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(true);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
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
