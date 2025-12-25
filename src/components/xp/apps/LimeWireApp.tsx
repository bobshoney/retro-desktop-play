import React, { useState } from 'react';
import { Download, Search, AlertTriangle, Zap, File, Music, Film, Image } from 'lucide-react';

interface TorrentFile {
  id: number;
  name: string;
  type: 'music' | 'video' | 'software' | 'other';
  size: string;
  seeds: number;
  status: 'available' | 'downloading' | 'complete' | 'virus';
  progress: number;
  isVirus: boolean;
}

const LimeWireApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<TorrentFile[]>([
    { id: 1, name: 'linkin_park_meteora_full_album.zip', type: 'music', size: '89.4 MB', seeds: 234, status: 'available', progress: 0, isVirus: false },
    { id: 2, name: 'totally_legit_photoshop_cs2.exe', type: 'software', size: '12.3 MB', seeds: 45, status: 'available', progress: 0, isVirus: true },
    { id: 3, name: 'the_matrix_dvdrip_xvid.avi', type: 'video', size: '702 MB', seeds: 567, status: 'available', progress: 0, isVirus: false },
    { id: 4, name: 'definitely_not_a_virus.exe', type: 'other', size: '43 KB', seeds: 12, status: 'available', progress: 0, isVirus: true },
    { id: 5, name: 'nelly_hot_in_herre.mp3', type: 'music', size: '4.2 MB', seeds: 89, status: 'available', progress: 0, isVirus: false },
    { id: 6, name: 'spiderman_2002_cam_quality.avi', type: 'video', size: '1.2 GB', seeds: 23, status: 'available', progress: 0, isVirus: false },
    { id: 7, name: 'kazaa_lite_resurrection.exe', type: 'software', size: '8.7 MB', seeds: 156, status: 'available', progress: 0, isVirus: true },
    { id: 8, name: 'age_of_empires_2_nocd_crack.exe', type: 'software', size: '234 KB', seeds: 432, status: 'available', progress: 0, isVirus: false },
    { id: 9, name: 'limewire_pro_free_download.exe', type: 'software', size: '1.2 MB', seeds: 3, status: 'available', progress: 0, isVirus: true },
    { id: 10, name: 'shrek_2_screener.avi', type: 'video', size: '698 MB', seeds: 789, status: 'available', progress: 0, isVirus: false },
  ]);

  const [virusAlert, setVirusAlert] = useState<string | null>(null);

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

    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'downloading' as const, progress: 0 } : f
    ));

    const interval = setInterval(() => {
      setFiles(prev => {
        const currentFile = prev.find(f => f.id === id);
        if (!currentFile || currentFile.progress >= 100) {
          clearInterval(interval);
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
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              <th className="text-left p-1 w-24">Status</th>
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
                  {file.status === 'available' && (
                    <button 
                      onClick={() => startDownload(file.id)}
                      className="flex items-center gap-1 bg-[#7bc043] hover:bg-[#4a8f29] text-white px-2 py-0.5 rounded text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  )}
                  {file.status === 'downloading' && (
                    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                      <div 
                        className="h-full bg-[#7bc043] transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.status === 'complete' && (
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
        <span>Downloads: 0 | Uploads: 0</span>
        <span>⚡ 56.6 kbps (simulated dial-up experience)</span>
      </div>
    </div>
  );
};

export default LimeWireApp;
