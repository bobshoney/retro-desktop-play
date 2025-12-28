import React from 'react';
import { 
  Monitor, 
  Volume2, 
  Wifi, 
  Shield, 
  Users, 
  Printer, 
  Clock, 
  Globe, 
  Palette, 
  Keyboard, 
  Mouse, 
  HardDrive,
  Settings
} from 'lucide-react';

const controlItems = [
  { icon: Monitor, label: 'Display', description: 'Change display settings' },
  { icon: Volume2, label: 'Sounds and Audio', description: 'Configure audio settings' },
  { icon: Wifi, label: 'Network Connections', description: 'View network status' },
  { icon: Shield, label: 'Security Center', description: 'Check security status' },
  { icon: Users, label: 'User Accounts', description: 'Manage user accounts' },
  { icon: Printer, label: 'Printers and Faxes', description: 'View printers' },
  { icon: Clock, label: 'Date and Time', description: 'Set date and time' },
  { icon: Globe, label: 'Internet Options', description: 'Configure internet settings' },
  { icon: Palette, label: 'Appearance', description: 'Customize appearance' },
  { icon: Keyboard, label: 'Keyboard', description: 'Keyboard settings' },
  { icon: Mouse, label: 'Mouse', description: 'Mouse settings' },
  { icon: HardDrive, label: 'System', description: 'View system information' },
];

const ControlPanelApp: React.FC = () => {
  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      <div className="w-48 bg-gradient-to-b from-blue-50 to-blue-100 border-r p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-bold text-sm text-blue-800">Control Panel</h2>
            <p className="text-xs text-gray-600">Category View</p>
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="font-bold text-blue-700">See Also</div>
          <div className="text-blue-600 hover:underline cursor-pointer">Windows Update</div>
          <div className="text-blue-600 hover:underline cursor-pointer">Help and Support</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <h1 className="text-lg font-bold text-gray-800 mb-4">Pick a category</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {controlItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 hover:bg-blue-50 cursor-pointer rounded-lg border border-transparent hover:border-blue-200 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-blue-700 hover:underline">{item.label}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanelApp;