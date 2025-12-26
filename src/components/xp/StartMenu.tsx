import React from 'react';
import { User, FileText, Mail, Settings, HelpCircle, LogOut, Folder, Search, Play, Bomb, Palette, StickyNote, Music } from 'lucide-react';
import { useWindows } from '@/pages/Index';

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { openWindow, playClick } = useWindows();

  const leftItems = [
    { icon: FileText, label: 'My Resume', id: 'resume', component: 'resume' },
    { icon: User, label: 'About Me', id: 'about', component: 'about' },
    { icon: Mail, label: 'Contact', id: 'contact', component: 'contact' },
    { divider: true },
    { icon: Bomb, label: 'Minesweeper', id: 'minesweeper', component: 'minesweeper' },
    { icon: Palette, label: 'Paint', id: 'paint', component: 'paint' },
    { icon: StickyNote, label: 'Notepad', id: 'notepad', component: 'notepad' },
    { icon: Music, label: 'Media Player', id: 'mediaplayer', component: 'mediaplayer' },
  ];

  const rightItems = [
    { icon: Folder, label: 'My Documents' },
    { icon: Folder, label: 'My Pictures' },
    { icon: Music, label: 'My Music' },
    { divider: true },
    { icon: Settings, label: 'Control Panel' },
    { icon: HelpCircle, label: 'Help and Support' },
    { icon: Search, label: 'Search' },
    { icon: Play, label: 'Run...' },
  ];

  const handleItemClick = (item: typeof leftItems[0]) => {
    playClick();
    if ('component' in item && item.component) {
      openWindow(item.id!, item.label, item.component,
        item.id === 'minesweeper' ? 300 : item.id === 'paint' ? 600 : 500,
        item.id === 'minesweeper' ? 380 : item.id === 'paint' ? 450 : 400
      );
      onClose();
    }
  };

  return (
    <div className="xp-start-menu" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="xp-menu-header">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <span className="text-white font-bold text-lg">User</span>
      </div>

      {/* Content */}
      <div className="xp-menu-content">
        {/* Left column - Programs */}
        <div className="xp-menu-left">
          {leftItems.map((item, index) => (
            'divider' in item ? (
              <div key={index} className="h-px bg-gray-300 my-2 mx-3"></div>
            ) : (
              <div 
                key={index} 
                className="xp-menu-item"
                onClick={() => handleItemClick(item)}
              >
                <item.icon className="w-6 h-6 text-blue-600" />
                <span>{item.label}</span>
              </div>
            )
          ))}
        </div>

        {/* Right column - System */}
        <div className="xp-menu-right">
          {rightItems.map((item, index) => (
            'divider' in item ? (
              <div key={index} className="h-px bg-blue-400/30 my-2 mx-3"></div>
            ) : (
              <div key={index} className="xp-menu-item-right" onClick={playClick}>
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-4 p-2 bg-gradient-to-r from-blue-600 to-blue-500">
        <button 
          className="flex items-center gap-2 text-white text-sm hover:bg-blue-700/50 px-3 py-1 rounded"
          onClick={playClick}
        >
          <LogOut className="w-4 h-4" />
          Log Off
        </button>
        <button 
          className="flex items-center gap-2 text-white text-sm hover:bg-blue-700/50 px-3 py-1 rounded"
          onClick={playClick}
        >
          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          Shut Down
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
