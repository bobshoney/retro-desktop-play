import React from 'react';
import { Trash2, FileText, Globe, Music, Gamepad2, Mail, Terminal, FolderOpen, HelpCircle, Settings, Search, MessageCircle } from 'lucide-react';

interface WindowInfo {
  id: string;
  title: string;
  iconSrc?: string;
}

interface WindowSwitcherProps {
  windows: WindowInfo[];
  selectedIndex: number;
}

const WindowSwitcher: React.FC<WindowSwitcherProps> = ({ windows, selectedIndex }) => {
  if (windows.length === 0) return null;

  const getIcon = (window: WindowInfo) => {
    const iconSrc = window.iconSrc;
    
    // System icons that need special handling
    const iconMap: Record<string, React.ReactNode> = {
      'recyclebin': <Trash2 className="w-8 h-8 text-gray-600" />,
      'cmd': <Terminal className="w-8 h-8 text-gray-800" />,
      'msn': <MessageCircle className="w-8 h-8 text-green-600" />,
      'pinball': <Gamepad2 className="w-8 h-8 text-purple-600" />,
      'help': <HelpCircle className="w-8 h-8 text-blue-600" />,
      'controlpanel': <Settings className="w-8 h-8 text-gray-600" />,
      'search': <Search className="w-8 h-8 text-yellow-600" />,
      'run': <Terminal className="w-8 h-8 text-gray-700" />,
      'mydocuments': <FolderOpen className="w-8 h-8 text-yellow-500" />,
    };

    if (iconMap[window.id]) {
      return iconMap[window.id];
    }

    // If iconSrc is a path to an image
    if (iconSrc && iconSrc.startsWith('/') || iconSrc?.includes('.png') || iconSrc?.includes('.jpg')) {
      return <img src={iconSrc} alt={window.title} className="w-8 h-8 object-contain" />;
    }

    // Default icon
    return <FileText className="w-8 h-8 text-gray-600" />;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <div 
        className="bg-[#ece9d8] border-2 border-[#0054e3] shadow-lg p-4"
        style={{
          boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, 2px 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#0a246a] via-[#0a246a] to-[#a6caf0] text-white text-xs font-bold px-2 py-1 mb-3 -mt-2 -mx-2">
          Switch Windows
        </div>
        
        {/* Window icons grid */}
        <div className="flex gap-2 flex-wrap max-w-[400px] justify-center">
          {windows.map((window, index) => (
            <div
              key={window.id}
              className={`
                flex flex-col items-center justify-center p-2 min-w-[72px]
                ${index === selectedIndex 
                  ? 'bg-[#316ac5] border-2 border-[#0054e3]' 
                  : 'bg-transparent border-2 border-transparent hover:bg-[#c1d2ee]'
                }
              `}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white/50 rounded shadow-sm mb-1">
                {getIcon(window)}
              </div>
              <span 
                className={`text-[10px] text-center truncate max-w-[64px] ${
                  index === selectedIndex ? 'text-white font-semibold' : 'text-gray-800'
                }`}
              >
                {window.title}
              </span>
            </div>
          ))}
        </div>

        {/* Selected window title */}
        <div className="mt-3 pt-2 border-t border-gray-400 text-center">
          <span className="text-sm font-semibold text-gray-800">
            {windows[selectedIndex]?.title || ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WindowSwitcher;
