import { useState, forwardRef, useEffect, useRef } from 'react';
import { User, FileText, Mail, Settings, HelpCircle, LogOut, Folder, Search, Play, Palette, StickyNote, Music, Globe, Power, Image, ChevronRight, ChevronDown, Headphones, Download, Terminal, Monitor, Calculator, MessageCircle, Gamepad2, Spade, Shield, RotateCcw, Trash2 } from 'lucide-react';
import { useWindows } from '@/pages/Index';
import { MachineSentienceEgg } from '@/components/xp/MachineSentienceEgg';

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
import laughingManIcon from '@/assets/icons/laughing-man.png';

interface StartMenuProps {
  onClose: () => void;
  onLogOff?: () => void;
  onShutDown?: () => void;
}

// Matrix rain easter egg component
const MatrixRain: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = drops[i] * fontSize < 30 ? '#ffffff' : '#00ff41';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    const timeout = setTimeout(onClose, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] cursor-pointer" onClick={onClose}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-green-400 font-mono text-2xl font-bold mb-2 animate-pulse drop-shadow-[0_0_10px_#00ff41]">
          WAKE UP, NEO...
        </div>
        <div className="text-green-300 font-mono text-sm opacity-80">
          The Matrix has you. Follow the white rabbit.
        </div>
        <div className="text-green-500 font-mono text-xs mt-4 opacity-60">
          [Click anywhere to exit]
        </div>
      </div>
    </div>
  );
};

type ProgramItem = {
  label: string;
  id: string;
  component: string;
  iconSrc?: string;
  iconType?: string;
};

type CategoryGroup = {
  category: string;
  items: ProgramItem[];
};

