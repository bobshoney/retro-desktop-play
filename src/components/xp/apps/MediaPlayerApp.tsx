import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Square } from 'lucide-react';

// Sample audio tracks with real audio URLs
const playlist = [
  { 
    title: 'Windows XP Startup', 
    artist: 'Microsoft', 
    duration: '0:04',
    url: 'https://www.myinstants.com/media/sounds/windows-xp-startup.mp3'
  },
  { 
    title: 'Windows XP Shutdown', 
    artist: 'Microsoft', 
    duration: '0:03',
    url: 'https://www.myinstants.com/media/sounds/windows-xp-shutdown.mp3'
  },
  { 
    title: 'Windows XP Error', 
    artist: 'Microsoft', 
    duration: '0:02',
    url: 'https://www.myinstants.com/media/sounds/erro.mp3'
  },
  { 
    title: 'Windows XP Ding', 
    artist: 'Microsoft', 
    duration: '0:01',
    url: 'https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3'
  },
  { 
    title: 'Windows XP Balloon', 
    artist: 'Microsoft', 
    duration: '0:01',
    url: 'https://www.myinstants.com/media/sounds/windows-xp-balloon.mp3'
  },
  { 
    title: 'Windows XP Exclamation', 
    artist: 'Microsoft', 
    duration: '0:01',
    url: 'https://www.myinstants.com/media/sounds/windows-xp-exclamation.mp3'
  },
];

const MediaPlayerApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = playlist[currentTrack];

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(track.url);
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrev = () => {
    setCurrentTrack((t) => (t - 1 + playlist.length) % playlist.length);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleNext = () => {
    setCurrentTrack((t) => (t + 1) % playlist.length);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(percent);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
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
        <div 
          className="h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration) || track.duration}</span>
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
            <div 
              className="w-16 h-1 bg-gray-700 rounded-full cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div 
                className="h-full bg-gray-400 rounded-full" 
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="max-h-24 overflow-auto bg-[#0a0a14] border-t border-gray-800">
        {playlist.map((item, index) => (
          <div 
            key={index}
            onClick={() => handleTrackSelect(index)}
            className={`flex items-center justify-between px-4 py-1.5 text-xs cursor-pointer hover:bg-gray-800
              ${index === currentTrack ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400'}`}
          >
            <span className="flex items-center gap-2">
              {index === currentTrack && isPlaying && <span className="animate-pulse">▶</span>}
              {item.title} - {item.artist}
            </span>
            <span>{item.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPlayerApp;