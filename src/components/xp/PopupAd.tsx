import React, { useState, useEffect } from 'react';
import { X, Gift, AlertTriangle, Heart, DollarSign, Zap, Star } from 'lucide-react';

interface PopupAdProps {
  onClose: () => void;
  variant?: 'ipod' | 'virus' | 'casino' | 'dating' | 'congratulations' | 'random';
}

const adVariants = [
  {
    id: 'ipod',
    title: '🎉 CONGRATULATIONS! 🎉',
    subtitle: "You're the 1,000,000th visitor!",
    content: 'Click HERE to claim your FREE iPod Nano!',
    buttonText: 'CLAIM NOW!!!',
    bgGradient: 'from-yellow-400 via-orange-500 to-red-500',
    icon: Gift,
    blinking: true,
  },
  {
    id: 'virus',
    title: '⚠️ WARNING ⚠️',
    subtitle: 'Your computer may be INFECTED!',
    content: 'We detected 47 viruses on your PC! Download AntiVirus Pro 2004 NOW!',
    buttonText: 'SCAN NOW',
    bgGradient: 'from-red-600 via-red-700 to-black',
    icon: AlertTriangle,
    blinking: true,
  },
  {
    id: 'casino',
    title: '🎰 JACKPOT! 🎰',
    subtitle: 'You have been selected!',
    content: 'Play FREE slots and win up to $10,000! No credit card needed!',
    buttonText: 'PLAY FREE',
    bgGradient: 'from-purple-600 via-pink-500 to-yellow-400',
    icon: DollarSign,
    blinking: true,
  },
  {
    id: 'dating',
    title: '💕 HOT SINGLES 💕',
    subtitle: 'In YOUR area want to meet YOU!',
    content: 'Sarah, 23, is only 2 miles away! Click to chat now!',
    buttonText: 'MEET NOW',
    bgGradient: 'from-pink-500 via-rose-500 to-red-500',
    icon: Heart,
    blinking: false,
  },
  {
    id: 'speed',
    title: '🚀 SPEED UP YOUR PC 🚀',
    subtitle: 'Your PC is running 94% SLOWER!',
    content: 'Download PC Turbo Booster 2004 to fix 1,337 errors!',
    buttonText: 'FIX NOW',
    bgGradient: 'from-blue-600 via-cyan-500 to-green-500',
    icon: Zap,
    blinking: true,
  },
  {
    id: 'winner',
    title: '⭐ YOU WON! ⭐',
    subtitle: 'Microsoft Lottery Winner!',
    content: 'Bill Gates selected YOU to receive $5,000,000! Enter your email!',
    buttonText: 'GET MONEY',
    bgGradient: 'from-green-500 via-emerald-500 to-teal-500',
    icon: Star,
    blinking: true,
  },
];

const PopupAd: React.FC<PopupAdProps> = ({ onClose, variant = 'random' }) => {
  const [position] = useState(() => ({
    x: Math.random() * (window.innerWidth - 350),
    y: Math.random() * (window.innerHeight - 300),
  }));
  const [blinkState, setBlinkState] = useState(true);

  const ad = variant === 'random' 
    ? adVariants[Math.floor(Math.random() * adVariants.length)]
    : adVariants.find(a => a.id === variant) || adVariants[0];

  const IconComponent = ad.icon;

  // Blinking effect
  useEffect(() => {
    if (!ad.blinking) return;
    const interval = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, [ad.blinking]);

  const handleAdClick = () => {
    // Spawn more popups! Classic behavior
    if (Math.random() > 0.5) {
      // This would trigger more popups in the parent
    }
  };

  return (
    <div
      className="fixed z-[1000] animate-scale-in"
      style={{
        left: Math.max(10, Math.min(position.x, window.innerWidth - 360)),
        top: Math.max(10, Math.min(position.y, window.innerHeight - 310)),
      }}
    >
      {/* Window frame */}
      <div className="w-[350px] bg-[#ece9d8] border border-gray-400 shadow-xl">
        {/* Title bar - fake browser */}
        <div className="bg-gradient-to-r from-[#0a246a] via-[#0a246a] to-[#a6caf0] px-1 py-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%230078d7'/%3E%3C/svg%3E"
              alt=""
              className="w-4 h-4"
            />
            <span className="text-white text-xs font-bold truncate">
              Special Offer - Internet Explorer
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-[#c75050] hover:bg-[#e04343] flex items-center justify-center text-white text-xs font-bold rounded-sm"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Fake address bar */}
        <div className="bg-[#f1efe2] border-b border-gray-300 px-2 py-1 flex items-center gap-1">
          <span className="text-[10px] text-gray-500">Address:</span>
          <div className="flex-1 bg-white border border-gray-400 px-1 text-[10px] truncate">
            http://www.fr33-pr1zes-4u.biz/winner.html
          </div>
        </div>

        {/* Ad content */}
        <div 
          className={`p-4 bg-gradient-to-br ${ad.bgGradient} text-white text-center cursor-pointer`}
          onClick={handleAdClick}
        >
          <div className={`text-2xl font-bold mb-2 ${ad.blinking && blinkState ? 'text-yellow-300' : 'text-white'}`}>
            {ad.title}
          </div>
          
          <IconComponent className={`w-16 h-16 mx-auto mb-2 ${ad.blinking ? 'animate-bounce' : ''}`} />
          
          <div className="text-lg font-semibold mb-2">
            {ad.subtitle}
          </div>
          
          <div className="text-sm mb-4 bg-black/30 p-2 rounded">
            {ad.content}
          </div>

          <button
            className={`
              px-6 py-2 font-bold text-lg rounded
              ${blinkState 
                ? 'bg-yellow-400 text-black border-2 border-yellow-600' 
                : 'bg-green-500 text-white border-2 border-green-700'
              }
              hover:scale-105 transition-transform
              animate-pulse
            `}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            {ad.buttonText}
          </button>

          {/* Fine print */}
          <div className="mt-3 text-[8px] opacity-60">
            *No purchase necessary. Must be 18+. Void where prohibited.
            By clicking you agree to install BonziBuddy toolbar.
          </div>
        </div>

        {/* Fake status bar */}
        <div className="bg-[#ece9d8] border-t border-gray-300 px-2 py-0.5 text-[10px] text-gray-600">
          ✓ Secure Connection | 🔒 Norton Verified
        </div>
      </div>
    </div>
  );
};

export default PopupAd;
