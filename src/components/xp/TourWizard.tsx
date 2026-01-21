import { useState, useEffect } from 'react';
import { useSounds } from '@/contexts/SoundContext';
import { ChevronRight, ChevronLeft, X, Monitor, FolderOpen, Mail, Globe, Gamepad2, Music, HelpCircle } from 'lucide-react';

interface TourWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Windows XP!',
    content: "Hi there! I'm your Windows XP assistant. Let me show you around your new desktop experience. This tour will help you get familiar with all the exciting features!",
    icon: Monitor,
    tip: "💡 Tip: You can click anywhere on the desktop to close the Start menu!",
  },
  {
    id: 'desktop',
    title: 'Your Desktop',
    content: "This is your desktop - your personal workspace! You'll find shortcuts to your favorite programs here. Double-click any icon to open it.",
    icon: FolderOpen,
    tip: "💡 Tip: Right-click the desktop for more options like changing your wallpaper!",
  },
  {
    id: 'startmenu',
    title: 'The Start Menu',
    content: "Click the Start button in the bottom-left corner to access all your programs, documents, and settings. It's the gateway to everything on your computer!",
    icon: Monitor,
    tip: "💡 Tip: You can also press the Windows key on your keyboard!",
  },
  {
    id: 'internet',
    title: 'Explore the Internet',
    content: "Use Internet Explorer or AOL to surf the World Wide Web! Discover websites, send emails, and chat with friends using AIM or MSN Messenger.",
    icon: Globe,
    tip: "💡 Tip: Remember to wait for the dial-up connection sound!",
  },
  {
    id: 'email',
    title: 'Stay Connected',
    content: "Check your email, chat with buddies on AIM, and stay connected with friends and family. You've Got Mail!",
    icon: Mail,
    tip: "💡 Tip: Set a cool away message when you're not at your computer!",
  },
  {
    id: 'music',
    title: 'Music & Entertainment',
    content: "Download music with Napster, LimeWire, or Kazaa! Play your MP3s in Winamp - it really whips the llama's ass! 🦙",
    icon: Music,
    tip: "💡 Tip: Check out the cool Winamp visualizations!",
  },
  {
    id: 'games',
    title: 'Games & Fun',
    content: "Take a break with Minesweeper, 3D Pinball Space Cadet, or draw something in MS Paint. Hours of entertainment await!",
    icon: Gamepad2,
    tip: "💡 Tip: The pinball game has hidden cheats - try typing 'hidden test'!",
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    content: "That's the tour! You're now ready to explore Windows XP. Don't worry if you get lost - Clippy will always be here to help (whether you want him to or not 📎).",
    icon: HelpCircle,
    tip: "💡 Tip: Have fun exploring and don't forget to defrag your hard drive!",
  },
];

