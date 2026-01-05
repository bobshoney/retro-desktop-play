import React, { useState } from 'react';
import { User, FileText, Mail, Settings, HelpCircle, LogOut, Folder, Search, Play, Bomb, Palette, StickyNote, Music, Globe, Power, Image, ChevronRight } from 'lucide-react';
import { useWindows } from '@/pages/Index';

// Import icons
import resumeIcon from '@/assets/icons/resume-icon.png';
import userIcon from '@/assets/icons/user-icon.png';
import mailIcon from '@/assets/icons/mail-icon.png';
import minesweeperIcon from '@/assets/icons/minesweeper-icon.png';
import paintIcon from '@/assets/icons/paint-icon.png';
import notepadIcon from '@/assets/icons/notepad-icon.png';
import mediaplayerIcon from '@/assets/icons/mediaplayer-icon.png';
import ieIcon from '@/assets/icons/ie-icon.png';
import aolIcon from '@/assets/icons/aol-icon.png';
import napsterIcon from '@/assets/icons/napster-icon.png';
import limewireIcon from '@/assets/icons/limewire-icon.png';

interface StartMenuProps {
  onClose: () => void;
  onLogOff?: () => void;
  onShutDown?: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose, onLogOff, onShutDown }) => {
  const { openWindow } = useWindows();
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  // Frequently used / pinned programs
  const pinnedItems = [
    { icon: Globe, label: 'Internet Explorer', id: 'ie', component: 'ie', iconSrc: ieIcon },
    { icon: Mail, label: 'AOL Instant Messenger', id: 'aol', component: 'aol', iconSrc: aolIcon },
  ];

  // Recent / main programs
  const mainItems = [
    { icon: FileText, label: 'My Resume', id: 'resume', component: 'resume', iconSrc: resumeIcon },
    { icon: User, label: 'About Me', id: 'about', component: 'about', iconSrc: userIcon },
    { icon: Mail, label: 'Contact', id: 'contact', component: 'contact', iconSrc: mailIcon },
    { icon: Music, label: 'Media Player', id: 'mediaplayer', component: 'mediaplayer', iconSrc: mediaplayerIcon },
    { icon: StickyNote, label: 'Notepad', id: 'notepad', component: 'notepad', iconSrc: notepadIcon },
  ];

  // All programs submenu
  const allProgramsItems = [
    { icon: Globe, label: 'Internet Explorer', id: 'ie', component: 'ie', iconSrc: ieIcon },
    { icon: Mail, label: 'AOL 9.0', id: 'aol', component: 'aol', iconSrc: aolIcon },
    { icon: Music, label: 'Napster', id: 'napster', component: 'napster', iconSrc: napsterIcon },
    { icon: Music, label: 'LimeWire', id: 'limewire', component: 'limewire', iconSrc: limewireIcon },
    { divider: true },
    { icon: Bomb, label: 'Minesweeper', id: 'minesweeper', component: 'minesweeper', iconSrc: minesweeperIcon },
    { icon: Palette, label: 'Paint', id: 'paint', component: 'paint', iconSrc: paintIcon },
    { icon: StickyNote, label: 'Notepad', id: 'notepad', component: 'notepad', iconSrc: notepadIcon },
    { icon: Music, label: 'Windows Media Player', id: 'mediaplayer', component: 'mediaplayer', iconSrc: mediaplayerIcon },
  ];

  const rightItems = [
    { icon: Folder, label: 'My Documents', id: 'mydocuments', component: 'mydocuments', bold: true },
    { icon: Image, label: 'My Pictures', id: 'mypictures', component: 'mypictures', bold: true },
    { icon: Music, label: 'My Music', id: 'mymusic', component: 'mymusic', bold: true },
    { divider: true },
    { icon: Settings, label: 'Control Panel', id: 'controlpanel', component: 'controlpanel' },
    { icon: HelpCircle, label: 'Help and Support', id: 'help', component: 'help' },
    { icon: Search, label: 'Search', id: 'search', component: 'search' },
    { icon: Play, label: 'Run...', id: 'run', component: 'run' },
  ];

  const getWindowSize = (id: string): [number, number] => {
    const sizes: Record<string, [number, number]> = {
      minesweeper: [300, 380],
      paint: [600, 450],
      ie: [700, 500],
      aol: [600, 480],
      napster: [550, 420],
      limewire: [580, 450],
      mydocuments: [600, 400],
      mypictures: [600, 400],
      mymusic: [600, 400],
      controlpanel: [650, 450],
      help: [650, 500],
      search: [550, 400],
      run: [400, 200],
    };
    return sizes[id] || [500, 400];
  };

  const handleItemClick = (item: any) => {
    if ('component' in item && item.component) {
      const [width, height] = getWindowSize(item.id);
      openWindow(item.id!, item.label, item.component, item.iconSrc, width, height);
      onClose();
    }
  };

  const handleLogOff = () => {
    onLogOff?.();
    onClose();
  };

  const handleShutDown = () => {
    onShutDown?.();
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
          {/* Pinned items */}
          {pinnedItems.map((item, index) => (
            <div 
              key={`pinned-${index}`} 
              className="xp-menu-item"
              onClick={() => handleItemClick(item)}
            >
              {item.iconSrc ? (
                <img src={item.iconSrc} alt="" className="w-6 h-6" />
              ) : (
                <item.icon className="w-6 h-6 text-blue-600" />
              )}
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}

          <div className="h-px bg-gray-300 my-2 mx-3"></div>

          {/* Main/Recent items */}
          {mainItems.map((item, index) => (
            <div 
              key={`main-${index}`} 
              className="xp-menu-item"
              onClick={() => handleItemClick(item)}
            >
              {item.iconSrc ? (
                <img src={item.iconSrc} alt="" className="w-6 h-6" />
              ) : (
                <item.icon className="w-6 h-6 text-blue-600" />
              )}
              <span>{item.label}</span>
            </div>
          ))}

          <div className="h-px bg-gray-300 my-2 mx-3"></div>

          {/* All Programs */}
          <div className="relative">
            <div 
              className="xp-menu-item justify-between"
              onMouseEnter={() => setShowAllPrograms(true)}
              onMouseLeave={() => setShowAllPrograms(false)}
            >
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-yellow-500" />
                <span className="font-semibold text-green-700">All Programs</span>
              </div>
              <ChevronRight className="w-4 h-4 text-green-700" />
            </div>

            {/* All Programs Submenu */}
            {showAllPrograms && (
              <div 
                className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg rounded-sm min-w-48 py-1 z-50"
                onMouseEnter={() => setShowAllPrograms(true)}
                onMouseLeave={() => setShowAllPrograms(false)}
              >
                {allProgramsItems.map((item, index) => (
                  'divider' in item ? (
                    <div key={index} className="h-px bg-gray-200 my-1 mx-2"></div>
                  ) : (
                    <div 
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer text-sm"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.iconSrc ? (
                        <img src={item.iconSrc} alt="" className="w-4 h-4" />
                      ) : (
                        <item.icon className="w-4 h-4" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column - System */}
        <div className="xp-menu-right">
          {rightItems.map((item, index) => (
            'divider' in item ? (
              <div key={index} className="h-px bg-blue-400/30 my-2 mx-3"></div>
            ) : (
              <div 
                key={index} 
                className="xp-menu-item-right"
                onClick={() => handleItemClick(item)}
              >
                <item.icon className="w-4 h-4" />
                <span className={item.bold ? 'font-bold' : ''}>{item.label}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-4 p-2 bg-gradient-to-r from-blue-600 to-blue-500">
        <button 
          className="flex items-center gap-2 text-white text-sm hover:bg-blue-700/50 px-3 py-1 rounded"
          onClick={handleLogOff}
        >
          <LogOut className="w-4 h-4" />
          Log Off
        </button>
        <button 
          className="flex items-center gap-2 text-white text-sm hover:bg-blue-700/50 px-3 py-1 rounded"
          onClick={handleShutDown}
        >
          <Power className="w-4 h-4 text-red-300" />
          Shut Down
        </button>
      </div>
    </div>
  );
};

export default StartMenu;