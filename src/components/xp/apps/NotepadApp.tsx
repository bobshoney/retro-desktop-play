import React, { useState } from 'react';

const NotepadApp: React.FC = () => {
  const [text, setText] = useState(`Welcome to Notepad!
  
This is a simple text editor, just like the one from Windows XP.

Feel free to type your thoughts here...

Fun fact: The original Notepad was introduced with Windows 1.0 in 1985!

Tips:
- You can write anything you want
- This text won't be saved (just like real Notepad without saving!)
- Ctrl+A still works to select all

Happy typing! 📝`);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-1 bg-[#ece9d8] text-xs border-b border-gray-300">
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Format</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 resize-none border-none outline-none font-mono text-sm"
        style={{ fontFamily: 'Lucida Console, Monaco, monospace' }}
      />

      {/* Status Bar */}
      <div className="px-2 py-0.5 bg-[#ece9d8] text-xs text-gray-600 border-t border-gray-300">
        Ln 1, Col 1
      </div>
    </div>
  );
};

export default NotepadApp;
