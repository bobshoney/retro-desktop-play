import React, { useState, useEffect } from 'react';
import { User, Power } from 'lucide-react';
import { useSounds } from '@/contexts/SoundContext';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { playStartup, playChord, unlockAudio } = useSounds();
  const [fadeIn, setFadeIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // Fade in effect
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Play chord sound when login screen appears
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Gentle chime
        [523, 659, 784].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.8);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 0.8);
        });
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    unlockAudio();
    setLoggingIn(true);
    setShowWelcome(true);

    // Play startup sound
    setTimeout(() => {
      playStartup();
    }, 50);

    // Show "Welcome" briefly then transition
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #003399 0%, #0055CC 30%, #0066DD 50%, #0055CC 70%, #003399 100%)',
        }}
      >
        <div className="text-white text-3xl font-light tracking-widest animate-pulse">
          Welcome
        </div>
      </div>
    );
  }

  return (
    <div 
      className="xp-login-screen transition-opacity duration-1000"
      style={{ opacity: fadeIn ? 1 : 0 }}
    >
      {/* Top bar with instruction */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-900/50 to-transparent flex items-center px-8">
        <div className="text-white text-sm opacity-80">To begin, click your user name</div>
      </div>

      {/* Windows Logo */}
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <div className="grid grid-cols-2 gap-0.5">
          <div className="w-4 h-4 bg-[#f65314] rounded-sm"></div>
          <div className="w-4 h-4 bg-[#7cbb00] rounded-sm"></div>
          <div className="w-4 h-4 bg-[#00a1f1] rounded-sm"></div>
          <div className="w-4 h-4 bg-[#ffbb00] rounded-sm"></div>
        </div>
        <span className="text-white text-xl font-light">Windows<span className="font-bold">XP</span></span>
      </div>

      {/* Divider line */}
      <div className="absolute left-0 right-0" style={{ top: '45%', transform: 'translateY(-50%)' }}>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* User selection */}
      <div className="flex flex-col items-center">
        <div 
          onClick={handleLogin}
          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-all group ${loggingIn ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg border-2 border-white/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="text-left">
            <div className="text-white text-2xl font-semibold group-hover:underline">User</div>
            <div className="text-blue-200 text-xs mt-1">Password protected</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 flex items-center justify-between px-8">
        <div className="flex items-center gap-2 text-orange-400 text-sm cursor-pointer hover:underline">
          <Power className="w-4 h-4" />
          Turn off computer
        </div>
        <div className="text-white text-xs opacity-60">
          After you log on, you can add or change accounts.
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
