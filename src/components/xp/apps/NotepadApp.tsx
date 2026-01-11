import React, { useState } from 'react';
import Clippy from '../Clippy';

const NotepadApp: React.FC = () => {
  const [text, setText] = useState(`Welcome to Notepad!
  
This is a simple text editor, just like the one from Windows XP.

Feel free to type your thoughts here...

Fun fact: The original Notepad was introduced with Windows 1.0 in 1985!

=============== EASTER EGGS ===============

🥚 Try typing "about:mozilla" in IE for a fun surprise!

🥚 Did you know? The Windows XP wallpaper "Bliss" is a real 
   unedited photo taken in Sonoma County, California!

🥚 The Konami Code (↑↑↓↓←→←→BA) works in many games!

🥚 In Minesweeper, type "xyzzy" then Shift+Enter for a cheat!

🥚 AIM fun: If you're away too long, your buddy icon turns gray!

🥚 "All your base are belong to us" - Zero Wing, 2001

=============== 2000s NOSTALGIA ===============

♪ Now Playing on Winamp: Crazy Town - Butterfly.mp3 ♪
♪ Download more songs on Kazaa! (results may vary) ♪

Top Sites to Visit:
- Homestar Runner (for Trogdor!)
- Newgrounds (Flash games forever!)
- eBaums World (definitely original content)
- Something Awful forums (FYAD)

Remember: The Hampster Dance was peak internet culture!

Tips:
- You can write anything you want
- This text won't be saved (just like real Notepad without saving!)
- Ctrl+A still works to select all
- Ctrl+S does nothing here 😈

Happy typing! 📝

P.S. - Have you updated your LiveJournal mood today?`);
  const [showClippy, setShowClippy] = useState(true);

  return (
    <div className="h-full flex flex-col bg-white relative">
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

      {/* Clippy */}
      {showClippy && (
        <div className="absolute bottom-8 right-2">
          <Clippy context="notepad" onDismiss={() => setShowClippy(false)} />
        </div>
      )}
    </div>
  );
};

export default NotepadApp;
