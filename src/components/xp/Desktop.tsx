import React, { useState } from 'react';
import blissWallpaper from '@/assets/bliss-wallpaper.jpg';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import { useWindows } from '@/pages/Index';
import { FileText, User, Mail, Bomb, Palette, StickyNote, Music, Globe, Disc, Zap, MessageCircle } from 'lucide-react';

const Desktop: React.FC = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const { windows, openWindow } = useWindows();

  const desktopIcons = [
    { id: 'resume', title: 'My Resume', icon: FileText, component: 'resume' },
    { id: 'about', title: 'About Me', icon: User, component: 'about' },
    { id: 'contact', title: 'Contact', icon: Mail, component: 'contact' },
    { id: 'ie', title: 'Internet Explorer', icon: Globe, component: 'ie' },
    { id: 'aol', title: 'AOL 9.0', icon: MessageCircle, component: 'aol' },
    { id: 'napster', title: 'Napster', icon: Disc, component: 'napster' },
    { id: 'limewire', title: 'LimeWire', icon: Zap, component: 'limewire' },
    { id: 'minesweeper', title: 'Minesweeper', icon: Bomb, component: 'minesweeper' },
    { id: 'paint', title: 'Paint', icon: Palette, component: 'paint' },
    { id: 'notepad', title: 'Notepad', icon: StickyNote, component: 'notepad' },
    { id: 'mediaplayer', title: 'Media Player', icon: Music, component: 'mediaplayer' },
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
    openWindow(icon.id, icon.title, icon.component, width, height);
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
            Icon={icon.icon}
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
