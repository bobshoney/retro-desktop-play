import { useState, useEffect, useRef } from 'react';
import { User, Send, Smile, Phone, Video, Mail, Music, Settings, X, Minus, ChevronDown, MessageCircle } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'away' | 'busy' | 'offline' | 'appear-offline';
  statusMessage?: string;
  avatar?: string;
}

interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: Date;
  isNudge?: boolean;
}

const MSNMessengerApp: React.FC = () => {
  const [view, setView] = useState<'contacts' | 'chat'>('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [myStatus, setMyStatus] = useState<Contact['status']>('online');
  const [isNudging, setIsNudging] = useState(false);
  const [showEmoticons, setShowEmoticons] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const contacts: Contact[] = [
    { id: '1', name: 'xXxDarkAngelxXx', email: 'darkangel@hotmail.com', status: 'online', statusMessage: '~*~LiViN lIfE~*~' },
    { id: '2', name: 'sk8erboi2003', email: 'sk8er@hotmail.com', status: 'away', statusMessage: 'brb mom needs the phone' },
    { id: '3', name: 'pRiNcEsS_SpArKLe', email: 'princess@hotmail.com', status: 'online', statusMessage: '♥IfYouCantHandleMeAtMyWorst...♥' },
    { id: '4', name: 'L33tHax0r', email: 'hacker@hotmail.com', status: 'busy', statusMessage: 'downloading the internet' },
    { id: '5', name: 'BrItNeY_FaN_4EvA', email: 'britney@hotmail.com', status: 'online', statusMessage: '~*~HiT mE bAbY oNe MoRe TiMe~*~' },
    { id: '6', name: 'NiCkElBaCk_RuLeZ', email: 'rock@hotmail.com', status: 'offline' },
    { id: '7', name: 'AzN_PrYdE_88', email: 'azn@hotmail.com', status: 'appear-offline' },
    { id: '8', name: 'xxxSephirothxxx', email: 'ff7@hotmail.com', status: 'online', statusMessage: 'Estuans interius ira vehementi' },
  ];

  const emoticons = ['😊', '😂', '😍', '😭', '😎', '🙄', '😡', '💀', '🔥', '💯', '❤️', '💔', '✨', '🎵', '🎮', '👻'];

  const autoReplies = [
    "lol thats so funny 😂",
    "brb mom calling",
    "a/s/l?",
    "omg rly?!",
    "kk ttyl",
    "rofl ur so random XD",
    "g2g dinner time",
    "*~*~*hugs*~*~*",
    "lmao im dying 💀",
    "same tbh",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: 'me',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Auto-reply after a delay
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: selectedContact.name,
        text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500 + Math.random() * 2000);
  };

  const handleNudge = () => {
    if (!selectedContact) return;
    setIsNudging(true);
    
    const nudgeMessage: Message = {
      id: Date.now().toString(),
      from: 'me',
      text: '',
      timestamp: new Date(),
      isNudge: true,
    };
    setMessages(prev => [...prev, nudgeMessage]);

    setTimeout(() => setIsNudging(false), 500);

    // Reply with nudge
    setTimeout(() => {
      const replyNudge: Message = {
        id: (Date.now() + 1).toString(),
        from: selectedContact.name,
        text: '',
        timestamp: new Date(),
        isNudge: true,
      };
      setMessages(prev => [...prev, replyNudge]);
      setIsNudging(true);
      setTimeout(() => setIsNudging(false), 500);
    }, 2000);
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'appear-offline':
      case 'offline': return 'bg-gray-400';
    }
  };

  const openChat = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages([]);
    setView('chat');
  };

  if (view === 'chat' && selectedContact) {
    return (
      <div className={`h-full flex flex-col bg-gradient-to-b from-[#4b9cd3] to-[#1a5276] ${isNudging ? 'animate-[shake_0.1s_ease-in-out_5]' : ''}`}>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}</style>
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#6ba7d1] to-[#4b9cd3] p-2 flex items-center justify-between border-b border-[#3a7ca5]">
          <div className="flex items-center gap-2">
            <button onClick={() => setView('contacts')} className="text-white hover:bg-white/20 p-1 rounded">
              ←
            </button>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedContact.status)}`} />
            <span className="text-white font-bold text-sm">{selectedContact.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-white hover:bg-white/20 p-1 rounded" title="Voice Call">
              <Phone className="w-4 h-4" />
            </button>
            <button className="text-white hover:bg-white/20 p-1 rounded" title="Video Call">
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white overflow-y-auto p-2 space-y-2">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-4">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
              Start chatting with {selectedContact.name}!
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`${msg.from === 'me' ? 'text-right' : 'text-left'}`}>
              {msg.isNudge ? (
                <div className="text-center text-orange-500 text-xs italic">
                  {msg.from === 'me' ? 'You' : selectedContact.name} sent a nudge! 👊
                </div>
              ) : (
                <div className={`inline-block max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.from === 'me' 
                    ? 'bg-[#6ba7d1] text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="font-bold text-xs mb-1">
                    {msg.from === 'me' ? 'You' : msg.from}
                  </div>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Emoticons Popup */}
        {showEmoticons && (
          <div className="bg-[#ffffd5] border border-gray-400 p-2 grid grid-cols-8 gap-1">
            {emoticons.map((emoji, i) => (
              <button
                key={i}
                className="hover:bg-yellow-200 p-1 rounded text-lg"
                onClick={() => {
                  setInputText(prev => prev + emoji);
                  setShowEmoticons(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="bg-[#d4e4f1] p-2 border-t border-[#a5c4de]">
          <div className="flex items-center gap-1 mb-2">
            <button 
              className="text-xs bg-[#6ba7d1] text-white px-2 py-1 rounded hover:bg-[#5a96c0]"
              onClick={handleNudge}
            >
              👊 Nudge
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded ${showEmoticons ? 'bg-yellow-300' : 'bg-[#6ba7d1] text-white hover:bg-[#5a96c0]'}`}
              onClick={() => setShowEmoticons(!showEmoticons)}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-2 py-1 text-sm border border-gray-400 rounded focus:outline-none focus:border-[#6ba7d1]"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#6ba7d1] text-white px-3 py-1 rounded hover:bg-[#5a96c0]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#6ba7d1] to-[#4b9cd3]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4b9cd3] to-[#1a5276] p-3 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm">~*~YourName~*~</div>
            <div className="text-xs flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(myStatus)}`} />
              <select 
                value={myStatus}
                onChange={(e) => setMyStatus(e.target.value as Contact['status'])}
                className="bg-transparent text-xs border-none outline-none cursor-pointer"
              >
                <option value="online" className="text-black">Online</option>
                <option value="away" className="text-black">Away</option>
                <option value="busy" className="text-black">Busy</option>
                <option value="appear-offline" className="text-black">Appear Offline</option>
              </select>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Type a personal message"
          className="w-full px-2 py-1 text-xs bg-white/20 rounded border border-white/30 text-white placeholder-white/60 focus:outline-none"
        />
      </div>

      {/* MSN Logo Banner */}
      <div className="bg-gradient-to-r from-[#ff6600] via-[#ff9933] to-[#ffcc00] px-3 py-1 text-white text-center font-bold text-sm flex items-center justify-center gap-2">
        <span className="text-lg">🦋</span>
        MSN Messenger
        <span className="text-lg">🦋</span>
      </div>

      {/* Contacts List */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-2 border-b border-gray-200 bg-[#e8f4fc]">
          <div className="text-xs font-bold text-[#1a5276] flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Online ({contacts.filter(c => c.status === 'online').length})
          </div>
        </div>
        
        {contacts.filter(c => c.status === 'online').map(contact => (
          <div
            key={contact.id}
            className="flex items-center gap-2 p-2 hover:bg-[#d4e4f1] cursor-pointer border-b border-gray-100"
            onDoubleClick={() => openChat(contact)}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{contact.name}</div>
              {contact.statusMessage && (
                <div className="text-xs text-gray-500 truncate italic">{contact.statusMessage}</div>
              )}
            </div>
          </div>
        ))}

        <div className="p-2 border-b border-gray-200 bg-[#e8f4fc]">
          <div className="text-xs font-bold text-[#1a5276] flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Away/Busy ({contacts.filter(c => c.status === 'away' || c.status === 'busy').length})
          </div>
        </div>

        {contacts.filter(c => c.status === 'away' || c.status === 'busy').map(contact => (
          <div
            key={contact.id}
            className="flex items-center gap-2 p-2 hover:bg-[#d4e4f1] cursor-pointer border-b border-gray-100 opacity-70"
            onDoubleClick={() => openChat(contact)}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{contact.name}</div>
              {contact.statusMessage && (
                <div className="text-xs text-gray-500 truncate italic">{contact.statusMessage}</div>
              )}
            </div>
          </div>
        ))}

        <div className="p-2 border-b border-gray-200 bg-[#e8f4fc]">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Offline ({contacts.filter(c => c.status === 'offline' || c.status === 'appear-offline').length})
          </div>
        </div>

        {contacts.filter(c => c.status === 'offline' || c.status === 'appear-offline').map(contact => (
          <div
            key={contact.id}
            className="flex items-center gap-2 p-2 hover:bg-[#d4e4f1] cursor-pointer border-b border-gray-100 opacity-50"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-gray-500">{contact.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="bg-[#d4e4f1] p-2 flex items-center justify-around border-t border-[#a5c4de]">
        <button className="flex flex-col items-center text-[#1a5276] hover:bg-white/50 p-1 rounded">
          <Mail className="w-5 h-5" />
          <span className="text-[10px]">E-mail</span>
        </button>
        <button className="flex flex-col items-center text-[#1a5276] hover:bg-white/50 p-1 rounded">
          <Music className="w-5 h-5" />
          <span className="text-[10px]">Music</span>
        </button>
        <button className="flex flex-col items-center text-[#1a5276] hover:bg-white/50 p-1 rounded">
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Options</span>
        </button>
      </div>

      {/* Ad Banner */}
      <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 p-1 text-center text-xs border-t border-yellow-300">
        <span className="text-red-600 font-bold animate-pulse">★ HOT! ★</span>
        {' '}Download FREE ringtones for your phone!{' '}
        <span className="text-blue-600 underline cursor-pointer">Click Here</span>
      </div>
    </div>
  );
};

export default MSNMessengerApp;