const TourWizard: React.FC<TourWizardProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { playClick, playChord, playNotify } = useSounds();
  
  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;
  
  useEffect(() => {
    // Play welcome sound on mount
    playNotify();
  }, []);

  const handleNext = () => {
    if (isLastStep) {
      playChord();
      onComplete();
      return;
    }
    
    playClick();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 200);
  };

  const handleBack = () => {
    if (isFirstStep) return;
    
    playClick();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 200);
  };

  const handleSkip = () => {
    playClick();
    onSkip();
  };

  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50">
      {/* Wizard Window */}
      <div 
        className="w-[550px] bg-gradient-to-b from-[#ece9d8] to-[#d4d0c8] rounded-lg shadow-2xl overflow-hidden border-2 border-[#0054e3]"
        style={{ fontFamily: 'Tahoma, sans-serif' }}
      >
        {/* Title Bar */}
        <div 
          className="h-8 flex items-center justify-between px-2"
          style={{
            background: 'linear-gradient(180deg, #0a246a 0%, #0054e3 8%, #0054e3 92%, #0a246a 100%)'
          }}
        >
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold">Welcome to Windows XP</span>
          </div>
          <button 
            onClick={handleSkip}
            className="w-6 h-5 flex items-center justify-center bg-gradient-to-b from-[#c42b1c] to-[#8b1a10] rounded-sm border border-white/20 hover:from-[#e33c2d] hover:to-[#a32a1f]"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex">
          {/* Left Panel - Decorative */}
          <div 
            className="w-[180px] min-h-[350px] flex flex-col items-center justify-center p-4"
            style={{
              background: 'linear-gradient(180deg, #0054e3 0%, #2878d8 50%, #0054e3 100%)'
            }}
          >
            {/* Windows XP Logo */}
            <div className="text-center mb-4">
              <div className="text-white font-bold text-xl mb-1">Windows</div>
              <div 
                className="text-3xl font-bold italic"
                style={{
                  background: 'linear-gradient(180deg, #ff8c00 0%, #ffd700 50%, #ff8c00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                XP
              </div>
            </div>

            {/* Assistant Character */}
            <div className={`mt-4 transition-transform duration-300 ${isAnimating ? 'scale-95 opacity-70' : 'scale-100'}`}>
              <div className="relative">
                {/* Merlin-style wizard character */}
                <svg width="100" height="120" viewBox="0 0 100 120">
                  {/* Hat */}
                  <path 
                    d="M25 45 L50 5 L75 45 Z" 
                    fill="url(#hatGradient)"
                    stroke="#333"
                    strokeWidth="2"
                  />
                  <ellipse cx="50" cy="45" rx="30" ry="8" fill="url(#hatBrimGradient)" stroke="#333" strokeWidth="1" />
                  
                  {/* Stars on hat */}
                  <text x="40" y="35" fill="gold" fontSize="12">★</text>
                  <text x="55" y="28" fill="gold" fontSize="8">✦</text>
                  
                  {/* Face */}
                  <ellipse cx="50" cy="65" rx="25" ry="22" fill="#ffe4c4" stroke="#333" strokeWidth="1" />
                  
                  {/* Eyes */}
                  <ellipse cx="42" cy="62" rx="5" ry="6" fill="white" stroke="#333" strokeWidth="0.5" />
                  <ellipse cx="58" cy="62" rx="5" ry="6" fill="white" stroke="#333" strokeWidth="0.5" />
                  <circle cx="42" cy="63" r="3" fill="#4a4a8a" />
                  <circle cx="58" cy="63" r="3" fill="#4a4a8a" />
                  <circle cx="43" cy="61" r="1" fill="white" />
                  <circle cx="59" cy="61" r="1" fill="white" />
                  
                  {/* Eyebrows */}
                  <path d="M35 56 Q42 53 48 56" fill="none" stroke="#666" strokeWidth="1.5" />
                  <path d="M52 56 Q58 53 65 56" fill="none" stroke="#666" strokeWidth="1.5" />
                  
                  {/* Nose */}
                  <path d="M50 65 Q52 70 50 73" fill="none" stroke="#d4a574" strokeWidth="2" />
                  
                  {/* Smile */}
                  <path d="M40 78 Q50 85 60 78" fill="none" stroke="#333" strokeWidth="1.5" />
                  
                  {/* Beard */}
                  <path d="M30 80 Q35 95 50 100 Q65 95 70 80" fill="#ddd" stroke="#999" strokeWidth="1" />
                  
                  {/* Robe */}
                  <path d="M25 87 L20 120 L80 120 L75 87" fill="url(#robeGradient)" stroke="#333" strokeWidth="1" />
                  
                  <defs>
                    <linearGradient id="hatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4a4a8a" />
                      <stop offset="100%" stopColor="#2a2a5a" />
                    </linearGradient>
                    <linearGradient id="hatBrimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4a4a8a" />
                      <stop offset="100%" stopColor="#2a2a5a" />
                    </linearGradient>
                    <linearGradient id="robeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4a4a8a" />
                      <stop offset="100%" stopColor="#2a2a5a" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1 mt-4">
              {tourSteps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep 
                      ? 'bg-white scale-125' 
                      : idx < currentStep 
                        ? 'bg-white/70' 
                        : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Step Content */}
            <div className={`flex-1 transition-all duration-200 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              {/* Icon and Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0054e3] to-[#003cb3] rounded-lg flex items-center justify-center shadow-md">
                  <StepIcon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#003399]">{step.title}</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {step.content}
              </p>

              {/* Tip Box */}
              <div className="bg-[#ffffcc] border border-[#d4d400] rounded p-3 mt-auto">
                <p className="text-xs text-gray-700">{step.tip}</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-300">
              <button
                onClick={handleSkip}
                className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:underline"
              >
                Skip Tour
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleBack}
                  disabled={isFirstStep}
                  className={`px-4 py-1.5 text-sm flex items-center gap-1 rounded border ${
                    isFirstStep 
                      ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-b from-white to-[#e0e0e0] border-gray-400 hover:from-[#e8e8e8] hover:to-[#d0d0d0] text-black'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 text-sm flex items-center gap-1 rounded border border-[#003399] bg-gradient-to-b from-[#4a90d9] to-[#2060b0] text-white hover:from-[#5aa0e9] hover:to-[#3070c0] font-medium"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourWizard;