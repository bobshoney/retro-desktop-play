import React, { useState } from 'react';
import { HelpCircle, Search, Home, ChevronRight, Book, Monitor, Shield, Wifi, Printer } from 'lucide-react';

const helpTopics = [
  { icon: Monitor, title: 'What\'s new in Windows XP', items: ['New features', 'Getting started', 'Tutorials'] },
  { icon: Shield, title: 'Security and privacy', items: ['Firewall settings', 'User accounts', 'Password protection'] },
  { icon: Wifi, title: 'Networking and the Web', items: ['Connect to internet', 'Share files', 'Email setup'] },
  { icon: Printer, title: 'Printing and faxing', items: ['Add a printer', 'Print documents', 'Troubleshoot printing'] },
  { icon: Book, title: 'Working with files', items: ['Save files', 'Find files', 'Organize folders'] },
];

const HelpApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
        <div className="flex items-center gap-3 mb-3">
          <HelpCircle className="w-8 h-8 text-white" />
          <h1 className="text-white font-bold text-lg">Help and Support Center</h1>
        </div>
        
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white rounded px-3 py-1">
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm outline-none"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <button className="bg-green-700 text-white px-4 py-1 rounded text-sm hover:bg-green-800">
            Search
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b text-sm">
        <button className="flex items-center gap-1 text-green-700 hover:underline">
          <Home className="w-4 h-4" />
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-600">Pick a Help topic</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <h2 className="font-bold text-gray-800 mb-4">Pick a Help topic</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {helpTopics.map((topic, index) => (
            <div key={index} className="border rounded-lg p-3 hover:bg-green-50 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <topic.icon className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-green-700">{topic.title}</h3>
              </div>
              <ul className="ml-9 space-y-1">
                {topic.items.map((item, i) => (
                  <li key={i} className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-100 border-t text-xs text-gray-600">
        Windows XP Help and Support Center • © Microsoft Corporation
      </div>
    </div>
  );
};

export default HelpApp;