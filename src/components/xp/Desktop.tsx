import React, { useState, useEffect, useCallback } from 'react';
import blissWallpaper from '@/assets/bliss-wallpaper.jpg';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import Screensaver from './Screensaver';
import BlueScreen from './BlueScreen';
import BalloonNotification from './BalloonNotification';
import TourWizard from './TourWizard';
import WindowSwitcher from './WindowSwitcher';
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
import kazaaIcon from '@/assets/icons/kazaa-icon.png';
import winampIcon from '@/assets/icons/winamp-icon.png';
import minesweeperIcon from '@/assets/icons/minesweeper-icon.png';
import paintIcon from '@/assets/icons/paint-icon.png';
import notepadIcon from '@/assets/icons/notepad-icon.png';
import mediaplayerIcon from '@/assets/icons/mediaplayer-icon.png';

const Desktop: React.FC = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBSOD, setShowBSOD] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [switcherIndex, setSwitcherIndex] = useState(0);
  const { windows, openWindow, minimizeWindow, focusWindow, logOff, shutDown } = useWindows();

  // Check if this is first boot and show tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('xp-tour-completed');
    if (!hasSeenTour) {
      // Small delay to let desktop load first
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Get non-minimized windows for Alt+Tab
  const switchableWindows = windows.filter(w => !w.isMinimized);

  // Global keyboard shortcuts
  useEffect(() => {
    let altTabActive = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Tab - Window Switcher
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        
        if (switchableWindows.length > 0) {
          if (!altTabActive) {
            altTabActive = true;
            setShowSwitcher(true);
            setSwitcherIndex(0);
          } else {
            // Cycle to next window
            setSwitcherIndex(prev => (prev + 1) % switchableWindows.length);
          }
        }
        return;
      }

      // Win+R - Open Run dialog
      if (e.metaKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        openWindow('run', 'Run', 'run', undefined, 400, 180);
        return;
      }
      
      // Win+E - Open My Documents (Explorer)
      if (e.metaKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        openWindow('mydocuments', 'My Documents', 'mydocuments', undefined, 600, 450);
        return;
      }
      
      // Win+D - Show Desktop (minimize all windows)
      if (e.metaKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        windows.forEach(w => {
          if (!w.isMinimized) {
            minimizeWindow(w.id);
          }
        });
        setStartMenuOpen(false);
        return;
      }
      
      // Ctrl+Esc - Open Start Menu
      if (e.ctrlKey && e.key === 'Escape') {
        e.preventDefault();
        setStartMenuOpen(prev => !prev);
        return;
      }
      
      // Escape - Close Start Menu if open
      if (e.key === 'Escape' && startMenuOpen) {
        e.preventDefault();
        setStartMenuOpen(false);
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // When Alt is released, switch to selected window
      if (e.key === 'Alt' && showSwitcher) {
        setShowSwitcher(false);
        altTabActive = false;
        
        if (switchableWindows.length > 0 && switchableWindows[switcherIndex]) {
          focusWindow(switchableWindows[switcherIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [openWindow, windows, minimizeWindow, startMenuOpen, showSwitcher, switcherIndex, switchableWindows, focusWindow]);

  const handleTourComplete = () => {
    localStorage.setItem('xp-tour-completed', 'true');
    setShowTour(false);
  };

  const handleTourSkip = () => {
    localStorage.setItem('xp-tour-completed', 'true');
    setShowTour(false);
  };

  // Random BSOD trigger (very rare - 0.5% chance every 60 seconds)
  useEffect(() => {
    const bsodInterval = setInterval(() => {
      if (Math.random() < 0.005) {
        setShowBSOD(true);
      }
    }, 60000);

    return () => clearInterval(bsodInterval);
  }, []);

  // Desktop icons arranged in classic Windows XP vertical columns
  const desktopIcons = [
    // Column 1 (left side)
    { id: 'resume', title: 'My Resume', iconSrc: resumeIcon, component: 'resume', position: { top: 16, left: 16 } },
    { id: 'about', title: 'About Me', iconSrc: userIcon, component: 'about', position: { top: 96, left: 16 } },
    { id: 'contact', title: 'Contact', iconSrc: mailIcon, component: 'contact', position: { top: 176, left: 16 } },
    { id: 'ie', title: 'Internet Explorer', iconSrc: ieIcon, component: 'ie', position: { top: 256, left: 16 } },
    { id: 'aol', title: 'AOL 9.0', iconSrc: aolIcon, component: 'aol', position: { top: 336, left: 16 } },
    
    // Column 2
    { id: 'napster', title: 'Napster', iconSrc: napsterIcon, component: 'napster', position: { top: 16, left: 96 } },
    { id: 'limewire', title: 'LimeWire', iconSrc: limewireIcon, component: 'limewire', position: { top: 96, left: 96 } },
    { id: 'kazaa', title: 'Kazaa', iconSrc: kazaaIcon, component: 'kazaa', position: { top: 176, left: 96 } },
    { id: 'winamp', title: 'Winamp', iconSrc: winampIcon, component: 'winamp', position: { top: 256, left: 96 } },
    { id: 'minesweeper', title: 'Minesweeper', iconSrc: minesweeperIcon, component: 'minesweeper', position: { top: 336, left: 96 } },
    
    // Column 3
    { id: 'paint', title: 'Paint', iconSrc: paintIcon, component: 'paint', position: { top: 16, left: 176 } },
    { id: 'notepad', title: 'Notepad', iconSrc: notepadIcon, component: 'notepad', position: { top: 96, left: 176 } },
    { id: 'mediaplayer', title: 'Media Player', iconSrc: mediaplayerIcon, component: 'mediaplayer', position: { top: 176, left: 176 } },
    { id: 'cmd', title: 'Command Prompt', iconSrc: 'cmd', component: 'cmd', position: { top: 256, left: 176 } },
    { id: 'msn', title: 'MSN Messenger', iconSrc: 'msn', component: 'msn', position: { top: 336, left: 176 } },
    { id: 'pinball', title: '3D Pinball', iconSrc: 'pinball', component: 'pinball', position: { top: 16, left: 256 } },
    
    // Recycle Bin - always bottom right
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
      kazaa: [560, 440],
      winamp: [300, 400],
      recyclebin: [550, 380],
      cmd: [650, 420],
      msn: [350, 500],
      pinball: [520, 680],
    };
    return sizes[id] || [500, 400];
  };

  const handleIconDoubleClick = (icon: typeof desktopIcons[0]) => {
    const [width, height] = getWindowSize(icon.id);
    openWindow(icon.id, icon.title, icon.component, icon.iconSrc, width, height);
  };

  const handleDesktopClick = () => {
    setStartMenuOpen(false);
  };

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const handleNewFolder = () => {
    // Simulated - in real app would create folder
  };

  const handleProperties = () => {
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
          {/* Desktop Icons - Positioned to spell HELLO WORLD */}
          <div className="absolute inset-0" key={refreshKey}>
            {desktopIcons.filter(icon => !('isSystemIcon' in icon) && 'position' in icon).map((icon) => (
              <div
                key={icon.id}
                className="absolute"
                style={{ top: icon.position?.top, left: icon.position?.left }}
              >
                <DesktopIcon
                  title={icon.title}
                  iconSrc={icon.iconSrc}
                  onDoubleClick={() => handleIconDoubleClick(icon)}
                />
              </div>
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
      
      {/* XP Screensaver - Activates after 1 minute of idle */}
      <Screensaver idleTimeout={60000} />
      
      {/* Balloon Notifications */}
      <BalloonNotification />
      
      {/* Blue Screen of Death */}
      {showBSOD && <BlueScreen onDismiss={() => setShowBSOD(false)} />}
      
      {/* XP Tour Wizard */}
      {showTour && <TourWizard onComplete={handleTourComplete} onSkip={handleTourSkip} />}
      
      {/* Alt+Tab Window Switcher */}
      {showSwitcher && switchableWindows.length > 0 && (
        <WindowSwitcher windows={switchableWindows} selectedIndex={switcherIndex} />
      )}
      
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
