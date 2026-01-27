import { useState, useEffect } from 'react';
import { Download, Search, AlertTriangle, Zap, File, Music, Film } from 'lucide-react';
import { useDownloads } from '@/contexts/DownloadsContext';
import BonziBuddy from '../BonziBuddy';
import PopupAd from '../PopupAd';

interface TorrentFile {
  id: number;
  name: string;
  displayName: string;
  artist: string;
  type: 'music' | 'video' | 'software' | 'other';
  size: string;
  seeds: number;
  status: 'available' | 'downloading' | 'complete' | 'virus';
  progress: number;
  isVirus: boolean;
  audioUrl?: string;
  duration?: string;
}

const LimeWireApp: React.FC = () => {
  const { addDownload, downloads } = useDownloads();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBonzi, setShowBonzi] = useState(true);
  const [popupAds, setPopupAds] = useState<number[]>([]);
  const [files, setFiles] = useState<TorrentFile[]>([
    { id: 1, name: 'xp_startup_sound.mp3', displayName: 'Windows XP Startup', artist: 'Microsoft', type: 'music', size: '142 KB', seeds: 234, status: 'available', progress: 0, isVirus: false, audioUrl: '/sounds/xp-startup.mp3', duration: '0:04' },
    { id: 2, name: 'totally_legit_photoshop_cs2.exe', displayName: 'Photoshop CS2', artist: 'Adobe', type: 'software', size: '12.3 MB', seeds: 45, status: 'available', progress: 0, isVirus: true },
    { id: 3, name: 'xp_error_sound.mp3', displayName: 'XP Error Sound', artist: 'Microsoft', type: 'music', size: '98 KB', seeds: 567, status: 'available', progress: 0, isVirus: false, audioUrl: '/sounds/xp-error.mp3', duration: '0:02' },
    { id: 4, name: 'definitely_not_a_virus.exe', displayName: 'Free Money Generator', artist: 'Unknown', type: 'other', size: '43 KB', seeds: 12, status: 'available', progress: 0, isVirus: true },
    { id: 5, name: 'xp_critical_stop.mp3', displayName: 'XP Critical Stop', artist: 'Microsoft', type: 'music', size: '76 KB', seeds: 89, status: 'available', progress: 0, isVirus: false, audioUrl: '/sounds/xp-critical.mp3', duration: '0:02' },
    { id: 6, name: 'aol_goodbye.ogg', displayName: 'AOL Goodbye', artist: 'America Online', type: 'music', size: '45 KB', seeds: 123, status: 'available', progress: 0, isVirus: false, audioUrl: '/sounds/aol-goodbye.ogg', duration: '0:01' },
    { id: 7, name: 'kazaa_lite_resurrection.exe', displayName: 'Kazaa Lite', artist: 'Unknown', type: 'software', size: '8.7 MB', seeds: 156, status: 'available', progress: 0, isVirus: true },
    { id: 8, name: 'xp_recycle.mp3', displayName: 'XP Recycle', artist: 'Microsoft', type: 'music', size: '52 KB', seeds: 432, status: 'available', progress: 0, isVirus: false, audioUrl: '/sounds/xp-recycle.mp3', duration: '0:01' },
    { id: 9, name: 'limewire_pro_free_download.exe', displayName: 'LimeWire Pro FREE', artist: 'Unknown', type: 'software', size: '1.2 MB', seeds: 3, status: 'available', progress: 0, isVirus: true },
    { id: 10, name: 'aol_im_sound.ogg', displayName: 'AOL IM Notification', artist: 'America Online', type: 'music', size: '34 KB', seeds: 789, status: 'available', progress: 0, isVirus: false, audioUrl: '/sounds/aol-im.ogg', duration: '0:01' },
  ]);

  const [virusAlert, setVirusAlert] = useState<string | null>(null);

  // Random popup ads
  useEffect(() => {
    const spawnAd = () => {
      if (Math.random() < 0.4 && popupAds.length < 3) {
        setPopupAds(prev => [...prev, Date.now()]);
      }
    };
    
    const timer = setTimeout(spawnAd, 3000 + Math.random() * 5000);
    const interval = setInterval(spawnAd, 12000 + Math.random() * 18000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [popupAds.length]);

  const closePopupAd = (id: number) => {
    // 40% chance to spawn another ad when closing (LimeWire was notorious for this!)
    if (Math.random() < 0.4 && popupAds.length < 4) {
      setPopupAds(prev => [...prev.filter(p => p !== id), Date.now()]);
    } else {
      setPopupAds(prev => prev.filter(p => p !== id));
    }
  };

  const isDownloaded = (fileId: number) => {
    return downloads.some(d => d.id === `limewire-${fileId}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'music': return <Music className="w-4 h-4 text-green-500" />;
      case 'video': return <Film className="w-4 h-4 text-blue-500" />;
      case 'software': return <File className="w-4 h-4 text-yellow-500" />;
      default: return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const startDownload = (id: number) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    if (file.isVirus) {
      setVirusAlert(file.name);
      setTimeout(() => setVirusAlert(null), 3000);
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
          // Add music files to downloads when complete
          if (file.type === 'music' && file.audioUrl) {
            addDownload({
              id: `limewire-${id}`,
              title: file.displayName,
              artist: file.artist,
              source: 'limewire',
              audioUrl: file.audioUrl,
              duration: file.duration || '0:00',
            });
          }
          return prev.map(f => 
            f.id === id ? { ...f, status: 'complete' as const, progress: 100 } : f
          );
        }
        return prev.map(f => 
          f.id === id ? { ...f, progress: Math.min(f.progress + Math.random() * 10, 100) } : f
        );
      });
    }, 600);
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#f0f0f0] font-xp text-sm">
      {/* Virus Alert Modal */}
      {virusAlert && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded shadow-lg p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <span className="font-bold text-red-600">VIRUS DETECTED!</span>
            </div>
            <p className="text-xs mb-3">
              Norton AntiVirus has blocked:<br />
              <span className="font-mono text-red-600">{virusAlert}</span><br /><br />
              Threat: Trojan.Win32.FakeDownload<br />
              Status: Quarantined
            </p>
            <p className="text-xs text-gray-600 italic">
              (Just like the good old days! 🦠)
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#7bc043] to-[#4a8f29] p-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-300" />
          <span className="font-bold text-white text-lg">LimeWire</span>
        </div>
        <span className="text-xs text-white/80">v4.18.8</span>
      </div>

      {/* Search */}
      <div className="bg-[#ece9d8] p-2 border-b border-gray-400">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-white border border-gray-400 rounded px-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search for files..."
              className="flex-1 px-2 py-1 text-xs outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="xp-button text-xs">Search</button>
        </div>
        <div className="flex gap-3 mt-2 text-xs">
          <label className="flex items-center gap-1">
            <input type="checkbox" defaultChecked /> Audio
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" defaultChecked /> Video
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" defaultChecked /> Programs
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" /> Images
          </label>
          <span className="ml-auto text-green-600">📥 {downloads.filter(d => d.source === 'limewire').length} in Winamp</span>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto bg-white border-2 inset m-1">
        <table className="w-full text-xs">
          <thead className="bg-[#ece9d8] sticky top-0 border-b border-gray-400">
            <tr>
              <th className="text-left p-1 pl-2">Name</th>
              <th className="text-left p-1">Type</th>
              <th className="text-left p-1">Size</th>
              <th className="text-left p-1">Seeds</th>
              <th className="text-left p-1 w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file, i) => (
              <tr 
                key={file.id} 
                className={`border-b hover:bg-blue-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${file.isVirus ? 'text-red-600' : ''}`}
              >
                <td className="p-1 pl-2 flex items-center gap-2">
                  {getIcon(file.type)}
                  <span className="truncate max-w-[180px]" title={file.name}>
                    {file.name}
                  </span>
                  {file.isVirus && <AlertTriangle className="w-3 h-3 text-red-500" />}
                </td>
                <td className="p-1 capitalize">{file.type}</td>
                <td className="p-1">{file.size}</td>
                <td className="p-1">
                  <span className={file.seeds > 100 ? 'text-green-600' : file.seeds > 30 ? 'text-yellow-600' : 'text-red-600'}>
                    {file.seeds}
                  </span>
                </td>
                <td className="p-1">
                  {isDownloaded(file.id) ? (
                    <span className="text-green-600 text-xs">✓ In Winamp</span>
                  ) : file.status === 'available' ? (
                    <button 
                      onClick={() => startDownload(file.id)}
                      className="flex items-center gap-1 bg-[#7bc043] hover:bg-[#4a8f29] text-white px-2 py-0.5 rounded text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  ) : file.status === 'downloading' ? (
                    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                      <div 
                        className="h-full bg-[#7bc043] transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  ) : (
                    <span className="text-green-600 text-xs">✓ Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-2 py-1 text-xs flex justify-between text-gray-600">
        <span>Downloads: {downloads.filter(d => d.source === 'limewire').length} | Uploads: 0</span>
        <span>⚡ 56.6 kbps (simulated dial-up experience) | Open Winamp to play →</span>
      </div>

      {/* BonziBuddy - The infamous purple gorilla */}
      {showBonzi && (
        <div className="absolute bottom-12 right-2">
          <BonziBuddy onDismiss={() => setShowBonzi(false)} />
        </div>
      )}

      {/* Popup Ads */}
      {popupAds.map(id => (
        <PopupAd key={id} onClose={() => closePopupAd(id)} />
      ))}
    </div>
  );
};

export default LimeWireApp;
