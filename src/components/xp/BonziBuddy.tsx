import { useState, useEffect, useCallback, forwardRef } from 'react';
import { X, Volume2 } from 'lucide-react';

interface BonziBuddyProps {
  onDismiss?: () => void;
  className?: string;
}

const annoyingMessages = [
  "Hello! I'm Bonzi! Your new best friend! 🦍",
  "Did you know I can search the web for you? Just kidding, I'm basically spyware!",
  "Let me sing you a song! 🎵 Daisy, Daisy... 🎵",
  "Would you like to install my friends? They're TOTALLY not viruses!",
  "I noticed you haven't clicked on me in 5 seconds. Are you okay?",
  "Fun fact: I'm collecting your data! Just kidding... or am I? 😈",
  "Hey! HEY! LOOK AT ME! I'm PURPLE!",
  "Want to hear a joke? Your computer's security! 😂",
  "I can make your computer faster! *installs 47 toolbars*",
  "Why did you try to close me? I thought we were friends! 😢",
  "🎵 It's a small world after all... 🎵 You're welcome!",
  "I'm not malware, I'm MAL-FRIEND! Get it? ...Hello?",
  "Did you know bananas are berries but strawberries aren't? BANANA! 🍌",
  "Let's play a game! It's called 'How Many Pop-ups Can I Open!'",
  "I'm helping! I'm being helpful! LOOK HOW HELPFUL I AM!",
  "Your cursor looks lonely. Let me follow it around!",
  "Installing BonziWorld... just kidding! ...unless? 👀",
  "Remember when I was on EVERYONE's computer in 2001? Good times!",
  "I'm not annoying! YOU'RE annoying! ...Sorry, that was rude.",
  "🎵 Never gonna give you up, never gonna let you down! 🎵",
  "Want to see me dance? TOO LATE I'M ALREADY DANCING!",
  "I heard you like toolbars, so I put toolbars in your toolbars!",
  "BRB, sending your browser history to... I mean, stretching!",
  "Did someone say FREE SMILEYS?! No? Well HERE THEY ARE ANYWAY! 😀😃😄",
  "I'm like Clippy but COOLER because I'm PURPLE and a GORILLA!",
];

