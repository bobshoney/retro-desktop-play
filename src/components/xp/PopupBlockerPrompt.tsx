import React from 'react';
import { Shield, X, AlertTriangle } from 'lucide-react';
import { useBloatMode } from '@/contexts/BloatModeContext';

const PopupBlockerPrompt: React.FC = () => {
  const { showBlockerPrompt, dismissBlockerPrompt, setBloatEnabled, popupSpawnCount } = useBloatMode();

  if (!showBlockerPrompt) return null;

  const handleBlock = () => {
    setBloatEnabled(false);
    dismissBlockerPrompt();
  };

  const handleKeepOpen = () => {
    dismissBlockerPrompt();
  };

  return (
    <div 
      className="fixed bottom-12 right-2 z-[9999] animate-fade-in"
      style={{ 
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* XP-styled balloon notification */}
      <div className="relative bg-[#ffffe1] border-2 border-[#d4a017] rounded-lg shadow-lg max-w-xs">
        {/* Close button */}
        <button
          onClick={handleKeepOpen}
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-0.5"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Content */}
        <div className="p-3 pr-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="relative">
                <Shield className="w-8 h-8 text-yellow-600" />
                <AlertTriangle className="w-4 h-4 text-yellow-500 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-1">
                <span>Pop-up Blocked</span>
                <span className="text-xs font-normal text-gray-500">({popupSpawnCount})</span>
              </div>
              <div className="text-xs text-gray-700 leading-relaxed mb-2">
                Windows has detected annoying pop-ups! Would you like to enable Pop-up Blocker?
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={handleBlock}
                  className="px-3 py-1 text-xs bg-[#ece9d8] border border-gray-400 rounded hover:bg-[#ddd9c8] font-medium shadow-sm flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-green-600" />
                  Block Pop-ups
                </button>
                <button 
                  onClick={handleKeepOpen}
                  className="px-3 py-1 text-xs bg-[#ece9d8] border border-gray-400 rounded hover:bg-[#ddd9c8] text-gray-600 shadow-sm"
                >
                  Allow (Nostalgic Mode)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pointer/Arrow pointing down to tray */}
        <div 
          className="absolute -bottom-2 right-8 w-4 h-4 bg-[#ffffe1] border-r-2 border-b-2 border-[#d4a017] transform rotate-45"
        />
      </div>
    </div>
  );
};

export default PopupBlockerPrompt;
