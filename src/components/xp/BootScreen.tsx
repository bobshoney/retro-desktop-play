import React from 'react';

const BootScreen: React.FC = () => {
  return (
    <div className="xp-boot-screen">
      <div className="flex flex-col items-center gap-8">
        {/* Windows XP Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-8 h-8 bg-[#f65314] rounded-sm"></div>
              <div className="w-8 h-8 bg-[#7cbb00] rounded-sm"></div>
              <div className="w-8 h-8 bg-[#00a1f1] rounded-sm"></div>
              <div className="w-8 h-8 bg-[#ffbb00] rounded-sm"></div>
            </div>
          </div>
          <div className="text-white ml-4">
            <div className="text-3xl font-light tracking-wide">Microsoft</div>
            <div className="text-4xl font-bold tracking-tight">Windows<span className="text-2xl align-super">XP</span></div>
          </div>
        </div>

        {/* Professional text */}
        <div className="text-white text-lg tracking-widest">
          Professional
        </div>

        {/* Loading bar */}
        <div className="xp-boot-bar mt-8">
          <div className="xp-boot-progress"></div>
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-8 text-gray-400 text-xs">
        Copyright © Microsoft Corporation
      </div>
    </div>
  );
};

export default BootScreen;
