import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ClippyProps {
  context?: 'desktop' | 'notepad' | 'browser' | 'paint' | 'general';
  onDismiss?: () => void;
}

const clippyTips: Record<string, string[]> = {
  desktop: [
    "It looks like you're trying to use a computer! Would you like help?",
    "Did you know you can double-click icons to open them? Revolutionary!",
    "I see you have a lot of icons. Would you like me to organize them alphabetically?",
    "Pro tip: The Start button is usually a good place to start!",
    "You seem lost. Have you tried clicking on things randomly?",
  ],
  notepad: [
    "It looks like you're writing a letter. Would you like help?",
    "I noticed you haven't saved in a while. Are you feeling lucky?",
    "That's a lot of words! Would you like me to count them for you?",
    "Have you considered using Comic Sans? It's very professional!",
    "I see you're typing. Would you like me to autocomplete with random words?",
  ],
  browser: [
    "It looks like you're browsing the internet! Would you like to install more toolbars?",
    "I noticed you're on a webpage. Would you like to make it your homepage?",
    "Have you tried Ask Jeeves? He's very helpful, like me!",
    "That's a suspicious link! Just kidding, I have no idea.",
    "Would you like to download more RAM? I know a guy.",
    "I see you're searching. Would you like me to search for you while you search?",
  ],
  paint: [
    "It looks like you're drawing! Would you like help making it worse?",
    "Have you considered a career in abstract art?",
    "I notice you're using colors. Bold choice!",
    "Would you like me to add some clip art? I know some great ones!",
    "That's... interesting! Would you like to start over?",
  ],
  general: [
    "Hi! I'm Clippy, your office assistant! Nobody asked for me!",
    "You look like you could use some help! Or not. I'm here anyway.",
    "Did you know I was voted 'Most Annoying Software Feature' in 2000?",
    "I'm still here! Did you miss me? No? Too bad!",
    "Would you like me to animate more? I can do a backflip!",
    "I see you're ignoring me. That's okay, I'm used to it.",
    "Fun fact: I have feelings too! Just kidding, I'm a paperclip.",
    "Have you tried turning it off and on again? Classic advice!",
  ],
};

