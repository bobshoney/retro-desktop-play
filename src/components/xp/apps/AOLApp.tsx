import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Users, Globe, Search, MessageCircle, Settings, Home, Star, ShoppingCart, Newspaper, Music, Video, GamepadIcon, Heart, CloudSun, X, Minus, Send } from 'lucide-react';
import aolIcon from '@/assets/icons/aol-icon.png';

interface Buddy {
  id: string;
  name: string;
  status: string;
  away: boolean;
  online: boolean;
  awayMessage?: string;
}

interface ChatMessage {
  from: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

interface ChatWindow {
  buddyId: string;
  buddyName: string;
  messages: ChatMessage[];
  isTyping: boolean;
  minimized: boolean;
}

const AWAY_MESSAGES = [
  "~*~If you're reading this, I'm probably at school~*~",
  "brb, dinner time! 🍕",
  "Away - Playing Runescape",
  "I'm not here right now... leave a message after the beep *beep*",
  "~*~ Gone 2 da mall w/ friends ~*~",
  "Homework... unfortunately 📚",
  "ZzZzZz sleeping ZzZzZz",
  "If I'm not back in 5 mins, wait longer",
  "AFK - Probably getting snacks",
  "~*~*~ Live Laugh Love ~*~*~",
];

const BOT_RESPONSES: Record<string, string[]> = {
  default: [
    "lol",
    "haha totally!",
    "omg really??",
    "brb sec",
    "yeah i know right",
    "that's so cool!",
    "no way!!!",
    "hehe :P",
    "gtg soon, mom says i gotta do homework",
    "did u see that new movie??",
    "wanna play runescape later?",
    "asl?",
    "wat r u up 2?",
    "nm u?",
    "same tbh",
  ],
  greeting: [
    "heyyy!! :)",
    "omg hiii!!!",
    "sup! long time no talk!",
    "heya! wuts up?",
    "yooo!!! :D",
  ],
  bye: [
    "ttyl!! 🙋",
    "gtg byeee!",
    "later! ✌️",
    "bbl!!",
    "cya l8r allig8r!",
    "peace out! ✌️",
  ],
};

const INITIAL_BUDDIES: Buddy[] = [
  { id: '1', name: 'xXSk8erBoiXx', status: 'Listening to Blink-182 🎸', away: false, online: true },
  { id: '2', name: 'BritneyFan2003', status: 'brb', away: true, online: true, awayMessage: "~*~At cheerleading practice~*~" },
  { id: '3', name: 'GameBoyMaster', status: 'Playing Runescape', away: false, online: true },
  { id: '4', name: 'PunkRockPrincess', status: '~*~im not like other girls~*~', away: false, online: true },
  { id: '5', name: 'DragonBallZFan', status: 'Its over 9000!!!', away: true, online: true, awayMessage: "Training to go Super Saiyan... BRB" },
  { id: '6', name: 'HarryPotterRules', status: '', away: false, online: false },
  { id: '7', name: 'SoccerStar99', status: '', away: false, online: false },
  { id: '8', name: 'CheerQueen04', status: '', away: false, online: false },
  { id: '9', name: 'LinkinParkFan', status: '', away: false, online: false },
  { id: '10', name: 'N64Champ', status: '', away: false, online: false },
  { id: '11', name: 'BugsCatcher', status: '', away: false, online: false },
  { id: '12', name: 'DDRMaster2003', status: '', away: false, online: false },
];

const AOLApp: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'mail' | 'im' | 'search'>('home');
  const [dialupProgress, setDialupProgress] = useState(0);
  const [connectionPhase, setConnectionPhase] = useState(0);
  const [buddies, setBuddies] = useState<Buddy[]>(INITIAL_BUDDIES);
  const [chatWindows, setChatWindows] = useState<ChatWindow[]>([]);
  const [myAwayMessage, setMyAwayMessage] = useState("brb, mom says dinner's ready 🍕");
  const [isAway, setIsAway] = useState(false);
  const [showAwayEditor, setShowAwayEditor] = useState(false);
  const [awayEditText, setAwayEditText] = useState(myAwayMessage);
  
