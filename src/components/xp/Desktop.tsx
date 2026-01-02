import React, { useState } from 'react';
import blissWallpaper from '@/assets/bliss-wallpaper.jpg';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import { useWindows } from '@/pages/Index';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { RefreshCw, FolderPlus, Settings, Monitor, ArrowUpDown, LayoutGrid, List, Trash2 } from 'lucide-react';

// Import icons
import resumeIcon from '@/assets/icons/resume-icon.png';
import userIcon from '@/assets/icons/user-icon.png';
import mailIcon from '@/assets/icons/mail-icon.png';
import ieIcon from '@/assets/icons/ie-icon.png';
import aolIcon from '@/assets/icons/aol-icon.png';
import napsterIcon from '@/assets/icons/napster-icon.png';
import limewireIcon from '@/assets/icons/limewire-icon.png';
import minesweeperIcon from '@/assets/icons/minesweeper-icon.png';
import paintIcon from '@/assets/icons/paint-icon.png';
import notepadIcon from '@/assets/icons/notepad-icon.png';
import mediaplayerIcon from '@/assets/icons/mediaplayer-icon.png';

const Desktop: React.FC = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { windows, openWindow, playWindowOpen, playClick, logOff, shutDown } = useWindows();

  const desktopIcons = [
    { id: 'resume', title: 'My Resume', iconSrc: resumeIcon, component: 'resume' },
    { id: 'about', title: 'About Me', iconSrc: userIcon, component: 'about' },
    { id: 'contact', title: 'Contact', iconSrc: mailIcon, component: 'contact' },
    { id: 'ie', title: 'Internet Explorer', iconSrc: ieIcon, component: 'ie' },
    { id: 'aol', title: 'AOL 9.0', iconSrc: aolIcon, component: 'aol' },
    { id: 'napster', title: 'Napster', iconSrc: napsterIcon, component: 'napster' },
    { id: 'limewire', title: 'LimeWire', iconSrc: limewireIcon, component: 'limewire' },
    { id: 'minesweeper', title: 'Minesweeper', iconSrc: minesweeperIcon, component: 'minesweeper' },
    { id: 'paint', title: 'Paint', iconSrc: paintIcon, component: 'paint' },
    { id: 'notepad', title: 'Notepad', iconSrc: notepadIcon, component: 'notepad' },
    { id: 'mediaplayer', title: 'Media Player', iconSrc: mediaplayerIcon, component: 'mediaplayer' },
    { id: 'recyclebin', title: 'Recycle Bin', iconSrc: 'recyclebin', component: 'recyclebin', isSystemIcon: true },
  ];

  const getWindowSize = (id: string) => {
    const sizes: Record<string, [number, number]> = {
      minesweeper: [300, 380],
      paint: [600, 450],
      ie: [700, 500],
      aol: [600, 480],
      napster: [550, 420],
      limewire: [580, 450],
      recyclebin: [550, 380],
    };
    return sizes[id] || [500, 400];
  };

  const handleIconDoubleClick = (icon: typeof desktopIcons[0]) => {
    const [width, height] = getWindowSize(icon.id);
    playWindowOpen();
    openWindow(icon.id, icon.title, icon.component, icon.iconSrc, width, height);
  };

  const handleDesktopClick = () => {
    setStartMenuOpen(false);
  };

  const handleRefresh = () => {
    playClick();
    setRefreshKey(k => k + 1);
  };

  const handleNewFolder = () => {
    playClick();
    // Simulated - in real app would create folder
  };

  const handleProperties = () => {
    playClick();
    playWindowOpen();
    openWindow('controlpanel', 'Display Properties', 'controlpanel', undefined, 450, 400);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div 
          className="fixed inset-0 overflow-hidden"
          style={{
            backgroundImage: `url(${blissWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={handleDesktopClick}
        >
          {/* Desktop Icons */}
          <div className="absolute top-4 left-4 flex flex-col gap-2" key={refreshKey}>
            {desktopIcons.filter(icon => !('isSystemIcon' in icon)).map((icon) => (
              <DesktopIcon
                key={icon.id}
                title={icon.title}
                iconSrc={icon.iconSrc}
                onDoubleClick={() => handleIconDoubleClick(icon)}
              />
            ))}
          </div>
          
          {/* Recycle Bin - Bottom Right */}
          <div className="absolute bottom-12 right-4">
            {desktopIcons.filter(icon => 'isSystemIcon' in icon).map((icon) => (
              <div
                key={icon.id}
                className="xp-desktop-icon"
                onDoubleClick={() => handleIconDoubleClick(icon)}
                tabIndex={0}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <Trash2 className="w-10 h-10 text-gray-600 drop-shadow-lg" />
                </div>
                <span className="leading-tight">{icon.title}</span>
              </div>
            ))}
          </div>

          {/* Windows */}
          {windows.map((window) => (
            <Window key={window.id} window={window} />
          ))}

          {/* Start Menu */}
          {startMenuOpen && (
            <StartMenu 
              onClose={() => setStartMenuOpen(false)} 
              onLogOff={logOff}
              onShutDown={shutDown}
            />
          )}

          {/* Taskbar */}
          <Taskbar 
            startMenuOpen={startMenuOpen}
            onStartClick={(e) => {
              e.stopPropagation();
              setStartMenuOpen(!startMenuOpen);
            }}
          />
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-52 bg-[#ece9d8] border-[#0054e3] shadow-md">
        {/* View Submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
            <LayoutGrid className="w-4 h-4" />
            View
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-40 bg-[#ece9d8] border-[#0054e3] shadow-md">
            <ContextMenuItem className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              <LayoutGrid className="w-4 h-4" />
              Thumbnails
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              <LayoutGrid className="w-4 h-4" />
              Tiles
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              <LayoutGrid className="w-4 h-4" />
              Icons
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              <List className="w-4 h-4" />
              List
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        {/* Sort By Submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
            <ArrowUpDown className="w-4 h-4" />
            Arrange Icons By
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-36 bg-[#ece9d8] border-[#0054e3] shadow-md">
            <ContextMenuItem className="text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              Name
            </ContextMenuItem>
            <ContextMenuItem className="text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              Size
            </ContextMenuItem>
            <ContextMenuItem className="text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              Type
            </ContextMenuItem>
            <ContextMenuItem className="text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              Modified
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator className="bg-gray-400" />
        
        <ContextMenuItem 
          className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </ContextMenuItem>
        
        <ContextMenuSeparator className="bg-gray-400" />
        
        {/* New Submenu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
            <FolderPlus className="w-4 h-4" />
            New
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-40 bg-[#ece9d8] border-[#0054e3] shadow-md">
            <ContextMenuItem 
              className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
              onClick={handleNewFolder}
            >
              <FolderPlus className="w-4 h-4" />
              Folder
            </ContextMenuItem>
            <ContextMenuSeparator className="bg-gray-400" />
            <ContextMenuItem className="text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              Shortcut
            </ContextMenuItem>
            <ContextMenuItem className="text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              Text Document
            </ContextMenuItem>
            <ContextMenuItem className="text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white">
              Bitmap Image
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator className="bg-gray-400" />
        
        <ContextMenuItem 
          className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
          onClick={handleProperties}
        >
          <Monitor className="w-4 h-4" />
          Properties
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Desktop;
