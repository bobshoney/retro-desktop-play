import React, { useState } from 'react';
import { Download, Music, Search, User, Pause, Play } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  size: string;
  bitrate: string;
  status: 'available' | 'downloading' | 'complete';
  progress: number;
}

const NapsterApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, title: 'Californication', artist: 'Red Hot Chili Peppers', size: '4.2 MB', bitrate: '128 kbps', status: 'available', progress: 0 },
    { id: 2, title: 'In The End', artist: 'Linkin Park', size: '3.8 MB', bitrate: '128 kbps', status: 'available', progress: 0 },
    { id: 3, title: 'Bring Me To Life', artist: 'Evanescence', size: '4.1 MB', bitrate: '128 kbps', status: 'available', progress: 0 },
    { id: 4, title: 'Lose Yourself', artist: 'Eminem', size: '5.2 MB', bitrate: '192 kbps', status: 'available', progress: 0 },
    { id: 5, title: 'Crazy In Love', artist: 'Beyonce ft. Jay-Z', size: '3.9 MB', bitrate: '128 kbps', status: 'available', progress: 0 },
    { id: 6, title: 'Hey Ya!', artist: 'OutKast', size: '4.0 MB', bitrate: '128 kbps', status: 'available', progress: 0 },
    { id: 7, title: 'Mr. Brightside', artist: 'The Killers', size: '3.7 MB', bitrate: '128 kbps', status: 'available', progress: 0 },
    { id: 8, title: 'Boulevard of Broken Dreams', artist: 'Green Day', size: '4.5 MB', bitrate: '192 kbps', status: 'available', progress: 0 },
  ]);

  const startDownload = (id: number) => {
    setTracks(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'downloading' as const, progress: 0 } : t
    ));

    const interval = setInterval(() => {
      setTracks(prev => {
        const track = prev.find(t => t.id === id);
        if (!track || track.progress >= 100) {
          clearInterval(interval);
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
              <th className="text-left p-2 w-24">Action</th>
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
                  {track.status === 'available' && (
                    <button 
                      onClick={() => startDownload(track.id)}
                      className="flex items-center gap-1 bg-[#e94560] hover:bg-[#ff6b6b] px-2 py-0.5 rounded text-xs"
                    >
                      <Download className="w-3 h-3" /> Get
                    </button>
                  )}
                  {track.status === 'downloading' && (
                    <div className="w-full bg-[#0f3460] rounded h-4 overflow-hidden">
                      <div 
                        className="h-full bg-[#e94560] transition-all duration-300"
                        style={{ width: `${track.progress}%` }}
                      />
                    </div>
                  )}
                  {track.status === 'complete' && (
                    <span className="text-green-400 text-xs">✓ Complete</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-[#0f3460] px-3 py-2 text-xs text-gray-400">
        ⚠️ Remember: Sharing copyrighted music is illegal... but this is just a simulation! 🎵
      </div>
    </div>
  );
};

export default NapsterApp;
