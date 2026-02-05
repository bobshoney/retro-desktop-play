import React from 'react';
import { HardDrive, Disc, Save, Usb, Monitor } from 'lucide-react';
import { useWindows } from '@/pages/Index';

interface DriveInfo {
  id: string;
  name: string;
  letter: string;
  type: 'hdd' | 'cd' | 'floppy' | 'usb';
  totalSpace: string;
  freeSpace: string;
  usedPercent: number;
}

const drives: DriveInfo[] = [
  { id: 'c', name: 'Local Disk', letter: 'C:', type: 'hdd', totalSpace: '39.9 GB', freeSpace: '12.4 GB', usedPercent: 69 },
  { id: 'd', name: 'Local Disk', letter: 'D:', type: 'hdd', totalSpace: '80.0 GB', freeSpace: '54.2 GB', usedPercent: 32 },
  { id: 'e', name: 'CD Drive', letter: 'E:', type: 'cd', totalSpace: '', freeSpace: '', usedPercent: 0 },
  { id: 'a', name: '3½ Floppy', letter: 'A:', type: 'floppy', totalSpace: '1.44 MB', freeSpace: '1.44 MB', usedPercent: 0 },
];

const MyComputerApp: React.FC = () => {
  const { openWindow } = useWindows();

  const getDriveIcon = (type: string) => {
    switch (type) {
      case 'hdd':
        return <HardDrive className="w-8 h-8 text-gray-600" />;
      case 'cd':
        return <Disc className="w-8 h-8 text-gray-500" />;
      case 'floppy':
        return <Save className="w-8 h-8 text-gray-500" />;
      case 'usb':
        return <Usb className="w-8 h-8 text-gray-600" />;
      default:
        return <HardDrive className="w-8 h-8 text-gray-600" />;
    }
  };

  const handleDriveDoubleClick = (drive: DriveInfo) => {
    if (drive.letter === 'C:' || drive.letter === 'D:') {
      openWindow('mydocuments', `${drive.name} (${drive.letter})`, 'mydocuments', undefined, 600, 450);
    }
  };

  const handleSystemProperties = () => {
    openWindow('sysprops', 'System Properties', 'sysprops', undefined, 400, 450);
  };

  return (
    <div className="h-full flex bg-white">
      {/* Left Panel - Tasks */}
      <div className="w-48 bg-gradient-to-b from-[#6b88c7] to-[#4e6eb5] p-2 flex-shrink-0 border-r border-[#4e6eb5]">
        {/* System Tasks */}
        <div className="bg-white/90 rounded mb-2 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0054e3] to-[#2b7eff] text-white text-xs font-bold px-2 py-1">
            System Tasks
          </div>
          <div className="p-2 space-y-1">
            <button 
              onClick={handleSystemProperties}
              className="w-full text-left text-xs text-[#0054e3] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Monitor className="w-3 h-3" />
              View system information
            </button>
            <button className="w-full text-left text-xs text-[#0054e3] hover:underline cursor-pointer">
              Add or remove programs
            </button>
            <button className="w-full text-left text-xs text-[#0054e3] hover:underline cursor-pointer">
              Change a setting
            </button>
          </div>
        </div>

        {/* Other Places */}
        <div className="bg-white/90 rounded overflow-hidden">
          <div className="bg-gradient-to-r from-[#0054e3] to-[#2b7eff] text-white text-xs font-bold px-2 py-1">
            Other Places
          </div>
          <div className="p-2 space-y-1">
            <button 
              onClick={() => openWindow('mydocuments', 'My Documents', 'mydocuments', undefined, 600, 450)}
              className="w-full text-left text-xs text-[#0054e3] hover:underline cursor-pointer"
            >
              My Documents
            </button>
            <button 
              onClick={() => openWindow('mypictures', 'My Pictures', 'mypictures', undefined, 600, 450)}
              className="w-full text-left text-xs text-[#0054e3] hover:underline cursor-pointer"
            >
              Shared Documents
            </button>
            <button 
              onClick={() => openWindow('controlpanel', 'Control Panel', 'controlpanel', undefined, 450, 400)}
              className="w-full text-left text-xs text-[#0054e3] hover:underline cursor-pointer"
            >
              Control Panel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Address Bar */}
        <div className="flex items-center gap-2 px-2 py-1 bg-[#ece9d8] border-b border-gray-300">
          <span className="text-xs text-gray-600">Address</span>
          <div className="flex-1 flex items-center gap-1 bg-white border border-gray-400 px-2 py-0.5">
            <Monitor className="w-4 h-4 text-gray-600" />
            <span className="text-xs">My Computer</span>
          </div>
        </div>

        <div className="p-4">
          {/* Hard Disk Drives */}
          <div className="mb-6">
            <div className="text-xs font-bold text-gray-600 mb-2 border-b border-gray-300 pb-1">
              Hard Disk Drives
            </div>
            <div className="flex flex-wrap gap-4">
              {drives.filter(d => d.type === 'hdd').map((drive) => (
                <div
                  key={drive.id}
                  className="w-52 p-2 hover:bg-blue-100 rounded cursor-pointer select-none"
                  onDoubleClick={() => handleDriveDoubleClick(drive)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getDriveIcon(drive.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">
                        {drive.name} ({drive.letter})
                      </div>
                      {/* Space bar */}
                      <div className="mt-1 h-3 bg-gray-200 border border-gray-400 rounded-sm overflow-hidden">
                        <div 
                          className={`h-full ${drive.usedPercent > 80 ? 'bg-red-500' : 'bg-blue-600'}`}
                          style={{ width: `${drive.usedPercent}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {drive.freeSpace} free of {drive.totalSpace}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices with Removable Storage */}
          <div className="mb-6">
            <div className="text-xs font-bold text-gray-600 mb-2 border-b border-gray-300 pb-1">
              Devices with Removable Storage
            </div>
            <div className="flex flex-wrap gap-4">
              {drives.filter(d => d.type === 'floppy' || d.type === 'cd').map((drive) => (
                <div
                  key={drive.id}
                  className="w-40 p-3 hover:bg-blue-100 rounded cursor-pointer select-none text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    {getDriveIcon(drive.type)}
                    <div className="text-xs">
                      {drive.name} ({drive.letter})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComputerApp;