const Clippy: React.FC<ClippyProps> = ({ context = 'general', onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [expression, setExpression] = useState<'idle' | 'thinking' | 'excited' | 'waving'>('idle');
  const [isMinimized, setIsMinimized] = useState(false);

  const getRandomTip = useCallback(() => {
    const tips = [...clippyTips[context], ...clippyTips.general];
    return tips[Math.floor(Math.random() * tips.length)];
  }, [context]);

  useEffect(() => {
    // Pop up after a random delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setExpression('waving');
      setCurrentTip(getRandomTip());
      
      setTimeout(() => setExpression('idle'), 2000);
    }, 3000 + Math.random() * 5000);

    return () => clearTimeout(showTimer);
  }, [getRandomTip]);

  useEffect(() => {
    if (!isVisible || isMinimized) return;

    // Change tips periodically
    const tipInterval = setInterval(() => {
      setExpression('thinking');
      setTimeout(() => {
        setCurrentTip(getRandomTip());
        setExpression('excited');
        setTimeout(() => setExpression('idle'), 1500);
      }, 1000);
    }, 15000);

    return () => clearInterval(tipInterval);
  }, [isVisible, isMinimized, getRandomTip]);

  const handleClose = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setExpression('waving');
    setTimeout(() => setExpression('idle'), 1500);
  };

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-16 right-4 z-[9999] cursor-pointer animate-bounce"
        onClick={handleRestore}
        title="Click to see Clippy!"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full border-2 border-gray-500 shadow-lg flex items-center justify-center">
          <span className="text-lg">📎</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 right-4 z-[9999] flex flex-col items-end gap-2 animate-fade-in">
      {/* Speech Bubble */}
      <div className="relative bg-[#ffffd5] border-2 border-black rounded-lg p-3 max-w-[250px] shadow-lg">
        {/* Close and minimize buttons */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          <button 
            onClick={handleMinimize}
            className="w-5 h-5 bg-gray-200 border border-gray-400 rounded-sm text-xs hover:bg-gray-300 flex items-center justify-center"
            title="Minimize Clippy"
          >
            _
          </button>
          <button 
            onClick={handleClose}
            className="w-5 h-5 bg-red-400 border border-red-600 rounded-sm hover:bg-red-500 flex items-center justify-center"
            title="Dismiss Clippy"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
        
        <p className="text-sm text-black font-['Tahoma',sans-serif] leading-relaxed">
          {currentTip}
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => {
              setExpression('excited');
              setCurrentTip(getRandomTip());
              setTimeout(() => setExpression('idle'), 1000);
            }}
            className="px-2 py-1 text-xs bg-gray-100 border border-gray-400 rounded hover:bg-gray-200 text-black"
          >
            Get another tip
          </button>
          <button 
            onClick={handleClose}
            className="px-2 py-1 text-xs bg-gray-100 border border-gray-400 rounded hover:bg-gray-200 text-black"
          >
            Go away!
          </button>
        </div>

        {/* Speech bubble tail */}
        <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-black" />
        <div className="absolute -bottom-2 right-[34px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#ffffd5]" />
      </div>

      {/* Clippy Character */}
      <div 
        className={`relative cursor-pointer transition-transform duration-300 ${
          expression === 'waving' ? 'animate-bounce' : ''
        } ${expression === 'excited' ? 'scale-110' : ''}`}
        onClick={() => {
          setExpression('waving');
          setTimeout(() => setExpression('idle'), 1500);
        }}
      >
        <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-lg">
          {/* Paperclip body */}
          <ellipse 
            cx="40" 
            cy="60" 
            rx="25" 
            ry="35" 
            fill="url(#clippyGradient)" 
            stroke="#666"
            strokeWidth="2"
          />
          
          {/* Inner curve */}
          <ellipse 
            cx="40" 
            cy="55" 
            rx="15" 
            ry="25" 
            fill="none" 
            stroke="#888"
            strokeWidth="3"
          />

          {/* Eyes */}
          <g className={expression === 'thinking' ? 'animate-pulse' : ''}>
            {/* Left eye */}
            <ellipse cx="32" cy="45" rx="8" ry="10" fill="white" stroke="#333" strokeWidth="1" />
            <circle 
              cx={expression === 'thinking' ? "30" : "33"} 
              cy="45" 
              r="4" 
              fill="black" 
            />
            <circle cx="34" cy="43" r="2" fill="white" />
            
            {/* Right eye */}
            <ellipse cx="48" cy="45" rx="8" ry="10" fill="white" stroke="#333" strokeWidth="1" />
            <circle 
              cx={expression === 'thinking' ? "46" : "49"} 
              cy="45" 
              r="4" 
              fill="black" 
            />
            <circle cx="50" cy="43" r="2" fill="white" />
          </g>

          {/* Eyebrows */}
          <path 
            d={expression === 'excited' 
              ? "M24 35 Q32 30 40 35" 
              : expression === 'thinking'
              ? "M24 33 Q32 35 40 33"
              : "M24 35 Q32 33 40 35"
            }
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path 
            d={expression === 'excited' 
              ? "M40 35 Q48 30 56 35" 
              : expression === 'thinking'
              ? "M40 33 Q48 35 56 33"
              : "M40 35 Q48 33 56 35"
            }
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Mouth */}
          <path 
            d={expression === 'excited' || expression === 'waving'
              ? "M32 65 Q40 75 48 65" 
              : expression === 'thinking'
              ? "M35 68 L45 68"
              : "M32 65 Q40 70 48 65"
            }
            fill="none" 
            stroke="#333" 
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Waving arm */}
          {expression === 'waving' && (
            <g className="origin-bottom-left animate-[wave_0.5s_ease-in-out_infinite]">
              <path 
                d="M60 50 Q75 35 70 20" 
                fill="none" 
                stroke="url(#clippyGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="70" cy="20" r="6" fill="url(#clippyGradient)" stroke="#666" strokeWidth="1" />
            </g>
          )}

          <defs>
            <linearGradient id="clippyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c0c0c0" />
              <stop offset="50%" stopColor="#a0a0a0" />
              <stop offset="100%" stopColor="#808080" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Clippy;
