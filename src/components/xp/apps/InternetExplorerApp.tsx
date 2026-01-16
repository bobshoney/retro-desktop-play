import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Star, Search, Globe, Mail, Printer, History, X, AlertTriangle, Gift, Download, Trophy, Skull } from 'lucide-react';
import Clippy from '../Clippy';
import DialUpConnection from '../DialUpConnection';

type PageType = 'home' | 'google' | 'askjeeves' | 'myspace' | 'newgrounds' | 'ebaumsworld' | 'geocities' | 'aim';

interface PopupAd {
  id: number;
  type: 'winner' | 'download' | 'warning' | 'casino' | 'dating' | 'virus';
  title: string;
  position: { x: number; y: number };
}

const popupTemplates = [
  { type: 'winner' as const, title: 'Congratulations!!!' },
  { type: 'winner' as const, title: 'YOU WON!!!' },
  { type: 'download' as const, title: 'Free Download!' },
  { type: 'download' as const, title: 'Download Now!' },
  { type: 'warning' as const, title: 'Warning!' },
  { type: 'warning' as const, title: 'URGENT Message' },
  { type: 'casino' as const, title: 'Online Casino' },
  { type: 'dating' as const, title: 'Hot Singles Near You!' },
  { type: 'virus' as const, title: 'VIRUS DETECTED!' },
];

