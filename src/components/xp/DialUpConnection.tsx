import React, { useState, useEffect, useRef } from 'react';
import { Phone, X, Globe } from 'lucide-react';

interface DialUpConnectionProps {
  onConnected: () => void;
  onCancel: () => void;
}

const connectionStages = [
  { message: 'Dialing...', duration: 2000, progress: 5 },
  { message: 'Dialing 555-1234...', duration: 1500, progress: 10 },
  { message: 'Handshaking...', duration: 3000, progress: 25 },
  { message: 'Authenticating your username...', duration: 2000, progress: 40 },
  { message: 'Verifying password...', duration: 1500, progress: 55 },
  { message: 'Registering your computer on the network...', duration: 2000, progress: 70 },
  { message: 'Establishing connection...', duration: 2500, progress: 85 },
  { message: 'Connected at 56.6 Kbps', duration: 1000, progress: 100 },
];

const DialUpConnection: React.FC<DialUpConnectionProps> = ({ onConnected, onCancel }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play dial-up sound
    audioRef.current = new Audio('/sounds/aol-dialup.mp3');
    audioRef.current.volume = 0.3;
    audioRef.current.play().catch(() => {
      // Audio autoplay blocked, continue without sound
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (currentStage >= connectionStages.length) {
      setIsConnected(true);
      // Stop dial-up sound
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Auto-proceed after connected
      const timer = setTimeout(() => {
        onConnected();
      }, 1500);
      return () => clearTimeout(timer);
    }

    const stage = connectionStages[currentStage];
    const timer = setTimeout(() => {
      setCurrentStage(prev => prev + 1);
    }, stage.duration);

    return () => clearTimeout(timer);
  }, [currentStage, onConnected]);

  const handleCancel = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onCancel();
  };

  const stage = connectionStages[Math.min(currentStage, connectionStages.length - 1)];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#ece9d8] border-2 border-[#0054e3] shadow-xl w-[400px] font-xp">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#0a246a] via-[#0a246a] to-[#a6caf0] px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-sm font-bold">
            <Globe className="w-4 h-4" />
            <span>Connecting to Internet...</span>
          </div>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-red-500 px-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Connection Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-[#ece9d8] border border-gray-400 p-3 rounded">
              <Phone className="w-8 h-8 text-[#0054e3]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold mb-1">MSN Internet Access</div>
              <div className="text-xs text-gray-600 mb-2">Phone: 555-1234</div>
              <div className="text-xs bg-white border border-gray-400 p-2 min-h-[40px]">
                {stage.message}
                {!isConnected && <span className="animate-pulse">|</span>}
              </div>
            </div>
          </div>

          {/* Modem Animation */}
          <div className="bg-[#000033] border-2 border-gray-600 p-3 mb-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-green-400 font-mono">US Robotics 56K</span>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${currentStage > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} title="CD" />
                <div className={`w-2 h-2 rounded-full ${currentStage > 1 ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} title="RD" />
                <div className={`w-2 h-2 rounded-full ${currentStage > 2 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'}`} title="SD" />
                <div className={`w-2 h-2 rounded-full ${currentStage > 3 ? 'bg-green-500' : 'bg-gray-600'}`} title="TR" />
              </div>
            </div>
            {/* ASCII modem visualization */}
            <div className="font-mono text-[10px] text-green-400 leading-tight">
              <div className="flex justify-between">
                <span>TX: {currentStage > 2 ? Math.floor(Math.random() * 9999) : '----'}</span>
                <span>RX: {currentStage > 2 ? Math.floor(Math.random() * 9999) : '----'}</span>
              </div>
              <div className="mt-1 overflow-hidden whitespace-nowrap">
                {currentStage > 1 && currentStage < 7 && (
                  <span className="animate-pulse">
                    {'~'.repeat(Math.floor(Math.random() * 20 + 10))}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Connection Progress:</span>
              <span>{stage.progress}%</span>
            </div>
            <div className="h-4 bg-white border-2 border-gray-400 overflow-hidden" style={{ borderStyle: 'inset' }}>
              <div
                className="h-full bg-gradient-to-r from-[#0054e3] to-[#3b82f6] transition-all duration-500 relative"
                style={{ width: `${stage.progress}%` }}
              >
                {/* Animated blocks like Windows XP */}
                <div className="absolute inset-0 flex">
                  {Array.from({ length: Math.ceil(stage.progress / 5) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full w-3 bg-[#0054e3] mr-0.5"
                      style={{
                        animation: `pulse 1s ease-in-out ${i * 0.1}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          {isConnected ? (
            <div className="text-center">
              <div className="text-green-600 font-bold text-sm mb-1">✓ Connected!</div>
              <div className="text-xs text-gray-600">Launching Internet Explorer...</div>
            </div>
          ) : (
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="xp-button px-4 py-1 text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Fun tip */}
          <div className="mt-4 pt-3 border-t border-gray-300 text-[10px] text-gray-500 italic text-center">
            💡 Tip: Don't pick up the phone while connected, or you'll lose your connection!
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialUpConnection;
