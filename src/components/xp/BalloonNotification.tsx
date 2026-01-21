import { useState, useEffect } from 'react';
import { X, Shield, AlertTriangle, Download, Info, Wifi, Bug } from 'lucide-react';
import { useSounds } from '@/contexts/SoundContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: 'shield' | 'warning' | 'download' | 'info' | 'wifi' | 'bug';
  type: 'info' | 'warning' | 'error';
}

interface BalloonNotificationProps {
  onDismiss?: () => void;
}

const notificationPool: Notification[] = [
  {
    id: '1',
    title: 'Windows Security Alert',
    message: 'Your PC might be at risk. Antivirus software might not be installed. Click this balloon to fix this problem.',
    icon: 'shield',
    type: 'warning',
  },
  {
    id: '2',
    title: 'Windows Update',
    message: 'Updates are ready for your computer. Click here to install the latest updates.',
    icon: 'download',
    type: 'info',
  },
  {
    id: '3',
    title: 'New Hardware Found',
    message: 'Windows found new hardware and is looking for the software to run it.',
    icon: 'info',
    type: 'info',
  },
  {
    id: '4',
    title: 'Your computer might be infected!',
    message: 'Windows detected spyware threat. Click here to remove malicious software.',
    icon: 'bug',
    type: 'error',
  },
  {
    id: '5',
    title: 'Low Disk Space',
    message: 'You are running out of disk space on Local Disk (C:). Click here to free up space.',
    icon: 'warning',
    type: 'warning',
  },
  {
    id: '6',
    title: 'Windows Firewall',
    message: 'Windows Firewall has blocked some features of this program. Click for more options.',
    icon: 'shield',
    type: 'warning',
  },
  {
    id: '7',
    title: 'Network Connected',
    message: 'You are now connected to the Internet through a broadband connection.',
    icon: 'wifi',
    type: 'info',
  },
  {
    id: '8',
    title: 'Unused Icons',
    message: 'There are unused icons on your desktop. Click here to clean up your desktop.',
    icon: 'info',
    type: 'info',
  },
  {
    id: '9',
    title: 'Windows Security Center',
    message: 'Automatic Updates is turned off. Your computer is at risk. Click to turn on Automatic Updates.',
    icon: 'shield',
    type: 'error',
  },
  {
    id: '10',
    title: 'Potential Security Risk',
    message: 'A program is trying to access the internet. Do you want to allow this?',
    icon: 'warning',
    type: 'warning',
  },
];

const BalloonNotification: React.FC<BalloonNotificationProps> = ({ onDismiss }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { playNotify, playError } = useSounds();

  useEffect(() => {
    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      showRandomNotification();
    }, 5000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!notification) return;

    // Auto-dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      dismiss();
    }, 8000);

    // Show next notification after current one dismisses
    const nextTimer = setTimeout(() => {
      showRandomNotification();
    }, 15000 + Math.random() * 20000);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(nextTimer);
    };
  }, [notification]);

  const showRandomNotification = () => {
    const randomNotif = notificationPool[Math.floor(Math.random() * notificationPool.length)];
    setNotification(randomNotif);
    setIsVisible(true);
    setIsExiting(false);
    
    // Play appropriate sound based on notification type
    if (randomNotif.type === 'error') {
      playError();
    } else {
      playNotify();
    }
  };

  const dismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setNotification(null);
    }, 300);
  };

  const getIcon = () => {
    if (!notification) return null;
    const iconClass = "w-8 h-8";
    
    switch (notification.icon) {
      case 'shield':
        return <Shield className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
      case 'download':
        return <Download className={`${iconClass} text-blue-600`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />;
      case 'wifi':
        return <Wifi className={`${iconClass} text-blue-600`} />;
      case 'bug':
        return <Bug className={`${iconClass} text-red-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getBorderColor = () => {
    if (!notification) return 'border-blue-400';
    switch (notification.type) {
      case 'error': return 'border-red-400';
      case 'warning': return 'border-yellow-400';
      default: return 'border-blue-400';
    }
  };

  if (!isVisible || !notification) return null;

  return (
    <div 
      className={`fixed bottom-10 right-2 z-[9998] transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      style={{ animation: !isExiting ? 'slideUp 0.3s ease-out' : undefined }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* Balloon with pointer */}
      <div className={`relative bg-[#ffffe1] border-2 ${getBorderColor()} rounded-lg shadow-lg max-w-xs`}>
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-0.5"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Content */}
        <div className="p-3 pr-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-gray-900 mb-1">
                {notification.title}
              </div>
              <div className="text-xs text-gray-700 leading-relaxed">
                {notification.message}
              </div>
              <div className="text-xs text-blue-600 underline mt-2 cursor-pointer hover:text-blue-800">
                Click here for more information.
              </div>
            </div>
          </div>
        </div>

        {/* Pointer/Arrow pointing down to tray */}
        <div 
          className={`absolute -bottom-2 right-8 w-4 h-4 bg-[#ffffe1] border-r-2 border-b-2 ${getBorderColor()} transform rotate-45`}
        />
      </div>
    </div>
  );
};

export default BalloonNotification;