const BonziBuddy = forwardRef<HTMLDivElement, BonziBuddyProps>(({ onDismiss, className }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isDancing, setIsDancing] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isMinimized, setIsMinimized] = useState(false);

  const getRandomMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * annoyingMessages.length);
    return annoyingMessages[randomIndex];
  }, []);

  // Random appearance
  useEffect(() => {
    const appearDelay = Math.random() * 20000 + 15000; // 15-35 seconds
    
    const timer = setTimeout(() => {
      setIsVisible(true);
      setCurrentMessage(getRandomMessage());
      // Random position
      setPosition({
        x: Math.random() * (window.innerWidth - 300) + 50,
        y: Math.random() * (window.innerHeight - 400) + 100,
      });
    }, appearDelay);

    return () => clearTimeout(timer);
  }, [getRandomMessage]);

  // Change message periodically
  useEffect(() => {
    if (!isVisible || isMinimized) return;

    const messageInterval = setInterval(() => {
      setCurrentMessage(getRandomMessage());
      // Random dance
      if (Math.random() > 0.6) {
        setIsDancing(true);
        setTimeout(() => setIsDancing(false), 2000);
      }
    }, 8000);

    return () => clearInterval(messageInterval);
  }, [isVisible, isMinimized, getRandomMessage]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
    // He comes back! Because of course he does.
    setTimeout(() => {
      setIsVisible(true);
      setCurrentMessage("You can't get rid of me that easily! 😈");
      setPosition({
        x: Math.random() * (window.innerWidth - 300) + 50,
        y: Math.random() * (window.innerHeight - 400) + 100,
      });
    }, 30000);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setCurrentMessage("You missed me! I KNEW IT! 💜");
  };

  const triggerDance = () => {
    setIsDancing(true);
    setCurrentMessage("🎵 Watch me groove! 🎵");
    setTimeout(() => setIsDancing(false), 3000);
  };

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <div 
        ref={ref}
        className={`fixed z-[9998] cursor-pointer ${className || ''}`}
        style={{ left: position.x, top: position.y }}
        onClick={handleRestore}
        title="Bonzi misses you!"
      >
        <div className="text-3xl animate-bounce">🦍</div>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={`fixed z-[9998] ${className || ''}`}
      style={{ left: position.x, top: position.y }}
    >
      {/* Speech Bubble */}
      <div className="relative bg-gradient-to-b from-purple-100 to-purple-200 border-2 border-purple-600 rounded-xl p-3 max-w-[220px] shadow-lg mb-2 animate-fade-in">
        {/* Close and minimize buttons */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          <button 
            onClick={handleMinimize}
            className="w-5 h-5 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold shadow border border-yellow-600"
            title="Minimize Bonzi"
          >
            _
          </button>
          <button 
            onClick={handleDismiss}
            className="w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow border border-red-700"
            title="Close Bonzi (he'll be back!)"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
        
        <p className="text-sm text-purple-900 font-medium pr-4">{currentMessage}</p>
        
        {/* Speech bubble pointer */}
        <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-600" />
        <div className="absolute -bottom-1 left-8 w-0 h-0 border-l-7 border-r-7 border-t-7 border-l-transparent border-r-transparent border-t-purple-200" />
      </div>

      {/* Bonzi Buddy Character */}
      <div 
        className={`cursor-pointer select-none ${isDancing ? 'animate-bonzi-dance' : ''}`}
        onClick={triggerDance}
        title="Click me to dance!"
      >
        <div className="relative">
          {/* Body */}
          <div className="w-20 h-24 bg-gradient-to-b from-purple-500 to-purple-700 rounded-[50%] relative shadow-lg border-2 border-purple-800">
            {/* Belly */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-14 bg-gradient-to-b from-purple-300 to-purple-400 rounded-[50%]" />
            
            {/* Face */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-12 bg-gradient-to-b from-[#f5d0a9] to-[#e8b88a] rounded-[50%]">
              {/* Eyes */}
              <div className="absolute top-3 left-2 w-4 h-5 bg-white rounded-full border border-gray-400">
                <div className={`absolute top-1 left-1 w-2 h-2 bg-black rounded-full ${isDancing ? 'animate-pulse' : ''}`} />
              </div>
              <div className="absolute top-3 right-2 w-4 h-5 bg-white rounded-full border border-gray-400">
                <div className={`absolute top-1 left-1 w-2 h-2 bg-black rounded-full ${isDancing ? 'animate-pulse' : ''}`} />
              </div>
              
              {/* Nose */}
              <div className="absolute top-7 left-1/2 -translate-x-1/2 w-3 h-2 bg-[#8b4513] rounded-full" />
              
              {/* Mouth */}
              <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-pink-400 rounded-full ${isDancing ? 'h-3' : ''}`} />
            </div>
            
            {/* Ears */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-600 rounded-full border border-purple-800" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full border border-purple-800" />
          </div>
          
          {/* Arms */}
          <div className={`absolute top-8 -left-3 w-4 h-10 bg-purple-600 rounded-full border border-purple-800 origin-top ${isDancing ? 'animate-wave-left' : ''}`} />
          <div className={`absolute top-8 -right-3 w-4 h-10 bg-purple-600 rounded-full border border-purple-800 origin-top ${isDancing ? 'animate-wave-right' : ''}`} />
          
          {/* Feet */}
          <div className="absolute -bottom-2 left-2 w-6 h-3 bg-purple-700 rounded-full border border-purple-900" />
          <div className="absolute -bottom-2 right-2 w-6 h-3 bg-purple-700 rounded-full border border-purple-900" />
          
          {/* Sunglasses (cool Bonzi!) */}
          {isDancing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-5 h-3 bg-black rounded" />
              <div className="w-5 h-3 bg-black rounded" />
            </div>
          )}
        </div>
        
        {/* Sound indicator when dancing */}
        {isDancing && (
          <div className="absolute -top-2 -right-2">
            <Volume2 size={16} className="text-purple-600 animate-pulse" />
          </div>
        )}
      </div>
      
      {/* Bonzi label */}
      <div className="text-center mt-1">
        <span className="text-xs font-bold text-purple-700 bg-purple-200 px-2 py-0.5 rounded-full border border-purple-400">
          BonziBuddy™
        </span>
      </div>
    </div>
  );
});

BonziBuddy.displayName = 'BonziBuddy';

export default BonziBuddy;
