import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Star, Search, Globe, Mail } from 'lucide-react';

const InternetExplorerApp: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentPage, setCurrentPage] = useState<'google' | 'myspace' | 'newgrounds' | 'ebaumsworld'>('google');

  const navigate = (page: typeof currentPage) => {
    setCurrentPage(page);
    const urls: Record<typeof currentPage, string> = {
      google: 'https://www.google.com',
      myspace: 'https://www.myspace.com',
      newgrounds: 'https://www.newgrounds.com',
      ebaumsworld: 'https://www.ebaumsworld.com',
    };
    setUrl(urls[page]);
  };

  return (
    <div className="h-full flex flex-col bg-[#ece9d8] font-xp text-sm">
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-gray-400 text-xs flex gap-4">
        <span className="cursor-pointer hover:underline">File</span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Favorites</span>
        <span className="cursor-pointer hover:underline">Tools</span>
        <span className="cursor-pointer hover:underline">Help</span>
      </div>

      {/* Toolbar */}
      <div className="bg-gradient-to-b from-[#f6f8fc] to-[#e3e7f3] p-1 border-b border-gray-400 flex items-center gap-1">
        <button className="p-1 hover:bg-blue-100 rounded" title="Back">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-blue-100 rounded" title="Forward">
          <ArrowRight className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-blue-100 rounded" title="Refresh">
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-blue-100 rounded" title="Home" onClick={() => navigate('google')}>
          <Home className="w-4 h-4 text-gray-600" />
        </button>
        <div className="w-px h-5 bg-gray-400 mx-1" />
        <button className="p-1 hover:bg-blue-100 rounded flex items-center gap-1" title="Search">
          <Search className="w-4 h-4 text-gray-600" />
          <span className="text-xs">Search</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex items-center gap-1" title="Favorites">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-xs">Favorites</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex items-center gap-1" title="Mail">
          <Mail className="w-4 h-4 text-gray-600" />
          <span className="text-xs">Mail</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] p-1 border-b border-gray-400 flex items-center gap-2">
        <span className="text-xs">Address</span>
        <div className="flex-1 flex items-center bg-white border border-gray-400 rounded px-1">
          <Globe className="w-4 h-4 text-blue-500 mr-1" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 py-0.5 text-xs outline-none"
          />
        </div>
        <button className="xp-button text-xs px-2">Go</button>
      </div>

      {/* Links Bar */}
      <div className="bg-[#ece9d8] px-2 py-1 border-b border-gray-400 flex items-center gap-3 text-xs">
        <span className="text-gray-500">Links:</span>
        <button onClick={() => navigate('myspace')} className="text-blue-600 hover:underline">MySpace</button>
        <button onClick={() => navigate('newgrounds')} className="text-blue-600 hover:underline">Newgrounds</button>
        <button onClick={() => navigate('ebaumsworld')} className="text-blue-600 hover:underline">eBaum's World</button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-auto bg-white">
        {currentPage === 'google' && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-5xl font-serif mb-4">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </div>
            <div className="flex gap-2">
              <input type="text" className="border border-gray-400 px-3 py-1 w-80 text-sm" />
            </div>
            <div className="flex gap-2 mt-3">
              <button className="xp-button text-xs">Google Search</button>
              <button className="xp-button text-xs">I'm Feeling Lucky</button>
            </div>
            <div className="mt-8 text-xs text-gray-500">
              © 2003 Google - Searching 4,285,199,774 web pages
            </div>
          </div>
        )}

        {currentPage === 'myspace' && (
          <div className="p-4">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 mb-4">
              <h1 className="text-2xl font-bold">MySpace</h1>
              <p className="text-sm">A Place for Friends</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-3 bg-[#cfe2f3]">
                <h3 className="font-bold text-sm mb-2">Top 8 Friends</h3>
                <div className="grid grid-cols-4 gap-1 text-xs text-center">
                  {['Tom', 'Sarah', 'Mike', 'Jen', 'Chris', 'Amy', 'Dave', 'Lisa'].map(name => (
                    <div key={name} className="bg-white p-1 rounded">
                      <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-1" />
                      {name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border p-3 bg-[#fff2cc]">
                <h3 className="font-bold text-sm mb-2">Now Playing</h3>
                <p className="text-xs">🎵 Taking Back Sunday - MakeDamnSure</p>
                <p className="text-xs mt-2 italic">Auto-playing music that you can't stop!</p>
              </div>
            </div>
            <div className="mt-4 border p-3 bg-[#e6b8af]">
              <h3 className="font-bold text-sm mb-2">About Me</h3>
              <div className="text-xs" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                ★彡 ωєℓ¢σмє тσ мү ρяσƒιℓє 彡★<br />
                ~*~If you can't handle me at my worst, you don't deserve me at my best~*~<br />
                💀 Rawr means I love you in dinosaur 💀
              </div>
            </div>
          </div>
        )}

        {currentPage === 'newgrounds' && (
          <div className="bg-black text-white p-4 min-h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-orange-500">NEWGROUNDS</div>
              <span className="text-xs text-gray-400">Everything, by Everyone</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'Madness Combat', type: 'Animation', rating: '4.5/5' },
                { title: 'Dad n Me', type: 'Game', rating: '4.8/5' },
                { title: 'Alien Hominid', type: 'Game', rating: '4.9/5' },
                { title: 'Animator vs Animation', type: 'Animation', rating: '4.7/5' },
                { title: 'Portal Defenders', type: 'Game', rating: '4.2/5' },
                { title: 'Numa Numa', type: 'Video', rating: '4.6/5' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700">
                  <div className="w-full h-16 bg-gray-600 rounded mb-2" />
                  <div className="text-xs font-bold text-orange-400">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.type} • {item.rating}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'ebaumsworld' && (
          <div className="p-4 bg-[#336699] min-h-full">
            <div className="bg-white rounded p-4 mb-4 text-center">
              <h1 className="text-2xl font-bold text-[#336699]">eBaum's World</h1>
              <p className="text-xs text-gray-600">The Funniest Stuff on the Internet!</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Funny Videos', 'Flash Games', 'Sound Clips', 
                'Jokes', 'Pictures', 'eCards'
              ].map((section, i) => (
                <div key={i} className="bg-white rounded p-3 text-center cursor-pointer hover:bg-yellow-100">
                  <div className="text-sm font-bold text-[#336699]">{section}</div>
                  <div className="text-xs text-gray-500">Click to view</div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-yellow-200 rounded p-2 text-center text-xs">
              🎵 Don't forget to check out our SOUNDBOARD section! 🎵
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-2 py-0.5 flex justify-between text-xs">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3" /> Done
        </span>
        <span>Internet | Protected Mode: On</span>
      </div>
    </div>
  );
};

export default InternetExplorerApp;
