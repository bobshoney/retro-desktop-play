import React, { useState } from 'react';
import { Terminal, Folder } from 'lucide-react';
import { useWindows } from '@/pages/Index';

const RunApp: React.FC = () => {
  const [command, setCommand] = useState('');
  const { openWindow, closeWindow, playWindowOpen, playClick } = useWindows();

  const handleRun = () => {
    const cmd = command.toLowerCase().trim();
    
    // Map commands to apps
    const commandMap: Record<string, { id: string; title: string; component: string }> = {
      'notepad': { id: 'notepad', title: 'Notepad', component: 'notepad' },
      'notepad.exe': { id: 'notepad', title: 'Notepad', component: 'notepad' },
      'mspaint': { id: 'paint', title: 'Paint', component: 'paint' },
      'mspaint.exe': { id: 'paint', title: 'Paint', component: 'paint' },
      'paint': { id: 'paint', title: 'Paint', component: 'paint' },
      'winmine': { id: 'minesweeper', title: 'Minesweeper', component: 'minesweeper' },
      'minesweeper': { id: 'minesweeper', title: 'Minesweeper', component: 'minesweeper' },
      'wmplayer': { id: 'mediaplayer', title: 'Media Player', component: 'mediaplayer' },
      'iexplore': { id: 'ie', title: 'Internet Explorer', component: 'ie' },
      'iexplore.exe': { id: 'ie', title: 'Internet Explorer', component: 'ie' },
      'control': { id: 'controlpanel', title: 'Control Panel', component: 'controlpanel' },
      'help': { id: 'help', title: 'Help and Support', component: 'help' },
    };

    if (commandMap[cmd]) {
      playWindowOpen();
      openWindow(commandMap[cmd].id, commandMap[cmd].title, commandMap[cmd].component);
      closeWindow('run');
    } else {
      playClick();
      alert(`Windows cannot find '${command}'. Make sure you typed the name correctly, and then try again.`);
    }
  };

  const handleCancel = () => {
    playClick();
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
        <p>notepad, paint, minesweeper, wmplayer, iexplore, control, help</p>
      </div>
    </div>
  );
};

export default RunApp;