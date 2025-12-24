import React from 'react';
import { Heart, Monitor, Gamepad2, Music, Coffee } from 'lucide-react';

const AboutApp: React.FC = () => {
  return (
    <div className="p-4 font-xp text-sm overflow-auto h-full bg-white">
      <div className="max-w-lg mx-auto">
        {/* Header with XP nostalgia */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-lg mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl">
              👨‍💻
            </div>
            <div>
              <h1 className="text-xl font-bold">About Me</h1>
              <p className="text-blue-100 text-xs">Version 1.0 (Build 2024)</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="text-gray-700 leading-relaxed">
            Hey there! I'm a developer who grew up during the golden age of Windows XP. 
            That startup sound? Pure dopamine. The Bliss wallpaper? Chef's kiss. 
            I build web applications by day and play retro games by night.
          </p>
        </div>

        {/* Interests */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Monitor className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Coding</span>
            </div>
            <p className="text-xs text-gray-600">React, TypeScript, making things work</p>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Gamepad2 className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-800">Gaming</span>
            </div>
            <p className="text-xs text-gray-600">Retro games, indie titles</p>
          </div>
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Music className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-800">Music</span>
            </div>
            <p className="text-xs text-gray-600">Lo-fi beats, 2000s nostalgia</p>
          </div>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Coffee className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800">Coffee</span>
            </div>
            <p className="text-xs text-gray-600">Powered by caffeine</p>
          </div>
        </div>

        {/* XP Nostalgia */}
        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-yellow-800">Why Windows XP?</span>
          </div>
          <p className="text-xs text-gray-700">
            Windows XP represents a simpler time in computing. It was reliable, 
            beautiful (for its time), and came with Minesweeper. What more could you want?
            This portfolio is my tribute to that era while showcasing modern web development skills.
          </p>
        </div>

        {/* System Info (XP style) */}
        <div className="bg-gray-100 p-3 rounded border">
          <h3 className="font-bold text-gray-700 mb-2">System Properties</h3>
          <div className="text-xs space-y-1 text-gray-600">
            <p><span className="font-semibold">Developer:</span> John Developer</p>
            <p><span className="font-semibold">Location:</span> The Internet</p>
            <p><span className="font-semibold">Status:</span> Available for hire</p>
            <p><span className="font-semibold">Coffee Level:</span> ████████░░ 80%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutApp;
