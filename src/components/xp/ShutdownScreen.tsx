import React from 'react';

const ShutdownScreen: React.FC = () => {
  return (
    <div className="xp-shutdown-screen">
      <div className="flex flex-col items-center gap-6">
        {/* Windows XP Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-6 h-6 bg-[#f65314] rounded-sm"></div>
              <div className="w-6 h-6 bg-[#7cbb00] rounded-sm"></div>
              <div className="w-6 h-6 bg-[#00a1f1] rounded-sm"></div>
              <div className="w-6 h-6 bg-[#ffbb00] rounded-sm"></div>
            </div>
          </div>
          <div className="text-white ml-3">
            <div className="text-2xl font-light tracking-wide">Microsoft</div>
            <div className="text-3xl font-bold tracking-tight">Windows<span className="text-xl align-super">XP</span></div>
          </div>
        </div>

        {/* Shutdown message */}
        <div className="text-white text-xl tracking-wide mt-4">
          Windows is shutting down...
        </div>

        {/* Fade animation overlay */}
        <div className="xp-shutdown-fade"></div>
      </div>
    </div>
  );
};

export default ShutdownScreen;