  const dialupAudioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
  const mailAudioRef = useRef<HTMLAudioElement | null>(null);
  const buddyInRef = useRef<HTMLAudioElement | null>(null);
  const imSoundRef = useRef<HTMLAudioElement | null>(null);

  // Play buddy sign-on sound
  const playBuddyIn = useCallback(() => {
    const audio = new Audio('/sounds/aol-buddyin.ogg');
    audio.volume = 0.5;
    buddyInRef.current = audio;
    audio.play().catch(console.warn);
  }, []);

  // Play IM sound
  const playIMSound = useCallback(() => {
    const audio = new Audio('/sounds/aol-im.ogg');
    audio.volume = 0.5;
    imSoundRef.current = audio;
    audio.play().catch(console.warn);
  }, []);

  // Play goodbye sound
  const playGoodbye = useCallback(() => {
    const audio = new Audio('/sounds/aol-goodbye.ogg');
    audio.volume = 0.5;
    audio.play().catch(console.warn);
  }, []);

  // Simulate buddies signing on/off
  useEffect(() => {
    if (isConnecting || showWelcome) return;

    const interval = setInterval(() => {
      setBuddies(prev => {
        const offlineBuddies = prev.filter(b => !b.online);
        const onlineBuddies = prev.filter(b => b.online);
        
        // Randomly sign someone on or off
        if (Math.random() > 0.5 && offlineBuddies.length > 0) {
          // Sign someone on
          const buddy = offlineBuddies[Math.floor(Math.random() * offlineBuddies.length)];
          playBuddyIn();
          const awayMsg = AWAY_MESSAGES[Math.floor(Math.random() * AWAY_MESSAGES.length)];
          return prev.map(b => 
            b.id === buddy.id 
              ? { ...b, online: true, status: 'Online', away: Math.random() > 0.7, awayMessage: awayMsg }
              : b
          );
        } else if (onlineBuddies.length > 3) {
          // Sign someone off (keep at least 3 online)
          const buddy = onlineBuddies[Math.floor(Math.random() * onlineBuddies.length)];
          playGoodbye();
          return prev.map(b => 
            b.id === buddy.id ? { ...b, online: false, status: '' } : b
          );
        }
        return prev;
      });
    }, 15000 + Math.random() * 20000); // Random interval between 15-35 seconds

    return () => clearInterval(interval);
  }, [isConnecting, showWelcome, playBuddyIn, playGoodbye]);

  // Play dialup sound on mount
  useEffect(() => {
    if (isConnecting) {
      // Start dialup sound
      const dialupAudio = new Audio('/sounds/aol-dialup.mp3');
      dialupAudio.volume = 0.5;
      dialupAudioRef.current = dialupAudio;
      dialupAudio.play().catch(console.warn);

      const interval = setInterval(() => {
        setDialupProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Stop dialup sound
            if (dialupAudioRef.current) {
              dialupAudioRef.current.pause();
              dialupAudioRef.current = null;
            }
            setIsConnecting(false);
            setShowWelcome(true);
            
            // Play welcome sound
            const welcomeAudio = new Audio('/sounds/aol-welcome.ogg');
            welcomeAudio.volume = 0.6;
            welcomeAudioRef.current = welcomeAudio;
            welcomeAudio.play().catch(console.warn);
            
            setTimeout(() => {
              setShowWelcome(false);
            }, 2500);
            return 100;
          }
          
          // Update connection phase based on progress
          if (prev >= 80) setConnectionPhase(4);
          else if (prev >= 60) setConnectionPhase(3);
          else if (prev >= 40) setConnectionPhase(2);
          else if (prev >= 20) setConnectionPhase(1);
          
          return prev + Math.random() * 8;
        });
      }, 400);
      