const InternetExplorerApp: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [url, setUrl] = useState('http://www.msn.com');
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [history, setHistory] = useState<PageType[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [popups, setPopups] = useState<PopupAd[]>([]);
  const [popupIdCounter, setPopupIdCounter] = useState(0);
  const [showClippy, setShowClippy] = useState(true);

  const handleConnected = () => {
    setIsConnecting(false);
    setIsConnected(true);
  };

  const handleCancelConnection = () => {
    setIsConnecting(false);
    setIsConnected(false);
  };

  const urls: Record<PageType, string> = {
    home: 'http://www.msn.com',
    google: 'http://www.google.com',
    askjeeves: 'http://www.askjeeves.com',
    myspace: 'http://www.myspace.com',
    newgrounds: 'http://www.newgrounds.com',
    ebaumsworld: 'http://www.ebaumsworld.com',
    geocities: 'http://www.geocities.com/~coolsite2003',
    aim: 'http://www.aim.com/profile',
  };

  const navigate = (page: PageType) => {
    setCurrentPage(page);
    setUrl(urls[page]);
    const newHistory = [...history.slice(0, historyIndex + 1), page];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPage(history[newIndex]);
      setUrl(urls[history[newIndex]]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPage(history[newIndex]);
      setUrl(urls[history[newIndex]]);
    }
  };

  const spawnPopup = useCallback(() => {
    const template = popupTemplates[Math.floor(Math.random() * popupTemplates.length)];
    const newPopup: PopupAd = {
      id: popupIdCounter,
      type: template.type,
      title: template.title,
      position: {
        x: 50 + Math.random() * 200,
        y: 50 + Math.random() * 150,
      },
    };
    setPopupIdCounter(prev => prev + 1);
    setPopups(prev => [...prev, newPopup]);
  }, [popupIdCounter]);

  const closePopup = (id: number, spawnMore: boolean = false) => {
    setPopups(prev => prev.filter(p => p.id !== id));
    // Sometimes closing spawns more popups!
    if (spawnMore && Math.random() > 0.5) {
      setTimeout(() => {
        spawnPopup();
        if (Math.random() > 0.7) {
          setTimeout(spawnPopup, 200);
        }
      }, 100);
    }
  };

  // Spawn popups randomly while browsing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && popups.length < 5) {
        spawnPopup();
      }
    }, 8000);

    // Initial popup after a delay
    const initialTimeout = setTimeout(() => {
      if (popups.length === 0) {
        spawnPopup();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [spawnPopup, popups.length]);

  // Spawn popup on navigation
  useEffect(() => {
    if (Math.random() > 0.5) {
      setTimeout(spawnPopup, 1000);
    }
  }, [currentPage]);

  const renderPopupContent = (popup: PopupAd) => {
    switch (popup.type) {
      case 'winner':
        return (
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce">🎉🎊🎁</div>
            <div className="text-xl font-bold text-red-600 animate-pulse">
              CONGRATULATIONS!!!
            </div>
            <div className="text-sm my-2">
              You are the <span className="font-bold text-green-600">1,000,000th</span> visitor!
            </div>
            <div className="bg-yellow-300 p-2 my-2 border-2 border-yellow-600">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto" />
              <div className="font-bold">You've WON a FREE iPod!</div>
            </div>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded animate-pulse"
              onClick={() => closePopup(popup.id, true)}
            >
              CLAIM YOUR PRIZE NOW!!!
            </button>
            <div className="text-xs text-gray-500 mt-2">*No purchase necessary</div>
          </div>
        );
      
      case 'download':
        return (
          <div className="text-center">
            <Download className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <div className="font-bold text-lg mb-2">FREE DOWNLOAD!</div>
            <div className="text-sm mb-3">
              Speed up your PC by <span className="text-green-600 font-bold">300%</span>!
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded mb-2">
              <div className="font-bold">SuperTurboBoost Pro 2004</div>
              <div className="text-xs">⭐⭐⭐⭐⭐ Trusted by millions!</div>
            </div>
            <div className="flex gap-2 justify-center">
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded text-sm"
                onClick={() => closePopup(popup.id, true)}
              >
                Download FREE
              </button>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded text-sm"
                onClick={() => closePopup(popup.id, true)}
              >
                Download NOW
              </button>
            </div>
          </div>
        );
      
      case 'warning':
        return (
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-2 animate-pulse" />
            <div className="font-bold text-lg text-red-600 mb-2">⚠️ URGENT WARNING ⚠️</div>
            <div className="text-sm mb-3 bg-yellow-100 p-2 border border-yellow-400">
              Your computer may be <span className="font-bold text-red-600">AT RISK!</span>
              <br />
              You have (47) viruses detected!
            </div>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded animate-pulse"
              onClick={() => closePopup(popup.id, true)}
            >
              SCAN NOW - IT'S FREE!
            </button>
          </div>
        );
      
      case 'casino':
        return (
          <div className="text-center bg-gradient-to-b from-purple-900 to-black text-white p-2 -m-3 rounded">
            <div className="text-3xl mb-2">🎰 💰 🎲</div>
            <div className="font-bold text-yellow-400 text-lg">MEGA CASINO ROYALE</div>
            <div className="text-sm my-2">
              Get <span className="text-green-400 font-bold">$500 FREE</span> bonus!
            </div>
            <div className="flex justify-center gap-1 my-2">
              {['7️⃣', '7️⃣', '7️⃣'].map((emoji, i) => (
                <span key={i} className="text-2xl bg-white text-black px-2 rounded">{emoji}</span>
              ))}
            </div>
            <button 
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded"
              onClick={() => closePopup(popup.id, true)}
            >
              PLAY NOW & WIN BIG!
            </button>
          </div>
        );
      
      case 'dating':
        return (
          <div className="text-center">
            <div className="text-3xl mb-2">💕 💋 ❤️</div>
            <div className="font-bold text-pink-600 text-lg">Hot Singles in Your Area!</div>
            <div className="bg-pink-100 p-2 my-2 rounded">
              <div className="text-sm">
                <span className="font-bold">23</span> people want to meet you!
              </div>
              <div className="text-xs text-gray-600">Only 0.3 miles away...</div>
            </div>
            <div className="flex gap-2 justify-center">
              <button 
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-1 px-4 rounded"
                onClick={() => closePopup(popup.id, true)}
              >
                View Profiles 💝
              </button>
            </div>
          </div>
        );
      
      case 'virus':
        return (
          <div className="text-center">
            <Skull className="w-12 h-12 text-red-600 mx-auto mb-2 animate-pulse" />
            <div className="font-bold text-lg text-red-600 bg-black p-2 mb-2">
              🚨 VIRUS DETECTED! 🚨
            </div>
            <div className="text-sm mb-2 text-red-700">
              Your PC is infected with TROJAN.HORSE.2004!
              <br />
              <span className="font-bold">All your files will be DELETED!</span>
            </div>
            <div className="bg-red-100 border-2 border-red-500 p-2 mb-2">
              <div className="text-xs">Time remaining: <span className="font-mono text-red-600">04:59</span></div>
            </div>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded animate-pulse"
              onClick={() => closePopup(popup.id, true)}
            >
              REMOVE VIRUS NOW!
            </button>
            <div className="text-xs text-gray-500 mt-1">Powered by TotallyLegitAntivirus™</div>
          </div>
        );
    }
  };

  // Show dial-up connection screen
  if (isConnecting) {
    return (
      <div className="h-full flex flex-col bg-[#ece9d8] text-xs items-center justify-center">
        <DialUpConnection onConnected={handleConnected} onCancel={handleCancelConnection} />
      </div>
    );
  }

  // Show disconnected state if user cancelled
  if (!isConnected) {
    return (
      <div className="h-full flex flex-col bg-[#ece9d8] text-xs items-center justify-center">
        <div className="text-center p-8 bg-white border-2 border-gray-400 shadow-lg">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-lg font-bold mb-2">Not Connected</div>
          <div className="text-sm text-gray-600 mb-4">You are not connected to the Internet.</div>
          <button 
            onClick={() => setIsConnecting(true)}
            className="xp-button px-4 py-2"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#ece9d8] text-xs">
      {/* Menu Bar */}
      <div className="bg-[#ece9d8] px-2 py-0.5 border-b border-gray-400 flex gap-4">
        <span className="cursor-pointer hover:underline">File</span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Favorites</span>
        <span className="cursor-pointer hover:underline">Tools</span>
        <span className="cursor-pointer hover:underline">Help</span>
      </div>

      {/* Toolbar */}
      <div className="bg-gradient-to-b from-[#f6f8fc] to-[#e3e7f3] p-1 border-b border-gray-400 flex items-center gap-0.5">
        <button 
          className={`p-1 rounded flex flex-col items-center ${historyIndex > 0 ? 'hover:bg-blue-100' : 'opacity-50'}`} 
          title="Back"
          onClick={goBack}
          disabled={historyIndex === 0}
        >
          <ArrowLeft className="w-5 h-5 text-green-700" />
          <span className="text-[10px]">Back</span>
        </button>
        <button 
          className={`p-1 rounded flex flex-col items-center ${historyIndex < history.length - 1 ? 'hover:bg-blue-100' : 'opacity-50'}`}
          title="Forward"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ArrowRight className="w-5 h-5 text-green-700" />
          <span className="text-[10px]">Forward</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="Stop">
          <div className="w-5 h-5 flex items-center justify-center text-red-600 font-bold">✕</div>
          <span className="text-[10px]">Stop</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="Refresh">
          <RotateCcw className="w-5 h-5 text-green-700" />
          <span className="text-[10px]">Refresh</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="Home" onClick={() => navigate('home')}>
          <Home className="w-5 h-5 text-blue-700" />
          <span className="text-[10px]">Home</span>
        </button>
        <div className="w-px h-8 bg-gray-300 mx-1" />
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="Search">
          <Search className="w-5 h-5 text-blue-600" />
          <span className="text-[10px]">Search</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="Favorites">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-[10px]">Favorites</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="History">
          <History className="w-5 h-5 text-green-600" />
          <span className="text-[10px]">History</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="Mail">
          <Mail className="w-5 h-5 text-blue-600" />
          <span className="text-[10px]">Mail</span>
        </button>
        <button className="p-1 hover:bg-blue-100 rounded flex flex-col items-center" title="Print">
          <Printer className="w-5 h-5 text-gray-600" />
          <span className="text-[10px]">Print</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] p-1 border-b border-gray-400 flex items-center gap-2">
        <span className="text-xs font-medium">Address</span>
        <div className="flex-1 flex items-center bg-white border border-gray-400 px-1">
          <Globe className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 py-0.5 text-xs outline-none"
          />
        </div>
        <button className="xp-button text-xs px-3">Go</button>
      </div>

      {/* Links Bar */}
      <div className="bg-[#ece9d8] px-2 py-1 border-b border-gray-400 flex items-center gap-3 text-xs">
        <span className="text-gray-500 font-medium">Links</span>
        <span className="text-gray-300">|</span>
        <button onClick={() => navigate('google')} className="text-blue-600 hover:underline hover:text-blue-800">Google</button>
        <button onClick={() => navigate('askjeeves')} className="text-blue-600 hover:underline hover:text-blue-800">Ask Jeeves</button>
        <button onClick={() => navigate('myspace')} className="text-blue-600 hover:underline hover:text-blue-800">MySpace</button>
        <button onClick={() => navigate('newgrounds')} className="text-blue-600 hover:underline hover:text-blue-800">Newgrounds</button>
        <button onClick={() => navigate('ebaumsworld')} className="text-blue-600 hover:underline hover:text-blue-800">eBaums</button>
        <button onClick={() => navigate('geocities')} className="text-blue-600 hover:underline hover:text-blue-800">GeoCities</button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-auto bg-white">
        {/* MSN Homepage */}
        {currentPage === 'home' && (
          <div className="min-h-full">
            {/* MSN Header */}
            <div className="bg-gradient-to-r from-[#0078d4] to-[#00a2ed] p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">MSN</div>
                  <span className="text-sm opacity-80">The Best of the Web</span>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="hover:underline cursor-pointer">Hotmail</span>
                  <span className="hover:underline cursor-pointer">Messenger</span>
                  <span className="hover:underline cursor-pointer">My MSN</span>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="bg-[#f5f5f5] p-3 border-b">
              <div className="flex gap-2 max-w-md mx-auto">
                <input type="text" placeholder="Search the Web" className="flex-1 px-2 py-1 border text-sm" />
                <button className="bg-[#ff6600] text-white px-4 py-1 text-sm font-bold">MSN Search</button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-4 grid grid-cols-3 gap-4">
              {/* Main Content */}
              <div className="col-span-2 space-y-4">
                <div className="border p-3 bg-[#fffef5]">
                  <h3 className="font-bold text-blue-800 border-b pb-1 mb-2">📰 Today's Headlines</h3>
                  <ul className="space-y-1 text-xs">
                    <li className="text-blue-600 hover:underline cursor-pointer">• New Windows XP Service Pack 2 Released!</li>
                    <li className="text-blue-600 hover:underline cursor-pointer">• AOL Reports Record Instant Messenger Usage</li>
                    <li className="text-blue-600 hover:underline cursor-pointer">• Napster Files for Bankruptcy, Future Uncertain</li>
                    <li className="text-blue-600 hover:underline cursor-pointer">• Apple Announces Revolutionary "iPod Mini"</li>
                    <li className="text-blue-600 hover:underline cursor-pointer">• Google IPO Expected This Summer</li>
                  </ul>
                </div>

                <div className="border p-3">
                  <h3 className="font-bold text-green-700 border-b pb-1 mb-2">🌐 Popular Sites</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { name: 'MySpace', desc: 'A place for friends' },
                      { name: 'Friendster', desc: 'Social network' },
                      { name: 'eBay', desc: 'Online auctions' },
                      { name: 'Amazon', desc: 'Books & more' },
                      { name: 'MapQuest', desc: 'Get directions' },
                      { name: 'Weather.com', desc: 'Local forecast' },
                    ].map((site) => (
                      <div key={site.name} className="p-2 bg-gray-50 hover:bg-blue-50 cursor-pointer rounded">
                        <div className="font-bold text-blue-600">{site.name}</div>
                        <div className="text-gray-500">{site.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border p-3 bg-[#fff0f5]">
                  <h3 className="font-bold text-purple-700 border-b pb-1 mb-2">🎵 Entertainment</h3>
                  <div className="text-xs space-y-1">
                    <p>🔥 <span className="text-blue-600 hover:underline cursor-pointer">Top 40 Music Downloads</span></p>
                    <p>🎬 <span className="text-blue-600 hover:underline cursor-pointer">Movie Showtimes Near You</span></p>
                    <p>🎮 <span className="text-blue-600 hover:underline cursor-pointer">Play Free Flash Games!</span></p>
                    <p>📺 <span className="text-blue-600 hover:underline cursor-pointer">Tonight's TV Schedule</span></p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="border p-3 bg-gradient-to-b from-yellow-50 to-white">
                  <h3 className="font-bold text-orange-600 text-sm mb-2">🔥 FREE Hotmail!</h3>
                  <p className="text-xs mb-2">Get 2MB of storage FREE!</p>
                  <button className="bg-orange-500 text-white text-xs px-3 py-1 rounded">Sign Up Now!</button>
                </div>

                <div className="border p-3 bg-[#e8f4e8]">
                  <h3 className="font-bold text-green-700 text-xs mb-2">💬 MSN Messenger</h3>
                  <p className="text-xs mb-2">Chat with friends online!</p>
                  <p className="text-xs text-gray-600">Download v6.0 today</p>
                </div>

                <div className="border p-3">
                  <h3 className="font-bold text-xs mb-2">🎁 Win a FREE Xbox!</h3>
                  <div className="bg-green-600 text-white p-2 text-center text-xs animate-pulse">
                    CLICK HERE!<br />
                    You are the 1,000,000th visitor!
                  </div>
                </div>

                <div className="border p-3 text-xs">
                  <h3 className="font-bold mb-1">📊 Web Counter</h3>
                  <div className="bg-black text-green-400 font-mono p-1 text-center">
                    Visitors: 00284719
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-2 text-center text-xs text-gray-500 border-t">
              © 2004 Microsoft Corporation. All rights reserved. | 
              <span className="text-blue-600 hover:underline cursor-pointer"> Privacy</span> | 
              <span className="text-blue-600 hover:underline cursor-pointer"> Terms</span> | 
              <span className="text-blue-600 hover:underline cursor-pointer"> Advertise</span>
            </div>
          </div>
        )}

        {/* Google */}
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
            <div className="mt-4 text-xs text-gray-600">
              <span className="text-blue-600 hover:underline cursor-pointer">Advertise with Us</span> - 
              <span className="text-blue-600 hover:underline cursor-pointer"> Business Solutions</span> - 
              <span className="text-blue-600 hover:underline cursor-pointer"> About Google</span>
            </div>
            <div className="mt-6 text-xs text-gray-500">
              © 2004 Google - Searching 4,285,199,774 web pages
            </div>
          </div>
        )}

        {/* Ask Jeeves */}
        {currentPage === 'askjeeves' && (
          <div className="min-h-full bg-white">
            <div className="bg-gradient-to-r from-[#6b4c9a] to-[#8b6cb8] p-4 text-white text-center">
              <h1 className="text-3xl font-bold">Ask Jeeves</h1>
              <p className="text-sm opacity-90">The Butler Knows!</p>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-6xl">🎩</div>
                <div className="bg-[#fffde7] border-2 border-[#6b4c9a] rounded-lg p-4 max-w-md">
                  <p className="text-sm mb-3">Good day! How may I assist you today? Simply type your question in plain English.</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="What is the capital of France?" 
                      className="flex-1 border px-2 py-1 text-sm"
                    />
                    <button className="bg-[#6b4c9a] text-white px-4 py-1 text-sm">Ask!</button>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <p className="mb-2 font-bold">Popular Questions:</p>
                <ul className="space-y-1">
                  <li className="text-blue-600 hover:underline cursor-pointer">• How do I get free ringtones?</li>
                  <li className="text-blue-600 hover:underline cursor-pointer">• What are the best MySpace layouts?</li>
                  <li className="text-blue-600 hover:underline cursor-pointer">• How do I download music for free?</li>
                  <li className="text-blue-600 hover:underline cursor-pointer">• What is the weather today?</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* MySpace */}
        {currentPage === 'myspace' && (
          <div className="p-4 min-h-full" style={{ background: 'linear-gradient(135deg, #000033 0%, #000066 100%)' }}>
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 mb-4 rounded">
              <h1 className="text-2xl font-bold">MySpace</h1>
              <p className="text-sm opacity-80">A Place for Friends</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-pink-400 p-3 rounded" style={{ background: '#ff99cc' }}>
                <h3 className="font-bold text-sm mb-2 text-purple-900">👤 xX_DarkAngel_Xx's Profile</h3>
                <div className="bg-white/80 p-2 rounded mb-2">
                  <p className="text-xs font-bold">"Last Online: 5 mins ago"</p>
                  <p className="text-xs">Mood: 😢 contemplative</p>
                  <p className="text-xs">Status: Single</p>
                </div>
                <h4 className="font-bold text-xs mb-1">Top 8 Friends:</h4>
                <div className="grid grid-cols-4 gap-1 text-xs text-center">
                  {['Tom', 'Sarah', 'xXMikeXx', '~*Jen*~', 'Chris420', 'AmyBaby', 'DJDave', 'LisaLuv'].map(name => (
                    <div key={name} className="bg-white/90 p-1 rounded">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded mx-auto mb-1" />
                      <span className="text-purple-800">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-2 border-yellow-400 p-3 rounded bg-[#ffff99]">
                  <h3 className="font-bold text-sm mb-2">🎵 Now Playing (auto-play)</h3>
                  <p className="text-xs">♫ Taking Back Sunday - MakeDamnSure</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-gray-300 rounded overflow-hidden">
                      <div className="h-full bg-green-500 w-1/3 animate-pulse"></div>
                    </div>
                    <span className="text-xs">1:24 / 3:45</span>
                  </div>
                  <p className="text-xs mt-2 italic text-gray-600">🔊 Can't stop the music!</p>
                </div>
                <div className="border-2 border-purple-400 p-3 rounded" style={{ background: 'linear-gradient(180deg, #cc99ff 0%, #9966cc 100%)' }}>
                  <h3 className="font-bold text-sm mb-2 text-white">📝 About Me</h3>
                  <div className="text-xs text-white" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    ★彡 ωєℓ¢σмє тσ мү ρяσƒιℓє 彡★<br /><br />
                    ~*~If you cant handle me at my worst~*~<br />
                    ~*~you dont deserve me at my best~*~<br /><br />
                    💀 Rawr means I love you in dinosaur 💀<br />
                    🖤 Im not emo I just like black 🖤
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded" style={{ background: 'linear-gradient(90deg, #ff6600 0%, #ff0066 100%)' }}>
              <h3 className="font-bold text-sm text-white mb-2">💬 Comments (47)</h3>
              <div className="bg-white/90 p-2 rounded text-xs space-y-2">
                <p><b>Tom:</b> Thanks for the add! Welcome to MySpace! 😊</p>
                <p><b>~*Sarah*~:</b> OMG ur profile is so0o0o cute!! PC4PC?? 💕</p>
                <p><b>xXMikeXx:</b> nice song choice bro, TBS rules!! 🤘</p>
              </div>
            </div>
          </div>
        )}

        {/* Newgrounds */}
        {currentPage === 'newgrounds' && (
          <div className="bg-black text-white p-4 min-h-full">
            <div className="flex items-center gap-4 mb-4 border-b border-orange-600 pb-3">
              <div className="text-3xl font-bold text-orange-500">NEWGROUNDS</div>
              <span className="text-xs text-gray-400">Everything, by Everyone</span>
              <div className="flex-1"></div>
              <div className="flex gap-2 text-xs">
                <span className="text-orange-400 hover:underline cursor-pointer">Games</span>
                <span className="text-orange-400 hover:underline cursor-pointer">Movies</span>
                <span className="text-orange-400 hover:underline cursor-pointer">Audio</span>
                <span className="text-orange-400 hover:underline cursor-pointer">Art</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'Madness Combat 5', type: 'Animation', rating: '4.5/5', views: '2.3M' },
                { title: 'Dad n Me', type: 'Game', rating: '4.8/5', views: '5.1M' },
                { title: 'Alien Hominid', type: 'Game', rating: '4.9/5', views: '8.2M' },
                { title: 'Animator vs Animation', type: 'Animation', rating: '4.7/5', views: '12M' },
                { title: 'Portal Defenders', type: 'Game', rating: '4.2/5', views: '1.8M' },
                { title: 'Numa Numa Dance', type: 'Video', rating: '4.6/5', views: '15M' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900 border border-gray-700 p-2 rounded cursor-pointer hover:border-orange-500 transition-colors">
                  <div className="w-full h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded mb-2 flex items-center justify-center text-3xl">
                    {item.type === 'Game' ? '🎮' : item.type === 'Animation' ? '🎬' : '📺'}
                  </div>
                  <div className="text-sm font-bold text-orange-400">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.type} • ⭐ {item.rating}</div>
                  <div className="text-xs text-gray-500">👁 {item.views} views</div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-900 border border-orange-600 p-3 rounded">
              <div className="text-orange-500 font-bold text-sm mb-2">🏆 Hall of Fame</div>
              <div className="text-xs text-gray-300">
                Vote for your favorite submissions! Top rated content gets featured on the front page.
              </div>
            </div>
          </div>
        )}

        {/* eBaums World */}
        {currentPage === 'ebaumsworld' && (
          <div className="p-4 min-h-full" style={{ background: 'linear-gradient(180deg, #336699 0%, #224477 100%)' }}>
            <div className="bg-white rounded-lg p-4 mb-4 text-center shadow-lg">
              <h1 className="text-3xl font-bold" style={{ color: '#336699' }}>eBaum's World</h1>
              <p className="text-xs text-gray-600">The Funniest Stuff on the Internet!</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { name: 'Funny Videos', icon: '📹', color: '#ff6b6b' },
                { name: 'Flash Games', icon: '🎮', color: '#4ecdc4' },
                { name: 'Sound Clips', icon: '🔊', color: '#ffe66d' },
                { name: 'Jokes', icon: '😂', color: '#95e1d3' },
                { name: 'Pictures', icon: '📷', color: '#f38181' },
                { name: 'eCards', icon: '💌', color: '#aa96da' },
              ].map((section, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-lg p-3 text-center cursor-pointer hover:scale-105 transition-transform shadow"
                  style={{ borderLeft: `4px solid ${section.color}` }}
                >
                  <div className="text-2xl mb-1">{section.icon}</div>
                  <div className="text-sm font-bold" style={{ color: '#336699' }}>{section.name}</div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-300 rounded-lg p-3 text-center mb-4 animate-pulse shadow-lg">
              <div className="text-lg font-bold">🎵 SOUNDBOARD SECTION! 🎵</div>
              <p className="text-xs">Over 10,000 sound clips! Prank your friends!</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <h3 className="font-bold text-sm mb-2" style={{ color: '#336699' }}>🔥 Trending Now</h3>
              <ul className="text-xs space-y-1">
                <li className="text-blue-600 hover:underline cursor-pointer">• Dramatic Chipmunk (NEW!)</li>
                <li className="text-blue-600 hover:underline cursor-pointer">• Charlie Bit My Finger</li>
                <li className="text-blue-600 hover:underline cursor-pointer">• Keyboard Cat</li>
                <li className="text-blue-600 hover:underline cursor-pointer">• Peanut Butter Jelly Time</li>
              </ul>
            </div>
          </div>
        )}

        {/* GeoCities */}
        {currentPage === 'geocities' && (
          <div 
            className="min-h-full p-4" 
            style={{ 
              background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%230000ff\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'3\' fill=\'%23ffff00\'/%3E%3C/svg%3E")',
              fontFamily: 'Comic Sans MS, cursive'
            }}
          >
            <div className="bg-black/80 p-4 rounded">
              <h1 className="text-center mb-4">
                <span className="text-red-500 text-3xl animate-pulse">★</span>
                <span className="text-yellow-400 text-2xl"> W</span>
                <span className="text-green-400 text-2xl">E</span>
                <span className="text-cyan-400 text-2xl">L</span>
                <span className="text-blue-400 text-2xl">C</span>
                <span className="text-purple-400 text-2xl">O</span>
                <span className="text-pink-400 text-2xl">M</span>
                <span className="text-red-400 text-2xl">E</span>
                <span className="text-red-500 text-3xl animate-pulse"> ★</span>
              </h1>
              <div className="text-center text-yellow-300 mb-4 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap text-lg">🌟 Welcome to my AWESOME homepage!!! 🌟 Last updated: March 2004 🌟 Sign my guestbook!!! 🌟</div>
              </div>
              
              <div className="bg-purple-900/80 p-3 rounded mb-4 border-2 border-yellow-400">
                <h2 className="text-lime-400 text-lg mb-2">👋 About Me:</h2>
                <p className="text-white text-sm">
                  Hi!!! My name is Kevin and Im 14 years old. I like video games, 
                  skateboarding, and Linkin Park!!! This is my first website so plz 
                  sign my guestbook!!! 
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-900/80 p-3 rounded border-2 border-lime-400">
                  <h3 className="text-yellow-400 mb-2">🔗 Cool Links:</h3>
                  <ul className="text-cyan-300 text-xs space-y-1">
                    <li className="hover:text-white cursor-pointer">→ Neopets</li>
                    <li className="hover:text-white cursor-pointer">→ Runescape</li>
                    <li className="hover:text-white cursor-pointer">→ Newgrounds</li>
                    <li className="hover:text-white cursor-pointer">→ Homestar Runner</li>
                  </ul>
                </div>
                <div className="bg-red-900/80 p-3 rounded border-2 border-orange-400">
                  <h3 className="text-yellow-400 mb-2">🎵 My Fav Songs:</h3>
                  <ul className="text-pink-300 text-xs space-y-1">
                    <li>♫ In The End - Linkin Park</li>
                    <li>♫ Bring Me To Life - Evanescence</li>
                    <li>♫ Somewhere I Belong</li>
                    <li>♫ Numb - Linkin Park</li>
                  </ul>
                </div>
              </div>

              <div className="text-center space-y-2">
                <img 
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                  alt="under construction" 
                  className="inline-block"
                />
                <p className="text-yellow-400 animate-pulse">🚧 UNDER CONSTRUCTION 🚧</p>
                <div className="flex justify-center gap-4 text-2xl">
                  <span className="animate-bounce">🔨</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>👷</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔨</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-400 text-xs">
                  Best viewed in Internet Explorer 6.0 at 800x600 resolution
                </p>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded">IE 6.0</span>
                  <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">800x600</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup Ads */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute bg-white border-2 border-gray-400 shadow-xl rounded overflow-hidden animate-scale-in"
          style={{
            left: popup.position.x,
            top: popup.position.y,
            minWidth: '280px',
            maxWidth: '320px',
            zIndex: 100 + popup.id,
          }}
        >
          {/* Popup Title Bar */}
          <div className="bg-gradient-to-r from-[#0054e3] to-[#388cef] px-2 py-1 flex items-center justify-between">
            <span className="text-white text-xs font-bold truncate">{popup.title}</span>
            <button 
              onClick={() => closePopup(popup.id, true)}
              className="w-5 h-5 bg-red-500 hover:bg-red-600 rounded-sm flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
          {/* Popup Content */}
          <div className="p-3 text-xs">
            {renderPopupContent(popup)}
          </div>
        </div>
      ))}

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-2 py-0.5 flex justify-between text-xs">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-blue-600" /> Done
        </span>
        <div className="flex items-center gap-4">
          <span>Internet | Protected Mode: On</span>
          <span className="text-gray-500">100%</span>
        </div>
      </div>

      {/* Clippy */}
      {showClippy && (
        <div className="absolute bottom-8 right-2 z-[200]">
          <Clippy context="browser" onDismiss={() => setShowClippy(false)} />
        </div>
      )}
    </div>
  );
};

export default InternetExplorerApp;