import React, { useState, useEffect, useCallback } from 'react';
import blissWallpaper from '@/assets/bliss-wallpaper.jpg';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import Screensaver from './Screensaver';
import BlueScreen from './BlueScreen';
import BalloonNotification from './BalloonNotification';
import PopupBlockerPrompt from './PopupBlockerPrompt';
import TourWizard from './TourWizard';
import ActivationWizard from './ActivationWizard';
import WindowSwitcher from './WindowSwitcher';
import { useWindows } from '@/pages/Index';
import { useBloatMode } from '@/contexts/BloatModeContext';
import { useDesktopIcons } from '@/hooks/useDesktopIcons';
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
import { RefreshCw, FolderPlus, Settings, Monitor, ArrowUpDown, LayoutGrid, List, Trash2, RotateCcw, X } from 'lucide-react';

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
  const [showActivation, setShowActivation] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [switcherIndex, setSwitcherIndex] = useState(0);
  const { windows, openWindow, minimizeWindow, focusWindow, logOff, shutDown } = useWindows();
  const { bloatEnabled } = useBloatMode();
  const { getIconPosition, updateIconPosition, resetPositions } = useDesktopIcons();

  const [showWelcomeBalloon, setShowWelcomeBalloon] = useState(false);

  // Check if this is first boot and show welcome balloon notification
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('xp-tour-completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setShowWelcomeBalloon(true);
      }, 2000);
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

  // Random Activation Wizard trigger (3% chance every 45 seconds, only if not activated)
  useEffect(() => {
    const hasActivated = localStorage.getItem('xp-windows-activated');
    if (hasActivated) return;

    // Initial popup after 30 seconds
    const initialTimer = setTimeout(() => {
      if (!localStorage.getItem('xp-windows-activated')) {
        setShowActivation(true);
      }
    }, 30000);

    // Then random chance every 45 seconds
    const activationInterval = setInterval(() => {
      if (Math.random() < 0.03 && !localStorage.getItem('xp-windows-activated')) {
        setShowActivation(true);
      }
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(activationInterval);
    };
  }, []);

  // Desktop icons - positions managed by useDesktopIcons hook
  const desktopIcons = [
    { id: 'mycomputer', title: 'My Computer', iconSrc: 'mycomputer', component: 'mycomputer' },
    { id: 'resume', title: 'My Resume', iconSrc: resumeIcon, component: 'resume' },
    { id: 'about', title: 'About Me', iconSrc: userIcon, component: 'about' },
    { id: 'contact', title: 'Contact', iconSrc: mailIcon, component: 'contact' },
    { id: 'ie', title: 'Internet Explorer', iconSrc: ieIcon, component: 'ie' },
    { id: 'aol', title: 'AOL 9.0', iconSrc: aolIcon, component: 'aol' },
    { id: 'napster', title: 'Napster', iconSrc: napsterIcon, component: 'napster' },
    { id: 'limewire', title: 'LimeWire', iconSrc: limewireIcon, component: 'limewire' },
    { id: 'kazaa', title: 'Kazaa', iconSrc: kazaaIcon, component: 'kazaa' },
    { id: 'winamp', title: 'Winamp', iconSrc: winampIcon, component: 'winamp' },
    { id: 'minesweeper', title: 'Minesweeper', iconSrc: minesweeperIcon, component: 'minesweeper' },
    { id: 'paint', title: 'Paint', iconSrc: paintIcon, component: 'paint' },
    { id: 'notepad', title: 'Notepad', iconSrc: notepadIcon, component: 'notepad' },
    { id: 'mediaplayer', title: 'Media Player', iconSrc: mediaplayerIcon, component: 'mediaplayer' },
    { id: 'calc', title: 'Calculator', iconSrc: 'calc', component: 'calc' },
    { id: 'cmd', title: 'Command Prompt', iconSrc: 'cmd', component: 'cmd' },
    { id: 'msn', title: 'MSN Messenger', iconSrc: 'msn', component: 'msn' },
    { id: 'pinball', title: '3D Pinball', iconSrc: 'pinball', component: 'pinball' },
    { id: 'solitaire', title: 'Solitaire', iconSrc: 'solitaire', component: 'solitaire' },
    // Recycle Bin - always bottom right (not draggable)
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
      solitaire: [620, 480],
      calc: [260, 320],
      mycomputer: [600, 450],
      sysprops: [400, 450],
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
          {/* Desktop Icons - Draggable with grid snapping */}
          <div className="absolute inset-0" key={refreshKey}>
            {desktopIcons.filter(icon => !('isSystemIcon' in icon)).map((icon) => {
              const pos = getIconPosition(icon.id);
              return (
                <div
                  key={icon.id}
                  className="absolute"
                  style={{ top: pos.y, left: pos.x }}
                >
                  <DesktopIcon
                    title={icon.title}
                    iconSrc={icon.iconSrc}
                    onDoubleClick={() => handleIconDoubleClick(icon)}
                    onDragEnd={(x, y) => updateIconPosition(icon.id, x, y)}
                    position={pos}
                  />
                </div>
              );
            })}
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
      
      {/* Balloon Notifications - Only show when bloat enabled */}
      {bloatEnabled && <BalloonNotification />}
      
      {/* Popup Blocker Prompt - Shows when popups spawn */}
      <PopupBlockerPrompt />
      
      {/* Blue Screen of Death */}
      {showBSOD && <BlueScreen onDismiss={() => setShowBSOD(false)} />}
      
      {/* Windows Activation Wizard */}
      {showActivation && (
        <ActivationWizard 
          onClose={() => {
            setShowActivation(false);
            localStorage.setItem('xp-windows-activated', 'true');
          }} 
        />
      )}
      
      {/* Welcome Balloon Notification */}
      {showWelcomeBalloon && (
        <div 
          className="fixed bottom-10 right-2 z-[9998] animate-in slide-in-from-bottom-4"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <div className="relative bg-[#ffffe1] border-2 border-blue-400 rounded-lg shadow-lg max-w-xs cursor-pointer hover:bg-[#fffff0] transition-colors"
            onClick={() => {
              setShowWelcomeBalloon(false);
              setShowTour(true);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWelcomeBalloon(false);
                localStorage.setItem('xp-tour-completed', 'true');
              }}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="p-3 pr-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0054e3] to-[#003399] rounded-lg flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900 mb-1">
                    Welcome to Windows XP!
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    Click here to take a tour of Windows XP and learn about all the exciting features!
                  </div>
                  <div className="text-xs text-blue-600 underline mt-2 hover:text-blue-800">
                    Click here to begin the tour →
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#ffffe1] border-r-2 border-b-2 border-blue-400 transform rotate-45" />
          </div>
        </div>
      )}

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
          onClick={resetPositions}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Icon Positions
        </ContextMenuItem>
        
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
