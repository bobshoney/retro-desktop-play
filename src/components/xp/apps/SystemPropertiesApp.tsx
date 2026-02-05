import React, { useState } from 'react';
import { Monitor, Cpu, HardDrive, MemoryStick } from 'lucide-react';

const SystemPropertiesApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'computer', label: 'Computer Name' },
    { id: 'hardware', label: 'Hardware' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'remote', label: 'Remote' },
  ];

  // Generate random-ish specs
  const computerName = 'DESKTOP-XP2003';
  const userName = 'Administrator';
  const ramAmount = '512 MB';
  const cpuSpeed = '2.40 GHz';
  const registeredTo = localStorage.getItem('xp-user-name') || 'User';

  return (
    <div className="h-full flex flex-col bg-[#ece9d8]">
      {/* Tabs */}
      <div className="flex px-2 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-xs border border-b-0 rounded-t ${
              activeTab === tab.id 
                ? 'bg-[#ece9d8] border-gray-400 -mb-px z-10' 
                : 'bg-[#d4d0c4] border-gray-400 hover:bg-[#e4e0d4]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 mx-2 mb-2 p-4 border border-gray-400 bg-[#ece9d8] overflow-auto">
        {activeTab === 'general' && (
          <div className="space-y-4">
            {/* System Info Header */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {/* Windows Logo */}
                <div className="w-24 h-24 bg-gradient-to-br from-[#245edc] to-[#1a4cb0] rounded-lg flex items-center justify-center shadow-lg">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-8 h-8 bg-[#f65314] rounded-tl-lg"></div>
                    <div className="w-8 h-8 bg-[#7cbb00] rounded-tr-lg"></div>
                    <div className="w-8 h-8 bg-[#00a1f1] rounded-bl-lg"></div>
                    <div className="w-8 h-8 bg-[#ffbb00] rounded-br-lg"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-[#003399]">Microsoft Windows XP</div>
                <div className="text-sm text-gray-700">Professional</div>
                <div className="text-xs text-gray-600 mt-1">Version 2002</div>
                <div className="text-xs text-gray-600">Service Pack 3</div>
              </div>
            </div>

            <div className="border-t border-gray-400 pt-4">
              <div className="text-xs text-gray-700 mb-1">Registered to:</div>
              <div className="text-sm font-bold">{registeredTo}</div>
              <div className="text-xs text-gray-600 mt-1">55274-640-1234567-23456</div>
            </div>

            <div className="border-t border-gray-400 pt-4 space-y-2">
              <div className="text-xs text-gray-700 mb-2">Computer:</div>
              
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-600" />
                <div className="text-xs">
                  <span className="font-medium">Intel(R) Pentium(R) 4 CPU</span>
                  <span className="text-gray-600 ml-2">{cpuSpeed}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MemoryStick className="w-4 h-4 text-gray-600" />
                <div className="text-xs">
                  <span className="text-gray-600">{ramAmount} of RAM</span>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="border-t border-gray-400 pt-4">
              <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                Support Information...
              </button>
            </div>
          </div>
        )}

        {activeTab === 'computer' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-12 h-12 text-gray-600" />
              <div>
                <div className="text-sm font-bold">Windows uses the following information to identify your computer on the network.</div>
              </div>
            </div>

            <div className="space-y-3 p-3 bg-white border border-gray-300 rounded">
              <div className="flex items-center gap-2">
                <span className="text-xs w-32">Computer description:</span>
                <input 
                  type="text" 
                  defaultValue="Home Computer"
                  className="flex-1 px-2 py-1 text-xs border border-gray-400"
                />
              </div>
              <div className="text-xs text-gray-600">
                For example: "Kitchen Computer" or "Mary's Computer"
              </div>
              
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs w-32">Full computer name:</span>
                  <span className="text-xs font-mono">{computerName}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs w-32">Workgroup:</span>
                  <span className="text-xs font-mono">WORKGROUP</span>
                </div>
              </div>
            </div>

            <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
              Network ID...
            </button>
            <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded ml-2">
              Change...
            </button>
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="space-y-4">
            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="text-sm font-bold mb-2">Add Hardware Wizard</div>
              <div className="text-xs text-gray-600 mb-2">
                The Add Hardware Wizard helps you install hardware.
              </div>
              <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                Add Hardware Wizard
              </button>
            </div>

            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="text-sm font-bold mb-2">Device Manager</div>
              <div className="text-xs text-gray-600 mb-2">
                The Device Manager lists all the hardware devices installed on your computer.
              </div>
              <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                Device Manager
              </button>
            </div>

            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="text-sm font-bold mb-2">Driver Signing</div>
              <div className="text-xs text-gray-600 mb-2">
                Driver signing lets you make sure that installed drivers have been tested for Windows XP compatibility.
              </div>
              <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                Driver Signing
              </button>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-3">
            <div className="text-xs text-gray-600 mb-2">
              You must be logged on as an Administrator to make most of these changes.
            </div>

            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold">Performance</div>
                  <div className="text-xs text-gray-600">Visual effects, processor scheduling, memory usage, and virtual memory</div>
                </div>
                <button className="px-3 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                  Settings
                </button>
              </div>
            </div>

            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold">User Profiles</div>
                  <div className="text-xs text-gray-600">Desktop settings related to your logon</div>
                </div>
                <button className="px-3 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                  Settings
                </button>
              </div>
            </div>

            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold">Startup and Recovery</div>
                  <div className="text-xs text-gray-600">System startup, system failure, and debugging information</div>
                </div>
                <button className="px-3 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                  Settings
                </button>
              </div>
            </div>

            <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
              Environment Variables
            </button>
            <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded ml-2">
              Error Reporting
            </button>
          </div>
        )}

        {activeTab === 'remote' && (
          <div className="space-y-4">
            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="text-sm font-bold mb-2">Remote Assistance</div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" defaultChecked />
                <span className="text-xs text-gray-700">
                  Allow Remote Assistance invitations to be sent from this computer
                </span>
              </label>
              <button className="mt-2 px-3 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                Advanced...
              </button>
            </div>

            <div className="p-3 border border-gray-300 rounded bg-white">
              <div className="text-sm font-bold mb-2">Remote Desktop</div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-xs text-gray-700">
                  Allow users to connect remotely to this computer
                </span>
              </label>
              <button className="mt-2 px-3 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
                Select Remote Users...
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-end gap-2 px-2 pb-2">
        <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
          OK
        </button>
        <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
          Cancel
        </button>
        <button className="px-4 py-1 text-xs bg-[#ece9d8] border border-gray-400 hover:bg-[#ddd9c8] rounded">
          Apply
        </button>
      </div>
    </div>
  );
};

export default SystemPropertiesApp;
