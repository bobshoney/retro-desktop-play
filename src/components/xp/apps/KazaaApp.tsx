import React, { useState, useEffect } from 'react';
import { Download, Search, AlertTriangle, Skull, Music, Film, Image, File, Shield, Zap } from 'lucide-react';
import { useDownloads } from '@/contexts/DownloadsContext';
import { useBloatMode } from '@/contexts/BloatModeContext';
import BonziBuddy from '../BonziBuddy';
import PopupAd from '../PopupAd';

interface KazaaFile {
  id: number;
  name: string;
  displayName: string;
  artist: string;
  type: 'audio' | 'video' | 'image' | 'software';
  size: string;
  speed: 'T3' | 'Cable' | 'DSL' | '56k';
  status: 'available' | 'downloading' | 'complete' | 'failed';
  progress: number;
  isSketch: boolean;
  sketchReason?: string;
  audioUrl?: string;
  duration?: string;
}

const KazaaApp: React.FC = () => {
  const { addDownload, downloads } = useDownloads();
  const { bloatEnabled, setHasActiveAds, notifyPopupSpawn } = useBloatMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [sketchWarning, setSketchWarning] = useState<{ name: string; reason: string } | null>(null);
  const [spywareAlert, setSpywareAlert] = useState(false);
  const [showBonzi, setShowBonzi] = useState(true);
  const [popupAds, setPopupAds] = useState<number[]>([]);

  const [files, setFiles] = useState<KazaaFile[]>([
    { id: 1, name: 'xp_hardware_insert.mp3', displayName: 'XP Hardware Sound', artist: 'Microsoft', type: 'audio', size: '89 KB', speed: 'Cable', status: 'available', progress: 0, isSketch: false, audioUrl: '/sounds/xp-hardware-insert.mp3', duration: '0:02' },
    { id: 2, name: 'FREE_RINGTONES_2003.exe', displayName: 'Free Ringtones Pack', artist: 'TotallyLegit', type: 'software', size: '2.3 MB', speed: 'DSL', status: 'available', progress: 0, isSketch: true, sketchReason: 'Contains BonziBuddy and 47 browser toolbars' },
    { id: 3, name: 'xp_restore.mp3', displayName: 'XP Restore Sound', artist: 'Microsoft', type: 'audio', size: '67 KB', speed: 'T3', status: 'available', progress: 0, isSketch: false, audioUrl: '/sounds/xp-restore.mp3', duration: '0:01' },
    { id: 4, name: 'LIMEWIRE_PRO_KEYGEN.exe', displayName: 'LimeWire Pro Keygen', artist: 'CrackZ', type: 'software', size: '156 KB', speed: '56k', status: 'available', progress: 0, isSketch: true, sketchReason: 'Detected: Gator, Claria, WeatherBug spyware bundle' },
    { id: 5, name: 'xp_logoff.mp3', displayName: 'XP Logoff Sound', artist: 'Microsoft', type: 'audio', size: '234 KB', speed: 'Cable', status: 'available', progress: 0, isSketch: false, audioUrl: '/sounds/xp-logoff.mp3', duration: '0:03' },
    { id: 6, name: 'SMILEY_CENTRAL_INSTALLER.exe', displayName: 'Smiley Central', artist: 'FunWebProducts', type: 'software', size: '4.7 MB', speed: 'DSL', status: 'available', progress: 0, isSketch: true, sketchReason: 'Will install: MyWebSearch, FunWebProducts toolbar, Cursor Mania' },
    { id: 7, name: 'aol_dialup.mp3', displayName: 'AOL Dial-up Sound', artist: 'America Online', type: 'audio', size: '1.2 MB', speed: 'T3', status: 'available', progress: 0, isSketch: false, audioUrl: '/sounds/aol-dialup.mp3', duration: '0:25' },
    { id: 8, name: 'COMET_CURSOR_SETUP.exe', displayName: 'Comet Cursor', artist: 'Comet Systems', type: 'software', size: '890 KB', speed: 'Cable', status: 'available', progress: 0, isSketch: true, sketchReason: 'Installs tracking cookies and homepage hijacker' },
    { id: 9, name: 'xp_hardware_remove.mp3', displayName: 'XP Hardware Remove', artist: 'Microsoft', type: 'audio', size: '78 KB', speed: 'DSL', status: 'available', progress: 0, isSketch: false, audioUrl: '/sounds/xp-hardware-remove.mp3', duration: '0:02' },
    { id: 10, name: 'BONZI_BUDDY_INSTALLER.exe', displayName: 'BonziBuddy', artist: 'Bonzi Software', type: 'software', size: '6.2 MB', speed: '56k', status: 'available', progress: 0, isSketch: true, sketchReason: '🦍 Your new purple gorilla friend! (+ adware, spyware, trackware)' },
  ]);

  // Update hasActiveAds when popupAds change
  useEffect(() => {
    setHasActiveAds(popupAds.length > 0);
  }, [popupAds.length, setHasActiveAds]);

  // Clear popups when bloat is disabled
  useEffect(() => {
    if (!bloatEnabled) {
      setPopupAds([]);
      setShowBonzi(false);
    }
  }, [bloatEnabled]);

  // Random popup ads - Kazaa was the WORST for these - only spawn if bloat enabled
  useEffect(() => {
    if (!bloatEnabled) return;
    
    const spawnAd = () => {
      if (Math.random() < 0.5 && popupAds.length < 4) {
        setPopupAds(prev => [...prev, Date.now()]);
        notifyPopupSpawn();
      }
    };
    
    // Spawn first ad quickly
    const timer = setTimeout(spawnAd, 2000 + Math.random() * 3000);
    const interval = setInterval(spawnAd, 10000 + Math.random() * 15000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [popupAds.length, bloatEnabled]);

  const closePopupAd = (id: number) => {
    // 50% chance to spawn another ad when closing (Kazaa was notorious!)
    if (bloatEnabled && Math.random() < 0.5 && popupAds.length < 5) {
      setPopupAds(prev => [...prev.filter(p => p !== id), Date.now()]);
      notifyPopupSpawn();
    } else {
      setPopupAds(prev => prev.filter(p => p !== id));
    }
  };

  const isDownloaded = (fileId: number) => {
    return downloads.some(d => d.id === `kazaa-${fileId}`);
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'T3': return 'text-green-400';
      case 'Cable': return 'text-blue-400';
      case 'DSL': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Music className="w-4 h-4 text-purple-400" />;
      case 'video': return <Film className="w-4 h-4 text-orange-400" />;
      case 'image': return <Image className="w-4 h-4 text-pink-400" />;
      default: return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const startDownload = (id: number) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    if (file.isSketch) {
      setSketchWarning({ name: file.name, reason: file.sketchReason || 'Unknown threat' });
      // Show spyware alert after warning
      setTimeout(() => {
        setSpywareAlert(true);
        setTimeout(() => setSpywareAlert(false), 4000);
      }, 3000);
      setTimeout(() => setSketchWarning(null), 3000);
      return;
    }

    if (isDownloaded(id)) return;

    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'downloading' as const, progress: 0 } : f
    ));

    const interval = setInterval(() => {
      setFiles(prev => {
        const currentFile = prev.find(f => f.id === id);
        if (!currentFile || currentFile.progress >= 100) {
          clearInterval(interval);
          if (file.type === 'audio' && file.audioUrl) {
            addDownload({
              id: `kazaa-${id}`,
              title: file.displayName,
              artist: file.artist,
              source: 'limewire', // Use limewire as source type for display
              audioUrl: file.audioUrl,
              duration: file.duration || '0:00',
            });
          }
          return prev.map(f => 
            f.id === id ? { ...f, status: 'complete' as const, progress: 100 } : f
          );
        }
        // Slower, more realistic 2003 speeds
        return prev.map(f => 
          f.id === id ? { ...f, progress: Math.min(f.progress + Math.random() * 8, 100) } : f
        );
      });
    }, 800);
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#2d1b4e] to-[#1a0f2e] text-white font-xp text-sm relative">
      {/* Sketch Warning Modal */}
      {sketchWarning && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-[#4a2c7a] to-[#2d1b4e] border-2 border-orange-500 rounded-lg shadow-2xl p-4 max-w-sm animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <Skull className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-orange-400 text-lg">⚠️ SKETCHY FILE DETECTED!</span>
            </div>
            <p className="text-xs mb-3 text-gray-200">
              <span className="font-mono text-orange-300 block mb-2">{sketchWarning.name}</span>
              <span className="text-red-400">{sketchWarning.reason}</span>
            </p>
            <p className="text-xs text-purple-300 italic">
              Download blocked for your "protection" 😉
            </p>
          </div>
        </div>
      )}

      {/* Spyware Alert */}
      {spywareAlert && (
        <div className="absolute top-4 right-4 bg-red-600 border-2 border-red-400 rounded p-3 shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4" />
            <span>Ad-Aware detected 23 new tracking cookies!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#6b3fa0] via-[#8b5cf6] to-[#f97316] p-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded flex items-center justify-center font-bold text-lg">
            K
          </div>
          <span className="font-bold text-lg text-white drop-shadow-lg">Kazaa</span>
        </div>
        <span className="text-xs text-white/70">Media Desktop v3.2.7</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-xs bg-black/30 px-2 py-1 rounded">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span>FastTrack Network</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#3d2266] p-2 border-b border-purple-700">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-[#1a0f2e] border border-purple-500 rounded px-2">
            <Search className="w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search the FastTrack network..."
              className="flex-1 px-2 py-1 text-xs outline-none bg-transparent text-white placeholder-purple-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-3 py-1 rounded text-xs font-bold">
            Search
          </button>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-purple-300">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name="type" defaultChecked className="accent-orange-500" /> All
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name="type" className="accent-orange-500" /> Audio
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name="type" className="accent-orange-500" /> Video
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name="type" className="accent-orange-500" /> Software
          </label>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-[#4a2c7a] sticky top-0">
            <tr>
              <th className="text-left p-2 text-purple-200">Filename</th>
              <th className="text-left p-2 text-purple-200">Type</th>
              <th className="text-left p-2 text-purple-200">Size</th>
              <th className="text-left p-2 text-purple-200">Speed</th>
              <th className="text-left p-2 text-purple-200 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file, i) => (
              <tr 
                key={file.id} 
                className={`border-b border-purple-800/50 hover:bg-purple-900/50 ${
                  i % 2 === 0 ? 'bg-[#2d1b4e]' : 'bg-[#251745]'
                } ${file.isSketch ? 'text-orange-300' : 'text-gray-200'}`}
              >
                <td className="p-2 flex items-center gap-2">
                  {getIcon(file.type)}
                  <span className="truncate max-w-[160px]" title={file.name}>
                    {file.name}
                  </span>
                  {file.isSketch && <AlertTriangle className="w-3 h-3 text-orange-500" />}
                </td>
                <td className="p-2 capitalize">{file.type}</td>
                <td className="p-2">{file.size}</td>
                <td className="p-2">
                  <span className={getSpeedColor(file.speed)}>{file.speed}</span>
                </td>
                <td className="p-2">
                  {isDownloaded(file.id) ? (
                    <span className="text-green-400 text-xs">✓ In Winamp</span>
                  ) : file.status === 'available' ? (
                    <button 
                      onClick={() => startDownload(file.id)}
                      className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 px-2 py-0.5 rounded text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  ) : file.status === 'downloading' ? (
                    <div className="w-full bg-purple-900 rounded h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  ) : (
                    <span className="text-green-400 text-xs">✓ Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="bg-[#1a0f2e] border-t border-purple-700 px-3 py-2 text-xs flex justify-between items-center">
        <div className="flex items-center gap-3 text-purple-300">
          <span>🌐 2,456 users online</span>
          <span>|</span>
          <span>📁 847,234 files shared</span>
        </div>
        <div className="flex items-center gap-2 text-orange-400">
          <span>⚠️ Parental Advisory: May contain spyware</span>
        </div>
      </div>

      {/* BonziBuddy - The infamous purple gorilla appears in sketchy apps */}
      {bloatEnabled && showBonzi && (
        <div className="absolute bottom-12 right-2">
          <BonziBuddy onDismiss={() => setShowBonzi(false)} />
        </div>
      )}

      {/* Popup Ads */}
      {bloatEnabled && popupAds.map(id => (
        <PopupAd key={id} onClose={() => closePopupAd(id)} />
      ))}
    </div>
  );
};

export default KazaaApp;
