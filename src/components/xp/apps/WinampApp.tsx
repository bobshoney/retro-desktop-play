import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Square, Volume2, Shuffle, Repeat, List, X, Minus } from 'lucide-react';
import { useDownloads } from '@/contexts/DownloadsContext';

const WinampApp: React.FC = () => {
  const { downloads } = useDownloads();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Built-in demo tracks + downloaded tracks
  const builtInTracks = [
    { id: 'demo1', title: 'Windows XP Startup', artist: 'Microsoft', audioUrl: '/sounds/xp-startup.mp3', duration: '0:04', source: 'builtin' as const },
    { id: 'demo2', title: 'Windows XP Logon', artist: 'Microsoft', audioUrl: '/sounds/xp-logon.mp3', duration: '0:05', source: 'builtin' as const },
    { id: 'demo3', title: 'Hardware Insert', artist: 'Microsoft', audioUrl: '/sounds/xp-hardware-insert.mp3', duration: '0:02', source: 'builtin' as const },
    { id: 'demo4', title: 'AOL Welcome', artist: 'AOL', audioUrl: '/sounds/aol-welcome.ogg', duration: '0:02', source: 'builtin' as const },
    { id: 'demo5', title: 'AOL You Got Mail', artist: 'AOL', audioUrl: '/sounds/aol-youvegotmail.ogg', duration: '0:01', source: 'builtin' as const },
  ];

  const allTracks = [...builtInTracks, ...downloads];
  const currentTrack = allTracks[currentTrackIndex];

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    });

    audio.addEventListener('ended', () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, currentTrack?.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrev = () => {
    if (shuffle) {
      setCurrentTrackIndex(Math.floor(Math.random() * allTracks.length));
    } else {
      setCurrentTrackIndex(prev => (prev === 0 ? allTracks.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (shuffle) {
      setCurrentTrackIndex(Math.floor(Math.random() * allTracks.length));
    } else {
      setCurrentTrackIndex(prev => (prev === allTracks.length - 1 ? 0 : prev + 1));
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setProgress(0);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="h-full flex flex-col bg-[#232323] select-none">
      {/* Main Player Window */}
      <div className="bg-gradient-to-b from-[#454545] to-[#232323] border border-[#3a3a3a] rounded-t">
        {/* Title bar */}
        <div className="h-4 bg-gradient-to-r from-[#4a6a9c] via-[#6a8ac4] to-[#4a6a9c] flex items-center px-1">
          <span className="text-[10px] text-white font-bold tracking-wider">WINAMP</span>
          <div className="flex-1" />
        </div>

        {/* Display */}
        <div className="bg-[#0a0f14] m-1 p-2 border border-[#1a1a1a]">
          {/* Visualization - fake spectrum */}
          <div className="flex gap-0.5 h-8 items-end justify-center mb-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-[#00ff00] via-[#ffff00] to-[#ff0000] transition-all duration-75"
                style={{
                  height: isPlaying ? `${Math.random() * 100}%` : '10%',
                  opacity: isPlaying ? 1 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Track info */}
          <div className="text-[#00ff00] font-mono text-xs overflow-hidden">
            <div className="whitespace-nowrap animate-marquee">
              {currentTrack ? `${currentTrack.artist} - ${currentTrack.title}` : 'No track loaded'}
            </div>
          </div>

          {/* Time display */}
          <div className="flex justify-between text-[#00ff00] font-mono text-[10px] mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Progress bar */}
          <div 
            className="h-2 bg-[#0a1520] mt-1 cursor-pointer border border-[#1a2a3a]"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-[#6a8ac4] to-[#4a6a9c]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-1 p-2">
          <button 
            onClick={handlePrev}
            className="w-7 h-5 bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] border border-[#5a5a5a] rounded-sm flex items-center justify-center hover:from-[#5a5a5a] hover:to-[#3a3a3a]"
          >
            <SkipBack className="w-3 h-3 text-[#c0c0c0]" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-7 h-5 bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] border border-[#5a5a5a] rounded-sm flex items-center justify-center hover:from-[#5a5a5a] hover:to-[#3a3a3a]"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 text-[#c0c0c0]" />
            ) : (
              <Play className="w-3 h-3 text-[#c0c0c0]" />
            )}
          </button>
          <button 
            onClick={handleStop}
            className="w-7 h-5 bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] border border-[#5a5a5a] rounded-sm flex items-center justify-center hover:from-[#5a5a5a] hover:to-[#3a3a3a]"
          >
            <Square className="w-3 h-3 text-[#c0c0c0]" />
          </button>
          <button 
            onClick={handleNext}
            className="w-7 h-5 bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] border border-[#5a5a5a] rounded-sm flex items-center justify-center hover:from-[#5a5a5a] hover:to-[#3a3a3a]"
          >
            <SkipForward className="w-3 h-3 text-[#c0c0c0]" />
          </button>
          
          <div className="w-px h-4 bg-[#3a3a3a] mx-1" />
          
          <button 
            onClick={() => setShuffle(!shuffle)}
            className={`w-7 h-5 bg-gradient-to-b ${shuffle ? 'from-[#6a8ac4] to-[#4a6a9c]' : 'from-[#4a4a4a] to-[#2a2a2a]'} border border-[#5a5a5a] rounded-sm flex items-center justify-center hover:from-[#5a5a5a] hover:to-[#3a3a3a]`}
          >
            <Shuffle className="w-3 h-3 text-[#c0c0c0]" />
          </button>
          <button 
            onClick={() => setRepeat(!repeat)}
            className={`w-7 h-5 bg-gradient-to-b ${repeat ? 'from-[#6a8ac4] to-[#4a6a9c]' : 'from-[#4a4a4a] to-[#2a2a2a]'} border border-[#5a5a5a] rounded-sm flex items-center justify-center hover:from-[#5a5a5a] hover:to-[#3a3a3a]`}
          >
            <Repeat className="w-3 h-3 text-[#c0c0c0]" />
          </button>

          <div className="w-px h-4 bg-[#3a3a3a] mx-1" />

          {/* Volume */}
          <Volume2 className="w-3 h-3 text-[#808080]" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 h-1 appearance-none bg-[#0a1520] rounded cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6a8ac4 0%, #6a8ac4 ${volume}%, #0a1520 ${volume}%, #0a1520 100%)`,
            }}
          />
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="flex-1 bg-[#232323] border border-[#3a3a3a] border-t-0 flex flex-col min-h-0">
          <div className="h-4 bg-gradient-to-r from-[#4a6a9c] via-[#6a8ac4] to-[#4a6a9c] flex items-center px-1">
            <List className="w-2 h-2 text-white mr-1" />
            <span className="text-[10px] text-white font-bold">PLAYLIST</span>
            <div className="flex-1" />
            <span className="text-[10px] text-white">{allTracks.length} tracks</span>
          </div>
          
          <div className="flex-1 overflow-auto bg-[#0a0f14]">
            {allTracks.length === 0 ? (
              <div className="text-[#00ff00] font-mono text-xs p-2 text-center opacity-50">
                No tracks. Download some from Napster or LimeWire!
              </div>
            ) : (
              allTracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`px-2 py-0.5 text-xs font-mono cursor-pointer flex items-center gap-2 ${
                    index === currentTrackIndex 
                      ? 'bg-[#4a6a9c] text-white' 
                      : 'text-[#00ff00] hover:bg-[#1a2a3a]'
                  }`}
                >
                  <span className="w-4 text-right opacity-50">{index + 1}.</span>
                  <span className="flex-1 truncate">{track.artist} - {track.title}</span>
                  <span className="opacity-50">{track.duration}</span>
                  {track.source !== 'builtin' && (
                    <span className="text-[8px] px-1 bg-[#e94560] text-white rounded">
                      {track.source}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {downloads.length > 0 && (
            <div className="bg-[#1a1a1a] p-1 text-[10px] text-[#00ff00] font-mono border-t border-[#3a3a3a]">
              📥 {downloads.length} downloaded track{downloads.length !== 1 ? 's' : ''} from P2P
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WinampApp;
