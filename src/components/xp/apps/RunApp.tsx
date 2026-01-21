import React, { useState } from 'react';
import { Terminal, Folder } from 'lucide-react';
import { useWindows } from '@/pages/Index';
import { useXPSounds } from '@/hooks/useXPSounds';

const RunApp: React.FC = () => {
  const [command, setCommand] = useState('');
  const { openWindow, closeWindow } = useWindows();
  const { playError } = useXPSounds();

  const handleRun = () => {
    const cmd = command.toLowerCase().trim();
    
    // Map commands to apps
    const commandMap: Record<string, { id: string; title: string; component: string }> = {
      // Notepad
      'notepad': { id: 'notepad', title: 'Notepad', component: 'notepad' },
      'notepad.exe': { id: 'notepad', title: 'Notepad', component: 'notepad' },
      // Paint
      'mspaint': { id: 'paint', title: 'Paint', component: 'paint' },
      'mspaint.exe': { id: 'paint', title: 'Paint', component: 'paint' },
      'paint': { id: 'paint', title: 'Paint', component: 'paint' },
      // Games
      'winmine': { id: 'minesweeper', title: 'Minesweeper', component: 'minesweeper' },
      'minesweeper': { id: 'minesweeper', title: 'Minesweeper', component: 'minesweeper' },
      'pinball': { id: 'pinball', title: '3D Pinball', component: 'pinball' },
      // Media
      'wmplayer': { id: 'mediaplayer', title: 'Windows Media Player', component: 'mediaplayer' },
      'wmplayer.exe': { id: 'mediaplayer', title: 'Windows Media Player', component: 'mediaplayer' },
      'winamp': { id: 'winamp', title: 'Winamp', component: 'winamp' },
      'winamp.exe': { id: 'winamp', title: 'Winamp', component: 'winamp' },
      // Internet
      'iexplore': { id: 'ie', title: 'Internet Explorer', component: 'ie' },
      'iexplore.exe': { id: 'ie', title: 'Internet Explorer', component: 'ie' },
      'aol': { id: 'aol', title: 'AOL Instant Messenger', component: 'aol' },
      'aim': { id: 'aol', title: 'AOL Instant Messenger', component: 'aol' },
      'msn': { id: 'msn', title: 'MSN Messenger', component: 'msn' },
      'msnmsgr': { id: 'msn', title: 'MSN Messenger', component: 'msn' },
      // P2P
      'napster': { id: 'napster', title: 'Napster', component: 'napster' },
      'limewire': { id: 'limewire', title: 'LimeWire', component: 'limewire' },
      'kazaa': { id: 'kazaa', title: 'Kazaa', component: 'kazaa' },
      // System
      'cmd': { id: 'cmd', title: 'Command Prompt', component: 'cmd' },
      'cmd.exe': { id: 'cmd', title: 'Command Prompt', component: 'cmd' },
      'control': { id: 'controlpanel', title: 'Control Panel', component: 'controlpanel' },
      'help': { id: 'help', title: 'Help and Support', component: 'help' },
      'search': { id: 'search', title: 'Search', component: 'search' },
      // Folders
      'explorer': { id: 'mydocuments', title: 'My Documents', component: 'mydocuments' },
      'mydocuments': { id: 'mydocuments', title: 'My Documents', component: 'mydocuments' },
      // Portfolio
      'resume': { id: 'resume', title: 'My Resume', component: 'resume' },
      'about': { id: 'about', title: 'About Me', component: 'about' },
      'contact': { id: 'contact', title: 'Contact', component: 'contact' },
    };

    if (commandMap[cmd]) {
      openWindow(commandMap[cmd].id, commandMap[cmd].title, commandMap[cmd].component);
      closeWindow('run');
    } else {
      playError();
      alert(`Windows cannot find '${command}'. Make sure you typed the name correctly, and then try again.`);
    }
  };

  const handleCancel = () => {
    closeWindow('run');
  };

  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
          <Terminal className="w-8 h-8 text-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 mb-3">
            Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Open:</label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRun()}
              placeholder="notepad"
              className="flex-1 border rounded px-2 py-1 text-sm"
              autoFocus
            />
            <button className="p-1 border rounded hover:bg-gray-200">
              <Folder className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleRun}
          className="px-4 py-1 bg-gray-200 border rounded text-sm hover:bg-gray-300"
        >
          OK
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-1 bg-gray-200 border rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-1 bg-gray-200 border rounded text-sm hover:bg-gray-300"
        >
          Browse...
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p className="font-semibold mb-1">Try these commands:</p>
        <p>notepad, paint, minesweeper, pinball, winamp, cmd</p>
        <p>napster, limewire, kazaa, aol, msn, iexplore</p>
      </div>
    </div>
  );
};

export default RunApp;