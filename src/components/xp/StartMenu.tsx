import { useState, forwardRef } from 'react';
import { User, FileText, Mail, Settings, HelpCircle, LogOut, Folder, Search, Play, Bomb, Palette, StickyNote, Music, Globe, Power, Image, ChevronRight, Headphones, Download, Terminal, Monitor, Calculator, MessageCircle, Gamepad2, Spade } from 'lucide-react';
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
import kazaaIcon from '@/assets/icons/kazaa-icon.png';
import winampIcon from '@/assets/icons/winamp-icon.png';

interface StartMenuProps {
  onClose: () => void;
  onLogOff?: () => void;
  onShutDown?: () => void;
}

const StartMenu = forwardRef<HTMLDivElement, StartMenuProps>(({ onClose, onLogOff, onShutDown }, ref) => {
  const { openWindow } = useWindows();
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  // Pinned programs - top of left column
  const pinnedItems = [
    { label: 'Internet Explorer', id: 'ie', component: 'ie', iconSrc: ieIcon, bold: true },
    { label: 'AOL Instant Messenger', id: 'aol', component: 'aol', iconSrc: aolIcon, bold: true },
    { label: 'Winamp', id: 'winamp', component: 'winamp', iconSrc: winampIcon, bold: true },
  ];

  // Recent / frequently used
  const recentItems = [
    { label: 'My Resume', id: 'resume', component: 'resume', iconSrc: resumeIcon },
    { label: 'About Me', id: 'about', component: 'about', iconSrc: userIcon },
    { label: 'Contact', id: 'contact', component: 'contact', iconSrc: mailIcon },
    { label: 'Notepad', id: 'notepad', component: 'notepad', iconSrc: notepadIcon },
    { label: 'Paint', id: 'paint', component: 'paint', iconSrc: paintIcon },
  ];

  // All Programs submenu
  const allProgramsItems = [
    { category: 'Internet & Communication' },
    { label: 'Internet Explorer', id: 'ie', component: 'ie', iconSrc: ieIcon },
    { label: 'AOL 9.0', id: 'aol', component: 'aol', iconSrc: aolIcon },
    { label: 'MSN Messenger', id: 'msn', component: 'msn', iconType: 'msn' },
    { divider: true },
    { category: 'P2P & Music' },
    { label: 'Napster', id: 'napster', component: 'napster', iconSrc: napsterIcon },
    { label: 'LimeWire', id: 'limewire', component: 'limewire', iconSrc: limewireIcon },
    { label: 'Kazaa', id: 'kazaa', component: 'kazaa', iconSrc: kazaaIcon },
    { label: 'Winamp', id: 'winamp', component: 'winamp', iconSrc: winampIcon },
    { label: 'Windows Media Player', id: 'mediaplayer', component: 'mediaplayer', iconSrc: mediaplayerIcon },
    { divider: true },
    { category: 'Games' },
    { label: 'Minesweeper', id: 'minesweeper', component: 'minesweeper', iconSrc: minesweeperIcon },
    { label: 'Solitaire', id: 'solitaire', component: 'solitaire', iconType: 'solitaire' },
    { label: '3D Pinball', id: 'pinball', component: 'pinball', iconType: 'pinball' },
    { divider: true },
    { category: 'Accessories' },
    { label: 'Paint', id: 'paint', component: 'paint', iconSrc: paintIcon },
    { label: 'Notepad', id: 'notepad', component: 'notepad', iconSrc: notepadIcon },
    { label: 'Calculator', id: 'calc', component: 'calc', iconType: 'calc' },
    { label: 'Command Prompt', id: 'cmd', component: 'cmd', iconType: 'cmd' },
    { divider: true },
    { category: 'System' },
    { label: 'My Computer', id: 'mycomputer', component: 'mycomputer', iconType: 'mycomputer' },
    { label: 'System Properties', id: 'sysprops', component: 'sysprops', iconType: 'sysprops' },
    { label: 'Security Checklist', id: 'securitychecklist', component: 'securitychecklist', iconType: 'security' },
  ];

  const rightItems = [
    { icon: Monitor, label: 'My Computer', id: 'mycomputer', component: 'mycomputer', bold: true },
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
      kazaa: [560, 440],
      winamp: [300, 400],
      mydocuments: [600, 400],
      mypictures: [600, 400],
      mymusic: [600, 400],
      controlpanel: [650, 450],
      help: [650, 500],
      search: [550, 400],
      run: [400, 200],
      cmd: [650, 420],
      msn: [350, 500],
      pinball: [520, 680],
      solitaire: [620, 480],
      calc: [260, 320],
      mycomputer: [600, 450],
      sysprops: [400, 450],
      securitychecklist: [480, 520],
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

  const renderSubmenuIcon = (item: any) => {
    if (item.iconSrc) {
      return <img src={item.iconSrc} alt="" className="w-5 h-5" />;
    }
    switch (item.iconType) {
      case 'msn': return <div className="w-5 h-5 bg-gradient-to-br from-[#4b9cd3] to-[#1a5276] rounded flex items-center justify-center"><MessageCircle className="w-3 h-3 text-white" /></div>;
      case 'solitaire': return <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-800 rounded flex items-center justify-center"><Spade className="w-3 h-3 text-white" /></div>;
      case 'pinball': return <div className="w-5 h-5 bg-gradient-to-br from-purple-600 to-blue-800 rounded flex items-center justify-center"><Gamepad2 className="w-3 h-3 text-white" /></div>;
      case 'calc': return <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center"><Calculator className="w-3 h-3 text-white" /></div>;
      case 'cmd': return <div className="w-5 h-5 bg-black rounded flex items-center justify-center"><Terminal className="w-3 h-3 text-gray-300" /></div>;
      case 'mycomputer': return <div className="w-5 h-5 bg-gradient-to-br from-gray-100 to-gray-300 rounded flex items-center justify-center border border-gray-400"><Monitor className="w-3 h-3 text-gray-700" /></div>;
      case 'sysprops': return <Settings className="w-5 h-5 text-gray-600" />;
      case 'security': return <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded flex items-center justify-center"><Settings className="w-3 h-3 text-white" /></div>;
      default: return <Folder className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div ref={ref} className="xp-start-menu" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="xp-menu-header">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg border-2 border-white/20">
          <User className="w-8 h-8 text-white" />
        </div>
        <span className="text-white font-bold text-lg drop-shadow-md">User</span>
      </div>

      {/* Content */}
      <div className="xp-menu-content">
        {/* Left column - Programs */}
        <div className="xp-menu-left">
          {/* Pinned items with larger icons */}
          {pinnedItems.map((item, index) => (
            <div 
              key={`pinned-${index}`} 
              className="xp-menu-item"
              onClick={() => handleItemClick(item)}
            >
              <img src={item.iconSrc} alt="" className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            </div>
          ))}

          <div className="h-px bg-gray-300 my-1 mx-3"></div>

          {/* Recent items */}
          {recentItems.map((item, index) => (
            <div 
              key={`recent-${index}`} 
              className="xp-menu-item"
              onClick={() => handleItemClick(item)}
            >
              <img src={item.iconSrc} alt="" className="w-6 h-6" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}

          <div className="h-px bg-gray-300 my-1 mx-3"></div>

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
                className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg rounded-sm min-w-56 py-1 z-50 max-h-96 overflow-y-auto"
                onMouseEnter={() => setShowAllPrograms(true)}
                onMouseLeave={() => setShowAllPrograms(false)}
              >
                {allProgramsItems.map((item, index) => (
                  'divider' in item ? (
                    <div key={index} className="h-px bg-gray-200 my-1 mx-2"></div>
                  ) : 'category' in item ? (
                    <div key={index} className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                      {item.category}
                    </div>
                  ) : (
                    <div 
                      key={index}
                      className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer text-sm group"
                      onClick={() => handleItemClick(item)}
                    >
                      {renderSubmenuIcon(item)}
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
                <item.icon className="w-5 h-5" />
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
});

StartMenu.displayName = 'StartMenu';

export default StartMenu;