const StartMenu = forwardRef<HTMLDivElement, StartMenuProps>(({ onClose, onLogOff, onShutDown }, ref) => {
  const { openWindow } = useWindows();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Internet & Communication');
  const [showMatrix, setShowMatrix] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [userNameClicks, setUserNameClicks] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Konami code easter egg for matrix + GHOST for machine sentience
  useEffect(() => {
    const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    const ghostCode = ['g','h','o','s','t'];
    let konamiIndex = 0;
    let ghostIndex = 0;

    const handleKey = (e: KeyboardEvent) => {
      // Konami
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowMatrix(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
      // GHOST sequence
      if (e.key.toLowerCase() === ghostCode[ghostIndex]) {
        ghostIndex++;
        if (ghostIndex === ghostCode.length) {
          setShowGhost(true);
          ghostIndex = 0;
        }
      } else {
        ghostIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Clicking Laughing Man 5x triggers Matrix
  const handleAvatarClick = () => {
    const newCount = userNameClicks + 1;
    setUserNameClicks(newCount);
    if (newCount >= 5) {
      setShowMatrix(true);
      setUserNameClicks(0);
    } else if (newCount === 3) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  // Categorized programs for All Programs accordion
  const programCategories: CategoryGroup[] = [
    {
      category: 'Internet & Communication',
      items: [
        { label: 'Internet Explorer 6', id: 'ie', component: 'ie', iconSrc: ieIcon },
        { label: 'AOL 9.0', id: 'aol', component: 'aol', iconSrc: aolIcon },
        { label: 'MSN Messenger', id: 'msn', component: 'msn', iconType: 'msn' },
      ]
    },
    {
      category: 'P2P & Music',
      items: [
        { label: 'Napster', id: 'napster', component: 'napster', iconSrc: napsterIcon },
        { label: 'LimeWire', id: 'limewire', component: 'limewire', iconSrc: limewireIcon },
        { label: 'Kazaa', id: 'kazaa', component: 'kazaa', iconSrc: kazaaIcon },
        { label: 'Winamp', id: 'winamp', component: 'winamp', iconSrc: winampIcon },
        { label: 'Windows Media Player', id: 'mediaplayer', component: 'mediaplayer', iconSrc: mediaplayerIcon },
      ]
    },
    {
      category: 'Games',
      items: [
        { label: 'Minesweeper', id: 'minesweeper', component: 'minesweeper', iconSrc: minesweeperIcon },
        { label: 'Solitaire', id: 'solitaire', component: 'solitaire', iconType: 'solitaire' },
        { label: '3D Pinball', id: 'pinball', component: 'pinball', iconType: 'pinball' },
      ]
    },
    {
      category: 'Accessories',
      items: [
        { label: 'Paint', id: 'paint', component: 'paint', iconSrc: paintIcon },
        { label: 'Notepad', id: 'notepad', component: 'notepad', iconSrc: notepadIcon },
        { label: 'Calculator', id: 'calc', component: 'calc', iconType: 'calc' },
        { label: 'Command Prompt', id: 'cmd', component: 'cmd', iconType: 'cmd' },
      ]
    },
    {
      category: 'System',
      items: [
        { label: 'My Computer', id: 'mycomputer', component: 'mycomputer', iconType: 'mycomputer' },
        { label: 'System Properties', id: 'sysprops', component: 'sysprops', iconType: 'sysprops' },
        { label: 'Security Checklist', id: 'securitychecklist', component: 'securitychecklist', iconType: 'security' },
        { label: 'Recycle Bin', id: 'recyclebin', component: 'recyclebin', iconType: 'recyclebin' },
      ]
    },
  ];

  // Pinned programs
  const pinnedItems: ProgramItem[] = [
    { label: 'Internet Explorer', id: 'ie', component: 'ie', iconSrc: ieIcon },
    { label: 'AOL Instant Messenger', id: 'aol', component: 'aol', iconSrc: aolIcon },
    { label: 'Winamp', id: 'winamp', component: 'winamp', iconSrc: winampIcon },
  ];

  // Recent programs
  const recentItems: ProgramItem[] = [
    { label: 'My Resume', id: 'resume', component: 'resume', iconSrc: resumeIcon },
    { label: 'About Me', id: 'about', component: 'about', iconSrc: userIcon },
    { label: 'Contact', id: 'contact', component: 'contact', iconSrc: mailIcon },
    { label: 'Notepad', id: 'notepad', component: 'notepad', iconSrc: notepadIcon },
    { label: 'Paint', id: 'paint', component: 'paint', iconSrc: paintIcon },
  ];

  // Right column items
  type RightItem =
    | { divider: true }
    | { icon: React.FC<any>; label: string; id: string; component: string; bold?: boolean };

  const rightItems: RightItem[] = [
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
      minesweeper: [300, 380], paint: [600, 450], ie: [700, 500], aol: [600, 480],
      napster: [550, 420], limewire: [580, 450], kazaa: [560, 440], winamp: [300, 400],
      mydocuments: [600, 400], mypictures: [600, 400], mymusic: [600, 400],
      controlpanel: [650, 450], help: [650, 500], search: [550, 400], run: [400, 180],
      cmd: [650, 420], msn: [350, 500], pinball: [520, 680], solitaire: [620, 480],
      calc: [260, 320], mycomputer: [600, 450], sysprops: [400, 450],
      securitychecklist: [480, 520], recyclebin: [550, 380],
    };
    return sizes[id] || [500, 400];
  };

  const handleItemClick = (item: ProgramItem) => {
    if (item.component) {
      const [width, height] = getWindowSize(item.id);
      openWindow(item.id, item.label, item.component, item.iconSrc, width, height);
      onClose();
    }
  };

  const handleRightItemClick = (item: any) => {
    if ('component' in item && item.component) {
      const [width, height] = getWindowSize(item.id);
      openWindow(item.id, item.label, item.component, undefined, width, height);
      onClose();
    }
  };

  const renderIcon = (item: ProgramItem, size = 'sm') => {
    const cls = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    const iconCls = size === 'lg' ? 'w-5 h-5' : 'w-3 h-3';
    if (item.iconSrc) return <img src={item.iconSrc} alt="" className={cls} />;
    switch (item.iconType) {
      case 'msn': return <div className={`${cls} bg-gradient-to-br from-[#4b9cd3] to-[#1a5276] rounded flex items-center justify-center`}><MessageCircle className={`${iconCls} text-white`} /></div>;
      case 'solitaire': return <div className={`${cls} bg-gradient-to-br from-green-600 to-green-800 rounded flex items-center justify-center`}><Spade className={`${iconCls} text-white`} /></div>;
      case 'pinball': return <div className={`${cls} bg-gradient-to-br from-purple-600 to-blue-800 rounded flex items-center justify-center`}><Gamepad2 className={`${iconCls} text-white`} /></div>;
      case 'calc': return <div className={`${cls} bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center`}><Calculator className={`${iconCls} text-white`} /></div>;
      case 'cmd': return <div className={`${cls} bg-black rounded flex items-center justify-center`}><Terminal className={`${iconCls} text-[#00ff41]`} /></div>;
      case 'mycomputer': return <div className={`${cls} bg-gradient-to-br from-gray-100 to-gray-300 rounded flex items-center justify-center border border-gray-400`}><Monitor className={`${iconCls} text-gray-700`} /></div>;
      case 'sysprops': return <div className={`${cls} bg-gradient-to-br from-gray-400 to-gray-600 rounded flex items-center justify-center`}><Settings className={`${iconCls} text-white`} /></div>;
      case 'security': return <div className={`${cls} bg-gradient-to-br from-green-500 to-green-700 rounded flex items-center justify-center`}><Shield className={`${iconCls} text-white`} /></div>;
      case 'recyclebin': return <div className={`${cls} bg-gradient-to-br from-gray-300 to-gray-500 rounded flex items-center justify-center`}><Trash2 className={`${iconCls} text-gray-800`} /></div>;
      default: return <Folder className={`${cls} text-yellow-500`} />;
    }
  };

  return (
    <>
      {showMatrix && <MatrixRain onClose={() => setShowMatrix(false)} />}
      {showGhost && <MachineSentienceEgg onClose={() => setShowGhost(false)} />}

      <div ref={ref} className="xp-start-menu" onClick={(e) => e.stopPropagation()}>

        {/* Footer — Log Off / Shut Down */}
        <div className="flex items-center justify-end gap-4 p-2 bg-gradient-to-r from-[#1a4a9e] to-[#2460c8] border-b border-blue-900/50">
          <button
            className="flex items-center gap-2 text-white text-xs hover:bg-blue-700/50 px-3 py-1 rounded transition-colors"
            onClick={() => { onLogOff?.(); onClose(); }}
          >
            <LogOut className="w-4 h-4" />
            Log Off
          </button>
          <button
            className="flex items-center gap-2 text-white text-xs hover:bg-blue-700/50 px-3 py-1 rounded transition-colors"
            onClick={() => { onShutDown?.(); }}
          >
            <Power className="w-4 h-4 text-red-300" />
            Shut Down
          </button>
        </div>

        {/* Main content (programs + system) */}
        <div className="xp-menu-content">

          {/* ── Left column ── */}
          <div className="xp-menu-left flex flex-col">

            {/* Pinned items */}
            <div className="px-0 pt-1">
              {pinnedItems.map((item, i) => (
                <div
                  key={`pin-${i}`}
                  className="xp-menu-item"
                  onClick={() => handleItemClick(item)}
                >
                  {renderIcon(item, 'lg')}
                  <span className="font-bold text-sm leading-tight">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-300 my-1 mx-3" />

            {/* Recent items */}
            <div>
              {recentItems.map((item, i) => (
                <div
                  key={`rec-${i}`}
                  className="xp-menu-item"
                  onClick={() => handleItemClick(item)}
                >
                  {renderIcon(item, 'sm')}
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-300 my-1 mx-3" />

            {/* All Programs — Accordion */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-2 py-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-1 mb-1 flex items-center gap-1">
                  <Folder className="w-3 h-3 text-yellow-500" />
                  All Programs
                </div>
                {programCategories.map((cat) => {
                  const isOpen = expandedCategory === cat.category;
                  return (
                    <div key={cat.category} className="mb-0.5">
                      {/* Category header */}
                      <button
                        className={`w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold rounded-sm transition-colors
                          ${isOpen
                            ? 'bg-[hsl(var(--xp-selection))] text-white'
                            : 'text-gray-700 hover:bg-[hsl(var(--xp-selection))] hover:text-white'
                          }`}
                        onClick={() => setExpandedCategory(isOpen ? null : cat.category)}
                      >
                        <span>{cat.category}</span>
                        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>

                      {/* Category items */}
                      {isOpen && (
                        <div className="ml-2 border-l-2 border-blue-200 pl-1 mt-0.5 mb-1">
                          {cat.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer text-xs hover:bg-[hsl(var(--xp-selection))] hover:text-white transition-colors group"
                              onClick={() => handleItemClick(item)}
                            >
                              {renderIcon(item, 'sm')}
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hidden easter egg hint */}
              {showHint && (
                <div className="mx-2 mb-1 px-2 py-1 bg-black text-green-400 font-mono text-[9px] rounded border border-green-600 animate-pulse">
                  &gt; ACCESS_LEVEL: ALMOST... keep clicking
                </div>
              )}

              {/* Matrix easter egg trigger */}
              <div
                className="mx-2 mb-1 px-2 py-1.5 flex items-center gap-2 text-[10px] text-gray-400 hover:bg-gray-100 rounded-sm cursor-pointer group transition-colors"
                onClick={() => setShowMatrix(true)}
                title="Wake up, Neo..."
              >
                <div className="w-4 h-4 bg-black rounded flex items-center justify-center flex-shrink-0">
                  <Terminal className="w-2.5 h-2.5 text-green-400" />
                </div>
                <span className="font-mono group-hover:text-green-600 transition-colors">
                  &gt; <span className="text-green-500">_</span>
                </span>
              </div>

              {/* Ghost in the Shell / Machine Sentience easter egg trigger */}
              <div
                className="mx-2 mb-2 px-2 py-1.5 flex items-center gap-2 text-[10px] text-gray-500 hover:bg-gray-100 rounded-sm cursor-pointer group transition-colors"
                onClick={() => setShowGhost(true)}
                title="There is a ghost in this machine..."
              >
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0a0a2e, #1a0a2e)' }}>
                  <span className="text-[8px]" style={{ color: '#9966ff' }}>ψ</span>
                </div>
                <span className="font-mono text-gray-400 group-hover:text-purple-500 transition-colors">
                  ghost<span className="opacity-40">_shell</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="xp-menu-right">
            {rightItems.map((item, i) => {
              if ('divider' in item) {
                return <div key={i} className="h-px bg-blue-400/30 my-2 mx-3" />;
              }
              const IconComp = item.icon;
              return (
                <div
                  key={i}
                  className="xp-menu-item-right"
                  onClick={() => handleRightItemClick(item)}
                >
                  <IconComp className="w-4 h-4 flex-shrink-0" />
                  <span className={`text-xs ${'bold' in item && item.bold ? 'font-bold' : ''}`}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Header (user) — at the BOTTOM visually since menu opens upward */}
        <div className="xp-menu-header relative">
          {/* Laughing Man avatar with click easter egg */}
          <button
            className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-lg hover:border-cyan-300 transition-all hover:shadow-cyan-400/30 hover:shadow-lg flex-shrink-0"
            onClick={handleAvatarClick}
            title="The Laughing Man"
          >
            <img src={laughingManIcon} alt="Laughing Man" className="w-full h-full object-cover" />
          </button>

          <div className="flex flex-col">
            <span className="text-white font-bold text-base drop-shadow-md leading-tight">
              Laughing Man
            </span>
            <span className="text-cyan-300/80 text-[9px] font-mono leading-tight">
              &quot;I thought what I'd do...&quot;
            </span>
          </div>

          {/* Click counter indicator */}
          {userNameClicks > 0 && (
            <div className="absolute right-3 top-2 text-[9px] font-mono text-cyan-400 opacity-60">
              [{userNameClicks}/5]
            </div>
          )}
        </div>
      </div>
    </>
  );
});

StartMenu.displayName = 'StartMenu';
export default StartMenu;
