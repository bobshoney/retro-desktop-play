import React, { useState, useEffect, useRef } from 'react';
import { Mail, Users, Globe, Search, MessageCircle, Settings, Home, Star, ShoppingCart } from 'lucide-react';
import { useXPSounds } from '@/hooks/useXPSounds';

const AOLApp: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'mail' | 'im' | 'search'>('home');
  const [dialupProgress, setDialupProgress] = useState(0);
  const { playDialup, stopDialup, playAOLWelcome, playIMReceive, playBuddySignOn, playClick } = useXPSounds();
  const dialupStarted = useRef(false);

  // Start dialup sound on mount
  useEffect(() => {
    if (isConnecting && !dialupStarted.current) {
      dialupStarted.current = true;
      playDialup();
    }
  }, [isConnecting, playDialup]);

  useEffect(() => {
    if (isConnecting) {
      const interval = setInterval(() => {
        setDialupProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            stopDialup();
            setIsConnecting(false);
            setShowWelcome(true);
            playAOLWelcome();
            setTimeout(() => {
              setShowWelcome(false);
              playBuddySignOn();
            }, 2500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isConnecting, stopDialup, playAOLWelcome, playBuddySignOn]);

  if (isConnecting) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#003087] text-white font-xp">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">AOL</div>
          <div className="text-lg mb-6">America Online 9.0</div>
          
          <div className="w-64 bg-[#001a4d] rounded h-4 overflow-hidden mb-4">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${dialupProgress}%` }}
            />
          </div>
          
          <div className="text-sm animate-pulse">
            {dialupProgress < 30 && "Dialing..."}
            {dialupProgress >= 30 && dialupProgress < 60 && "Connecting to AOL..."}
            {dialupProgress >= 60 && dialupProgress < 90 && "Verifying username and password..."}
            {dialupProgress >= 90 && "Initializing AOL..."}
          </div>
          
          <div className="mt-4 text-xs text-blue-200 italic">
            🔊 *dial-up modem sounds* BEEEP BOOP KSSSHHHH
          </div>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="h-full flex items-center justify-center bg-[#003087] text-white">
        <div className="text-center animate-pulse">
          <div className="text-3xl font-bold text-yellow-400 mb-4">Welcome!</div>
          <div className="text-xl">You've Got Mail! 📧</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#ece9d8] font-xp text-sm">
      {/* AOL Toolbar */}
      <div className="bg-gradient-to-b from-[#4a7cbc] to-[#003087] p-1">
        <div className="flex items-center gap-1">
          <div className="bg-yellow-400 text-black font-bold px-3 py-0.5 rounded text-sm">
            AOL
          </div>
          <div className="flex gap-1 ml-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'mail', icon: Mail, label: 'Mail' },
              { id: 'im', icon: MessageCircle, label: 'AIM' },
              { id: 'search', icon: Search, label: 'Search' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  playClick();
                  if (item.id === 'mail') playIMReceive();
                  setCurrentSection(item.id as typeof currentSection);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-white hover:bg-white/20 ${
                  currentSection === item.id ? 'bg-white/30' : ''
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#f5f3e8] p-2 border-b border-gray-300 flex gap-2">
        <div className="flex-1 flex items-center bg-white border border-gray-400 rounded px-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search the web with AOL..."
            className="flex-1 px-2 py-1 text-xs outline-none"
          />
        </div>
        <button className="xp-button text-xs">Search</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        {currentSection === 'home' && (
          <div className="p-4">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#003087] to-[#4a7cbc] text-white p-4 rounded mb-4">
              <h1 className="text-xl font-bold">Welcome, XP_User!</h1>
              <p className="text-sm text-blue-200">Today is a great day to surf the web!</p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon: Mail, label: '3 New Emails', color: 'bg-yellow-400' },
                { icon: Users, label: '5 Buddies Online', color: 'bg-green-400' },
                { icon: Star, label: 'My Favorites', color: 'bg-purple-400' },
              ].map((item, i) => (
                <div key={i} className={`${item.color} p-3 rounded text-center cursor-pointer hover:opacity-80`}>
                  <item.icon className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

            {/* News Section */}
            <div className="border border-gray-300 rounded">
              <div className="bg-[#003087] text-white px-3 py-1 font-bold text-sm">
                📰 AOL News - January 2003
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="border-b pb-2 cursor-pointer hover:text-blue-600">
                  <strong>BREAKING:</strong> New Matrix Sequel Coming This Summer!
                </div>
                <div className="border-b pb-2 cursor-pointer hover:text-blue-600">
                  <strong>TECH:</strong> Is This "iPod" Thing Just a Fad?
                </div>
                <div className="border-b pb-2 cursor-pointer hover:text-blue-600">
                  <strong>ENTERTAINMENT:</strong> American Idol Season 2 Premieres Tonight
                </div>
                <div className="cursor-pointer hover:text-blue-600">
                  <strong>SPORTS:</strong> Lakers Dynasty Continues
                </div>
              </div>
            </div>

            {/* Ads - authentic 2003 style */}
            <div className="mt-4 bg-yellow-100 border border-yellow-400 p-2 rounded text-center">
              <div className="text-xs font-bold text-red-600 animate-pulse">
                🎉 CONGRATULATIONS! You are the 1,000,000th visitor! 🎉
              </div>
              <div className="text-xs text-gray-600">
                Click here to claim your FREE iPod Mini!*
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                *This is a nostalgic joke. No iPods were harmed.
              </div>
            </div>
          </div>
        )}

        {currentSection === 'mail' && (
          <div className="p-4">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" /> AOL Mail
            </h2>
            <div className="space-y-2">
              {[
                { from: 'AOL Team', subject: 'Welcome to AOL 9.0!', date: 'Jan 15', unread: true },
                { from: 'Mom', subject: 'FW: FW: FW: Funny Cat Pictures!!!', date: 'Jan 14', unread: true },
                { from: 'A Friend', subject: 'Check out this cool website!!1!', date: 'Jan 13', unread: true },
                { from: 'Nigerian Prince', subject: 'URGENT BUSINESS PROPOSAL', date: 'Jan 12', unread: false },
                { from: 'AOL Deals', subject: 'Get 500 FREE Hours of AOL!', date: 'Jan 10', unread: false },
              ].map((email, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-blue-50 ${email.unread ? 'bg-yellow-50 font-semibold' : ''}`}>
                  <Mail className={`w-4 h-4 ${email.unread ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <span className="w-24 truncate text-xs">{email.from}</span>
                  <span className="flex-1 truncate text-xs">{email.subject}</span>
                  <span className="text-xs text-gray-500">{email.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSection === 'im' && (
          <div className="p-4">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> AIM Buddy List
            </h2>
            <div className="bg-[#fffde8] border border-[#ddd] rounded p-3">
              <div className="font-bold text-xs mb-2">Buddies (5/12)</div>
              <div className="space-y-1 text-xs">
                {[
                  { name: 'xXSk8erBoiXx', status: 'online', away: false },
                  { name: 'BritneyFan2003', status: 'away', away: true },
                  { name: 'GameBoyMaster', status: 'online', away: false },
                  { name: 'PunkRockPrincess', status: 'online', away: false },
                  { name: 'DragonBallZFan', status: 'away', away: true },
                ].map((buddy, i) => (
                  <div key={i} className="flex items-center gap-2 p-1 hover:bg-yellow-100 cursor-pointer rounded">
                    <div className={`w-2 h-2 rounded-full ${buddy.away ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <span>{buddy.name}</span>
                    {buddy.away && <span className="text-gray-500 italic">(Away)</span>}
                  </div>
                ))}
              </div>
              <div className="font-bold text-xs mt-3 mb-2 text-gray-500">Offline (7)</div>
              <div className="text-xs text-gray-400 italic">
                HarryPotterRules, SoccerStar99, CheerQueen04...
              </div>
            </div>
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-center italic">
              Away Message: "brb, mom says dinner's ready 🍕"
            </div>
          </div>
        )}

        {currentSection === 'search' && (
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-[#003087] mb-4">AOL Search</div>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search the World Wide Web..."
                  className="flex-1 border-2 border-[#003087] rounded px-3 py-2 text-sm"
                />
                <button className="bg-[#003087] text-white px-4 py-2 rounded font-bold">
                  Search
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Popular searches: Neopets, MySpace, Runescape, MapQuest
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-2 py-1 text-xs flex justify-between">
        <span>✓ Connected at 56.6 Kbps</span>
        <span>Welcome, XP_User | Sign Off</span>
      </div>
    </div>
  );
};

export default AOLApp;
