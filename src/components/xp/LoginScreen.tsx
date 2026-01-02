import React from 'react';
import { User } from 'lucide-react';
import { useXPSounds } from '@/hooks/useXPSounds';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { playClick, playLogon } = useXPSounds();

  const handleLogin = () => {
    // Play logon sound on login (requires user interaction for browser autoplay policy)
    playLogon();
    playClick();
    onLogin();
  };

  return (
    <div className="xp-login-screen">
      {/* Header */}
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

      {/* User selection */}
      <div className="flex flex-col items-center">
        <div 
          onClick={handleLogin}
          className="flex items-center gap-4 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors group"
        >
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="text-left">
            <div className="text-white text-2xl font-semibold group-hover:underline">User</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 flex items-center justify-between px-8">
        <div className="text-orange-400 text-sm cursor-pointer hover:underline">
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
