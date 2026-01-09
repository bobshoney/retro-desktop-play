import React, { useState } from 'react';
import { Download, Music, Search, User } from 'lucide-react';
import { useDownloads } from '@/contexts/DownloadsContext';

interface Track {
  id: number;
  title: string;
  artist: string;
  size: string;
  bitrate: string;
  status: 'available' | 'downloading' | 'complete';
  progress: number;
  audioUrl: string;
  duration: string;
}

const NapsterApp: React.FC = () => {
  const { addDownload, downloads } = useDownloads();
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, title: 'Windows XP Startup', artist: 'Microsoft', size: '142 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/xp-startup.mp3', duration: '0:04' },
    { id: 2, title: 'XP Logon Sound', artist: 'Microsoft', size: '189 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/xp-logon.mp3', duration: '0:05' },
    { id: 3, title: 'XP Chord', artist: 'Microsoft', size: '98 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/xp-chord.mp3', duration: '0:02' },
    { id: 4, title: 'XP Ding', artist: 'Microsoft', size: '45 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/xp-ding.mp3', duration: '0:01' },
    { id: 5, title: 'XP Notify', artist: 'Microsoft', size: '67 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/xp-notify.mp3', duration: '0:01' },
    { id: 6, title: 'AOL Welcome', artist: 'America Online', size: '89 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/aol-welcome.ogg', duration: '0:02' },
    { id: 7, title: 'You Got Mail', artist: 'America Online', size: '54 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/aol-youvegotmail.ogg', duration: '0:01' },
    { id: 8, title: 'Buddy Sign On', artist: 'America Online', size: '32 KB', bitrate: '128 kbps', status: 'available', progress: 0, audioUrl: '/sounds/aol-buddyin.ogg', duration: '0:01' },
  ]);

  const isDownloaded = (trackId: number) => {
    return downloads.some(d => d.id === `napster-${trackId}`);
  };

  const startDownload = (id: number) => {
    const track = tracks.find(t => t.id === id);
    if (!track || isDownloaded(id)) return;

    setTracks(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'downloading' as const, progress: 0 } : t
    ));

    const interval = setInterval(() => {
      setTracks(prev => {
        const currentTrack = prev.find(t => t.id === id);
        if (!currentTrack || currentTrack.progress >= 100) {
          clearInterval(interval);
          // Add to downloads when complete
          if (track) {
            addDownload({
              id: `napster-${id}`,
              title: track.title,
              artist: track.artist,
              source: 'napster',
              audioUrl: track.audioUrl,
              duration: track.duration,
            });
          }
          return prev.map(t => 
            t.id === id ? { ...t, status: 'complete' as const, progress: 100 } : t
          );
        }
        return prev.map(t => 
          t.id === id ? { ...t, progress: Math.min(t.progress + Math.random() * 15, 100) } : t
        );
      });
    }, 500);
  };

  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#1a1a2e] text-white font-xp text-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e94560] to-[#ff6b6b] p-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Music className="w-5 h-5 text-[#e94560]" />
          </div>
          <span className="font-bold text-lg">Napster</span>
        </div>
        <div className="flex-1 flex items-center bg-white rounded px-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search for music..."
            className="flex-1 px-2 py-1 text-black text-xs outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-[#16213e] px-3 py-1 flex items-center gap-4 text-xs border-b border-[#0f3460]">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" /> 2,847 users online
        </span>
        <span>|</span>
        <span>4,234,567 songs shared</span>
        <span>|</span>
        <span className="text-green-400">📥 {downloads.filter(d => d.source === 'napster').length} downloaded</span>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-[#0f3460] sticky top-0">
            <tr>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Artist</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Bitrate</th>
              <th className="text-left p-2 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTracks.map((track, i) => (
              <tr 
                key={track.id} 
                className={`border-b border-[#0f3460] hover:bg-[#0f3460] ${i % 2 === 0 ? 'bg-[#1a1a2e]' : 'bg-[#16213e]'}`}
              >
                <td className="p-2 flex items-center gap-2">
                  <Music className="w-3 h-3 text-[#e94560]" />
                  {track.title}
                </td>
                <td className="p-2">{track.artist}</td>
                <td className="p-2">{track.size}</td>
                <td className="p-2">{track.bitrate}</td>
                <td className="p-2">
                  {isDownloaded(track.id) ? (
                    <span className="text-green-400 text-xs">✓ In Winamp</span>
                  ) : track.status === 'available' ? (
                    <button 
                      onClick={() => startDownload(track.id)}
                      className="flex items-center gap-1 bg-[#e94560] hover:bg-[#ff6b6b] px-2 py-0.5 rounded text-xs"
                    >
                      <Download className="w-3 h-3" /> Get
                    </button>
                  ) : track.status === 'downloading' ? (
                    <div className="w-full bg-[#0f3460] rounded h-4 overflow-hidden">
                      <div 
                        className="h-full bg-[#e94560] transition-all duration-300"
                        style={{ width: `${track.progress}%` }}
                      />
                    </div>
                  ) : (
                    <span className="text-green-400 text-xs">✓ Complete</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-[#0f3460] px-3 py-2 text-xs text-gray-400 flex justify-between">
        <span>⚠️ Remember: Sharing copyrighted music is illegal... but this is just a simulation! 🎵</span>
        <span className="text-green-400">Open Winamp to play downloads →</span>
      </div>
    </div>
  );
};

export default NapsterApp;
