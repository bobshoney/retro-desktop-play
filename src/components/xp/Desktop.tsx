import React, { useState } from 'react';
import blissWallpaper from '@/assets/bliss-wallpaper.jpg';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import { useWindows } from '@/pages/Index';

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
  const { windows, openWindow } = useWindows();

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
  ];

  const getWindowSize = (id: string) => {
    const sizes: Record<string, [number, number]> = {
      minesweeper: [300, 380],
      paint: [600, 450],
      ie: [700, 500],
      aol: [600, 480],
      napster: [550, 420],
      limewire: [580, 450],
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

  return (
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
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            title={icon.title}
            iconSrc={icon.iconSrc}
            onDoubleClick={() => handleIconDoubleClick(icon)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}

      {/* Start Menu */}
      {startMenuOpen && (
        <StartMenu onClose={() => setStartMenuOpen(false)} />
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
  );
};

export default Desktop;
