import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Square } from 'lucide-react';

const playlist = [
  { title: 'Windows XP Startup', artist: 'Microsoft', duration: '0:04' },
  { title: 'Windows XP Shutdown', artist: 'Microsoft', duration: '0:03' },
  { title: 'Lo-Fi Beats', artist: 'Chillhop', duration: '3:45' },
  { title: 'Retro Vibes', artist: 'Synthwave FM', duration: '4:20' },
  { title: 'Coffee Shop Jazz', artist: 'Jazz Cafe', duration: '5:12' },
];

const MediaPlayerApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentTrack((t) => (t + 1) % playlist.length);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const track = playlist[currentTrack];

  const handlePrev = () => {
    setCurrentTrack((t) => (t - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentTrack((t) => (t + 1) % playlist.length);
    setProgress(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      {/* Visualization Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          {/* Album art placeholder */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <div className={`text-5xl ${isPlaying ? 'animate-pulse' : ''}`}>🎵</div>
          </div>
          
          <div className="text-white">
            <h3 className="font-bold text-lg">{track.title}</h3>
            <p className="text-gray-400 text-sm">{track.artist}</p>
          </div>

          {/* Visualizer bars */}
          {isPlaying && (
            <div className="flex items-end justify-center gap-1 h-8 mt-4">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-blue-400 rounded-t"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `pulse ${0.3 + Math.random() * 0.5}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0:00</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-[#0f0f1a] border-t border-gray-800">
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleStop}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
          >
            <Square className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 ml-4">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div className="w-16 h-1 bg-gray-700 rounded-full">
              <div className="w-3/4 h-full bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="max-h-24 overflow-auto bg-[#0a0a14] border-t border-gray-800">
        {playlist.map((item, index) => (
          <div 
            key={index}
            onClick={() => { setCurrentTrack(index); setProgress(0); }}
            className={`flex items-center justify-between px-4 py-1.5 text-xs cursor-pointer hover:bg-gray-800
              ${index === currentTrack ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400'}`}
          >
            <span>{item.title} - {item.artist}</span>
            <span>{item.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPlayerApp;
