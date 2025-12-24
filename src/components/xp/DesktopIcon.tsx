import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  title: string;
  Icon: LucideIcon;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ title, Icon, onDoubleClick }) => {
  const [selected, setSelected] = useState(false);

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
      <div className="w-10 h-10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-white drop-shadow-lg" />
      </div>
      <span className="leading-tight">{title}</span>
    </div>
  );
};

export default DesktopIcon;