      return () => {
        clearInterval(interval);
        if (dialupAudioRef.current) {
          dialupAudioRef.current.pause();
        }
      };
    }
  }, []);

  const playYouveGotMail = () => {
    const mailAudio = new Audio('/sounds/aol-youvegotmail.ogg');
    mailAudio.volume = 0.7;
    mailAudioRef.current = mailAudio;
    mailAudio.play().catch(console.warn);
  };

  const handleSectionChange = (section: typeof currentSection) => {
    if (section === 'mail') {
      playYouveGotMail();
    }
    setCurrentSection(section);
  };

  // Open chat window with buddy
  const openChat = useCallback((buddy: Buddy) => {
    if (!buddy.online) return;
    
    setChatWindows(prev => {
      // Check if chat already exists
      const existing = prev.find(c => c.buddyId === buddy.id);
      if (existing) {
        // Unminimize if minimized
        return prev.map(c => c.buddyId === buddy.id ? { ...c, minimized: false } : c);
      }
      
      // Create new chat window
      const newChat: ChatWindow = {
        buddyId: buddy.id,
        buddyName: buddy.name,
        messages: [],
        isTyping: false,
        minimized: false,
      };
      
      // If buddy is away, show away message
      if (buddy.away && buddy.awayMessage) {
        newChat.messages.push({
          from: buddy.name,
          text: `[Auto-Response] ${buddy.awayMessage}`,
          timestamp: new Date(),
          isMe: false,
        });
      }
      
      return [...prev, newChat];
    });
  }, []);

  // Close chat window
  const closeChat = useCallback((buddyId: string) => {
    setChatWindows(prev => prev.filter(c => c.buddyId !== buddyId));
  }, []);

  // Minimize chat window
  const minimizeChat = useCallback((buddyId: string) => {
    setChatWindows(prev => prev.map(c => 
      c.buddyId === buddyId ? { ...c, minimized: !c.minimized } : c
    ));
  }, []);

  // Send message
  const sendMessage = useCallback((buddyId: string, text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date();
    
    setChatWindows(prev => prev.map(chat => {
      if (chat.buddyId !== buddyId) return chat;
      
      const newMessage: ChatMessage = {
        from: 'You',
        text: text.trim(),
        timestamp,
        isMe: true,
      };
      
      return { ...chat, messages: [...chat.messages, newMessage] };
    }));

    // Simulate typing indicator and response
    const buddy = buddies.find(b => b.id === buddyId);
    if (buddy && !buddy.away) {
      // Show typing indicator after 500-1500ms
      setTimeout(() => {
        setChatWindows(prev => prev.map(c => 
          c.buddyId === buddyId ? { ...c, isTyping: true } : c
        ));
      }, 500 + Math.random() * 1000);

      // Send response after 2-5 seconds
      setTimeout(() => {
        playIMSound();
        
        // Choose response based on message content
        let responses = BOT_RESPONSES.default;
        const lowerText = text.toLowerCase();
        if (lowerText.includes('hi') || lowerText.includes('hey') || lowerText.includes('hello') || lowerText.includes('sup')) {
          responses = BOT_RESPONSES.greeting;
        } else if (lowerText.includes('bye') || lowerText.includes('gtg') || lowerText.includes('later') || lowerText.includes('cya')) {
          responses = BOT_RESPONSES.bye;
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        setChatWindows(prev => prev.map(chat => {
          if (chat.buddyId !== buddyId) return chat;
          
          const newMessage: ChatMessage = {
            from: buddy.name,
            text: response,
            timestamp: new Date(),
            isMe: false,
          };
          
          return { ...chat, messages: [...chat.messages, newMessage], isTyping: false };
        }));
      }, 2000 + Math.random() * 3000);
    } else if (buddy?.away) {
      // Auto-response for away buddy
      setTimeout(() => {
        playIMSound();
        setChatWindows(prev => prev.map(chat => {
          if (chat.buddyId !== buddyId) return chat;
          
          const newMessage: ChatMessage = {
            from: buddy.name,
            text: `[Auto-Response] ${buddy.awayMessage || "I'm away from my computer right now."}`,
            timestamp: new Date(),
            isMe: false,
          };
          
          return { ...chat, messages: [...chat.messages, newMessage] };
        }));
      }, 1000);
    }
  }, [buddies, playIMSound]);

  const connectionMessages = [
    "Initializing modem...",
    "Dialing 1-800-AOL-HELP...",
    "Connecting to AOL network...",
    "Verifying username and password...",
    "Loading your AOL experience..."
  ];

  const onlineBuddies = buddies.filter(b => b.online);
  const offlineBuddies = buddies.filter(b => !b.online);

  if (isConnecting) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#003087] to-[#001a4d] text-white font-xp">
        <div className="text-center">
          {/* AOL Logo */}
          <div className="mb-6">
            <img src={aolIcon} alt="AOL" className="w-16 h-16 mx-auto mb-2" />
            <div className="text-3xl font-bold tracking-wide">AOL</div>
            <div className="text-sm text-blue-200">America Online 9.0</div>
          </div>
          
          {/* Connection Animation */}
          <div className="w-72 bg-[#001a4d] border border-blue-400/50 rounded p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse">
                <Globe className="w-6 h-6 text-[#003087]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">Connecting...</div>
                <div className="text-xs text-blue-200">{Math.round(dialupProgress)}% complete</div>
              </div>
            </div>
            
            <div className="w-full bg-[#001030] rounded h-3 overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                style={{ width: `${dialupProgress}%` }}
              />
            </div>
            
            <div className="text-xs text-center text-blue-200 animate-pulse min-h-[1.5rem]">
              {connectionMessages[connectionPhase]}
            </div>
          </div>
          
          {/* Modem sounds indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-blue-300">
            <div className="flex gap-1">
              {[0,1,2,3,4].map(i => (
                <div 
                  key={i} 
                  className="w-1 bg-yellow-400 rounded-full animate-pulse"
                  style={{ 
                    height: `${8 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <span>📞 Modem connecting...</span>
          </div>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-b from-[#003087] to-[#001a4d] text-white">
        <div className="text-center">
          <img src={aolIcon} alt="AOL" className="w-20 h-20 mx-auto mb-4 animate-bounce" />
          <div className="text-4xl font-bold text-yellow-400 mb-4">Welcome!</div>
          <div className="text-2xl flex items-center justify-center gap-2">
            <Mail className="w-8 h-8 text-yellow-400" />
            <span>You've Got Mail!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#ece9d8] font-xp text-sm">
      {/* AOL Toolbar */}
      <div className="bg-gradient-to-b from-[#5a8fd4] to-[#003087] p-1.5 border-b border-[#001a4d]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-yellow-300 to-yellow-500 text-[#003087] font-bold px-3 py-1 rounded shadow-sm">
            <img src={aolIcon} alt="" className="w-4 h-4" />
            <span>AOL</span>
          </div>
          <div className="flex gap-0.5 ml-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'mail', icon: Mail, label: 'Mail' },
              { id: 'im', icon: MessageCircle, label: 'AIM' },
              { id: 'search', icon: Search, label: 'Search' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id as typeof currentSection)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white transition-all
                  ${currentSection === item.id 
                    ? 'bg-white/30 shadow-inner' 
                    : 'hover:bg-white/20'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="text-white/80 hover:text-white p-1">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-b from-[#f5f3e8] to-[#e8e6db] p-2 border-b border-gray-300 flex gap-2">
        <div className="flex-1 flex items-center bg-white border border-gray-400 rounded-sm px-2 shadow-inner">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search the web with AOL..."
            className="flex-1 px-2 py-1.5 text-xs outline-none bg-transparent"
          />
        </div>
        <button className="bg-gradient-to-b from-[#4a8cd4] to-[#003087] text-white px-4 py-1 rounded text-xs font-bold shadow hover:from-[#5a9ce4] transition-all">
          Search
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        {currentSection === 'home' && (
          <div className="p-4">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#003087] via-[#0050a0] to-[#4a7cbc] text-white p-4 rounded-lg mb-4 shadow-lg">
              <div className="flex items-center gap-3">
                <img src={aolIcon} alt="" className="w-12 h-12" />
                <div>
                  <h1 className="text-xl font-bold">Welcome, XP_User!</h1>
                  <p className="text-sm text-blue-200">Today is a great day to surf the web!</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { icon: Mail, label: '3 New Emails', color: 'from-yellow-400 to-orange-400', onClick: () => handleSectionChange('mail') },
                { icon: Users, label: '5 Buddies Online', color: 'from-green-400 to-green-600', onClick: () => handleSectionChange('im') },
                { icon: Star, label: 'My Favorites', color: 'from-purple-400 to-purple-600' },
                { icon: ShoppingCart, label: 'AOL Shop', color: 'from-blue-400 to-blue-600' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={item.onClick}
                  className={`bg-gradient-to-br ${item.color} p-3 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform shadow-md text-white`}
                >
                  <item.icon className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Channel Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon: Newspaper, label: 'News', desc: 'Latest Headlines' },
                { icon: CloudSun, label: 'Weather', desc: 'Local Forecast' },
                { icon: Music, label: 'Music', desc: 'AOL Music' },
                { icon: Video, label: 'Movies', desc: 'MovieFone' },
                { icon: GamepadIcon, label: 'Games', desc: 'Play Free' },
                { icon: Heart, label: 'Dating', desc: 'AOL Personals' },
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded p-3 hover:bg-blue-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#003087] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#003087]">{item.label}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* News Section */}
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#003087] to-[#0050a0] text-white px-3 py-2 font-bold text-sm flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                AOL News - January 2003
              </div>
              <div className="p-3 space-y-2 text-xs">
                {[
                  { tag: 'BREAKING', text: 'New Matrix Sequel Coming This Summer!', hot: true },
                  { tag: 'TECH', text: 'Is This "iPod" Thing Just a Fad?' },
                  { tag: 'ENTERTAINMENT', text: 'American Idol Season 2 Premieres Tonight' },
                  { tag: 'SPORTS', text: 'Lakers Dynasty Continues' },
                ].map((news, i) => (
                  <div key={i} className="flex items-start gap-2 border-b last:border-0 pb-2 last:pb-0 cursor-pointer hover:text-blue-600">
                    <span className={`text-[10px] font-bold px-1 rounded ${news.hot ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                      {news.tag}
                    </span>
                    <span>{news.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Classic AOL Ad */}
            <div className="mt-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 p-3 rounded-lg text-center shadow-sm">
              <div className="text-sm font-bold text-red-600 animate-pulse flex items-center justify-center gap-2">
                🎉 CONGRATULATIONS! You are the 1,000,000th visitor! 🎉
              </div>
              <div className="text-xs text-gray-700 mt-1">
                Click here to claim your FREE iPod Mini!*
              </div>
              <div className="text-[10px] text-gray-400 mt-1 italic">
                *This is a nostalgic joke. No iPods were harmed.
              </div>
            </div>
          </div>
        )}

        {currentSection === 'mail' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-[#003087]" />
              <h2 className="font-bold text-lg text-[#003087]">AOL Mail</h2>
              <span className="bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">3 new</span>
            </div>
            
            {/* Mail toolbar */}
            <div className="flex gap-2 mb-3">
              {['Write', 'Reply', 'Forward', 'Delete'].map(action => (
                <button key={action} className="bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 px-3 py-1 rounded text-xs hover:from-gray-200 hover:to-gray-300 shadow-sm">
                  {action}
                </button>
              ))}
            </div>
            
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-bold flex">
                <span className="w-6"></span>
                <span className="w-32">From</span>
                <span className="flex-1">Subject</span>
                <span className="w-16 text-right">Date</span>
              </div>
              {[
                { from: 'AOL Team', subject: 'Welcome to AOL 9.0!', date: 'Jan 15', unread: true },
                { from: 'Mom', subject: 'FW: FW: FW: Funny Cat Pictures!!!', date: 'Jan 14', unread: true },
                { from: 'A Friend', subject: 'Check out this cool website!!1!', date: 'Jan 13', unread: true },
                { from: 'Nigerian Prince', subject: 'URGENT BUSINESS PROPOSAL', date: 'Jan 12', unread: false },
                { from: 'AOL Deals', subject: 'Get 500 FREE Hours of AOL!', date: 'Jan 10', unread: false },
              ].map((email, i) => (
                <div key={i} className={`flex items-center px-3 py-2 border-b last:border-0 cursor-pointer hover:bg-blue-50 ${email.unread ? 'bg-yellow-50 font-semibold' : ''}`}>
                  <Mail className={`w-4 h-4 mr-2 ${email.unread ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <span className="w-32 truncate text-xs">{email.from}</span>
                  <span className="flex-1 truncate text-xs">{email.subject}</span>
                  <span className="w-16 text-right text-xs text-gray-500">{email.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSection === 'im' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-[#003087]" />
                <h2 className="font-bold text-lg text-[#003087]">AIM Buddy List</h2>
              </div>
              <button 
                onClick={() => setIsAway(!isAway)}
                className={`text-xs px-3 py-1 rounded border ${
                  isAway 
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-700' 
                    : 'bg-green-100 border-green-400 text-green-700'
                }`}
              >
                {isAway ? '🌙 Away' : '🟢 Available'}
              </button>
            </div>
            
            <div className="bg-gradient-to-b from-[#fffef5] to-[#fff8dc] border-2 border-[#d4a574] rounded-lg p-3 shadow-inner">
              <div className="font-bold text-xs mb-3 text-[#003087] border-b border-[#ddd] pb-2">
                Buddies ({onlineBuddies.length}/{buddies.length})
              </div>
              
              {/* Online Buddies */}
              <div className="space-y-1 text-xs mb-3">
                {onlineBuddies.map((buddy) => (
                  <div 
                    key={buddy.id} 
                    onClick={() => openChat(buddy)}
                    className="flex items-center gap-2 p-2 hover:bg-yellow-100 cursor-pointer rounded transition-colors group"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${buddy.away ? 'bg-yellow-500' : 'bg-green-500'} shadow-sm`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{buddy.name}</span>
                        {buddy.away && <span className="text-gray-500">(Away)</span>}
                      </div>
                      <div className="text-[10px] text-gray-500 italic truncate">{buddy.status}</div>
                    </div>
                    <MessageCircle className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              
              {/* Offline Buddies */}
              <div className="font-bold text-xs mt-4 mb-2 text-gray-500 border-t border-[#ddd] pt-2">
                Offline ({offlineBuddies.length})
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                {offlineBuddies.map((buddy) => (
                  <div key={buddy.id} className="flex items-center gap-2 p-1 pl-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span className="italic">{buddy.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Away Message Section */}
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-purple-700">Your Away Message:</div>
                <button 
                  onClick={() => {
                    setAwayEditText(myAwayMessage);
                    setShowAwayEditor(!showAwayEditor);
                  }}
                  className="text-purple-600 hover:text-purple-800 text-[10px] underline"
                >
                  {showAwayEditor ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {showAwayEditor ? (
                <div className="space-y-2">
                  <textarea
                    value={awayEditText}
                    onChange={(e) => setAwayEditText(e.target.value)}
                    className="w-full border border-purple-300 rounded p-2 text-xs resize-none"
                    rows={2}
                    placeholder="Enter your away message..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setMyAwayMessage(awayEditText);
                        setShowAwayEditor(false);
                      }}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-[10px]"
                    >
                      Save
                    </button>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setAwayEditText(e.target.value);
                        }
                      }}
                      className="border border-purple-300 rounded text-[10px] px-1"
                      defaultValue=""
                    >
                      <option value="">Pick a classic...</option>
                      {AWAY_MESSAGES.map((msg, i) => (
                        <option key={i} value={msg}>{msg.substring(0, 30)}...</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="italic text-gray-600">"{myAwayMessage}"</div>
              )}
            </div>
            
            {/* Easter egg tips */}
            <div className="mt-4 text-[10px] text-gray-400 text-center">
              <div>💡 Tip: Double-click a buddy to open a chat window!</div>
              <div className="mt-1">🎵 Listen for the door sound when buddies sign on/off</div>
            </div>
          </div>
        )}

        {currentSection === 'search' && (
          <div className="p-6 text-center">
            <img src={aolIcon} alt="AOL" className="w-16 h-16 mx-auto mb-4" />
            <div className="text-2xl font-bold text-[#003087] mb-4">AOL Search</div>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search the World Wide Web..."
                  className="flex-1 border-2 border-[#003087] rounded px-3 py-2 text-sm shadow-inner"
                />
                <button className="bg-gradient-to-b from-[#4a8cd4] to-[#003087] text-white px-6 py-2 rounded font-bold shadow hover:from-[#5a9ce4] transition-all">
                  Search
                </button>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Powered by Google™
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Neopets', 'MySpace', 'Runescape', 'MapQuest', 'Homestar Runner', 'eBaums World', 'Newgrounds', 'Yahoo Games'].map(term => (
                  <div key={term} className="bg-gray-100 px-3 py-1.5 rounded cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    {term}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Windows */}
      {chatWindows.map((chat, index) => (
        <ChatWindowComponent
          key={chat.buddyId}
          chat={chat}
          index={index}
          onClose={() => closeChat(chat.buddyId)}
          onMinimize={() => minimizeChat(chat.buddyId)}
          onSendMessage={(text) => sendMessage(chat.buddyId, text)}
          playIMSound={playIMSound}
        />
      ))}

      {/* Status Bar */}
      <div className="bg-gradient-to-b from-[#ece9d8] to-[#d4d0c8] border-t border-gray-400 px-3 py-1.5 text-xs flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAway ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span>Connected at 56.6 Kbps</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Welcome, XP_User</span>
          <button className="text-red-600 hover:underline">Sign Off</button>
        </div>
      </div>
    </div>
  );
};

// Chat Window Component
interface ChatWindowComponentProps {
  chat: ChatWindow;
  index: number;
  onClose: () => void;
  onMinimize: () => void;
  onSendMessage: (text: string) => void;
  playIMSound: () => void;
}

const ChatWindowComponent: React.FC<ChatWindowComponentProps> = ({ 
  chat, index, onClose, onMinimize, onSendMessage, playIMSound 
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      playIMSound();
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (chat.minimized) {
    return (
      <div 
        onClick={onMinimize}
        className="fixed bottom-12 bg-gradient-to-b from-[#5a8fd4] to-[#003087] text-white px-3 py-1 rounded-t text-xs font-bold cursor-pointer hover:from-[#6a9fe4] flex items-center gap-2 shadow-lg"
        style={{ left: `${100 + index * 150}px` }}
      >
        <MessageCircle className="w-3 h-3" />
        {chat.buddyName}
      </div>
    );
  }

  return (
    <div 
      className="fixed bg-[#ece9d8] border-2 border-gray-500 rounded shadow-xl flex flex-col font-xp"
      style={{ 
        width: '320px',
        height: '350px',
        bottom: `${50 + (index % 3) * 30}px`,
        right: `${20 + index * 30}px`,
        zIndex: 1000 + index
      }}
    >
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-[#0a246a] via-[#1b4ba0] to-[#0a246a] px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white text-xs font-bold">
          <MessageCircle className="w-3 h-3" />
          <span>{chat.buddyName} - Instant Message</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={onMinimize}
            className="w-4 h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-sm flex items-center justify-center hover:from-gray-300 hover:to-gray-500"
          >
            <Minus className="w-2 h-2 text-black" />
          </button>
          <button 
            onClick={onClose}
            className="w-4 h-4 bg-gradient-to-b from-red-400 to-red-600 rounded-sm flex items-center justify-center hover:from-red-500 hover:to-red-700"
          >
            <X className="w-2 h-2 text-white" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white border border-gray-300 m-2 mb-0 overflow-y-auto p-2 text-xs">
        {chat.messages.length === 0 && (
          <div className="text-gray-400 italic text-center py-4">
            Start a conversation with {chat.buddyName}!
            <div className="text-[10px] mt-2">
              Remember: What happens in AIM stays in AIM 🤫
            </div>
          </div>
        )}
        
        {chat.messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className={`font-bold ${msg.isMe ? 'text-red-600' : 'text-blue-600'}`}>
              {msg.from}:
            </span>
            {' '}
            <span className={msg.text.startsWith('[Auto-Response]') ? 'italic text-gray-500' : ''}>
              {msg.text}
            </span>
            <span className="text-[9px] text-gray-400 ml-2">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {chat.isTyping && (
          <div className="text-gray-500 italic flex items-center gap-1">
            <span>{chat.buddyName} is typing</span>
            <span className="animate-pulse">...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 border-t border-gray-300">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border border-gray-400 rounded px-2 py-1 text-xs shadow-inner"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-b from-[#4a8cd4] to-[#003087] text-white px-3 py-1 rounded text-xs font-bold shadow hover:from-[#5a9ce4]"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
          <span>😀</span>
          <span>😂</span>
          <span>😍</span>
          <span>🙄</span>
          <span>😎</span>
          <span>👍</span>
          <span className="ml-auto">Warn | Block</span>
        </div>
      </div>
    </div>
  );
};

export default AOLApp;