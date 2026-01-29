import React, { useState, useEffect } from 'react';
import { Volume2, Volume1, VolumeX, Wifi, Minus, Square, X, ChevronLeft, ChevronRight, Shield, ShieldCheck, ShieldAlert, Battery, BellRing } from 'lucide-react';
import { useWindows } from '@/pages/Index';
import { useSounds } from '@/contexts/SoundContext';
import { useBloatMode } from '@/contexts/BloatModeContext';

// Import quick launch icons
import ieIcon from '@/assets/icons/ie-icon.png';
import winampIcon from '@/assets/icons/winamp-icon.png';
import notepadIcon from '@/assets/icons/notepad-icon.png';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface TaskbarProps {
  startMenuOpen: boolean;
  onStartClick: (e: React.MouseEvent) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

const Taskbar: React.FC<TaskbarProps> = ({ startMenuOpen, onStartClick }) => {
  const [time, setTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const { windows, focusWindow, minimizeWindow, toggleMaximize, closeWindow, activeWindowId, openWindow } = useWindows();
  const { volume, isMuted, setVolume, setMuted } = useSounds();
  const { bloatEnabled, setBloatEnabled, hasActiveAds } = useBloatMode();

  // Quick launch items
  const quickLaunchItems = [
    { id: 'ie', title: 'Internet Explorer', icon: ieIcon, component: 'ie', width: 700, height: 500 },
    { id: 'winamp', title: 'Winamp', icon: winampIcon, component: 'winamp', width: 300, height: 400 },
    { id: 'notepad', title: 'Notepad', icon: notepadIcon, component: 'notepad', width: 500, height: 400 },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatFullTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const handleWindowClick = (windowId: string, isMinimized: boolean) => {
    if (isMinimized) {
      focusWindow(windowId);
    } else if (activeWindowId === windowId) {
      minimizeWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    
    const days: React.ReactNode[] = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-6 h-5"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                      today.getMonth() === month && 
                      today.getFullYear() === year;
      days.push(
        <div 
          key={day} 
          className={`w-6 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white rounded-sm
            ${isToday ? 'bg-[#316ac5] text-white font-bold' : ''}`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="xp-taskbar">
      {/* Start Button */}
      <button 
        className={`xp-start-button ${startMenuOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
          <div className="w-1.5 h-1.5 bg-[#f65314] rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-[#7cbb00] rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-[#00a1f1] rounded-sm"></div>
          <div className="w-1.5 h-1.5 bg-[#ffbb00] rounded-sm"></div>
        </div>
        <span>start</span>
      </button>

      {/* Quick Launch Separator */}
      <div className="w-px h-5 bg-blue-400/50 mx-1"></div>

      {/* Quick Launch Icons */}
      <div className="flex items-center gap-0.5 px-1">
        {quickLaunchItems.map((item) => (
          <button
            key={item.id}
            onClick={() => openWindow(item.id, item.title, item.component, item.icon, item.width, item.height)}
            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
            title={item.title}
          >
            <img src={item.icon} alt={item.title} className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Separator after Quick Launch */}
      <div className="w-px h-5 bg-blue-400/50 mx-1"></div>

      {/* Open Windows */}
      <div className="flex-1 flex items-center gap-1 overflow-hidden px-1">
        {windows.map((window) => {
          const isActive = activeWindowId === window.id && !window.isMinimized;
          return (
            <ContextMenu key={window.id}>
              <ContextMenuTrigger
                onClick={() => handleWindowClick(window.id, window.isMinimized)}
                className={`h-7 px-2 text-xs text-white truncate max-w-44 rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer
                  ${isActive 
                    ? 'border-blue-300/50 shadow-inner' 
                    : 'border-transparent hover:border-blue-400/30'
                  }`}
                style={{
                  background: isActive
                    ? 'linear-gradient(180deg, #1e4a8a 0%, #0d3a6e 50%, #0a2d52 100%)'
                    : window.isMinimized 
                      ? 'linear-gradient(180deg, #4a7fc5 0%, #3b6eb5 100%)'
                      : 'linear-gradient(180deg, #3b7dd8 0%, #2a6bc8 50%, #1e5ab8 100%)'
                }}
              >
                {window.iconSrc && (
                  <img src={window.iconSrc} alt="" className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="truncate">{window.title}</span>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-40 bg-[#ece9d8] border-[#0054e3] shadow-md">
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
                  onClick={() => focusWindow(window.id)}
                >
                  <Square className="w-3 h-3" />
                  Restore
                </ContextMenuItem>
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
                  onClick={() => minimizeWindow(window.id)}
                >
                  <Minus className="w-3 h-3" />
                  Minimize
                </ContextMenuItem>
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
                  onClick={() => toggleMaximize(window.id)}
                >
                  <Square className="w-3 h-3" />
                  {window.isMaximized ? 'Restore' : 'Maximize'}
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-gray-400" />
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white font-bold"
                  onClick={() => closeWindow(window.id)}
                >
                  <X className="w-3 h-3" />
                  Close
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>

      {/* System Tray */}
      <div 
        className="flex items-center gap-1.5 px-2 h-full"
        style={{
          background: 'linear-gradient(180deg, #0f4c9c 0%, #1565c0 50%, #0d47a1 100%)'
        }}
      >
        {/* Hidden Icons Chevron */}
        <button className="hover:bg-white/10 p-0.5 rounded">
          <ChevronLeft className="w-3 h-3 text-white/60" />
        </button>

        {/* Bloat Protection Toggle */}
        <Popover>
          <PopoverTrigger 
            className={`hover:bg-white/10 p-0.5 rounded cursor-pointer relative ${
              hasActiveAds && bloatEnabled ? 'animate-pulse' : ''
            }`}
            title={bloatEnabled ? "Bloat Protection: OFF (Authentic 2003 Mode)" : "Bloat Protection: ON"}
          >
            {bloatEnabled ? (
              <ShieldAlert className={`w-4 h-4 ${hasActiveAds ? 'text-orange-400' : 'text-yellow-400'}`} />
            ) : (
              <ShieldCheck className="w-4 h-4 text-green-400" />
            )}
          </PopoverTrigger>
          <PopoverContent 
            className="w-64 p-0 bg-[#ece9d8] border-2 border-[#0054e3] shadow-lg"
            align="center"
            sideOffset={8}
          >
            {/* Header */}
            <div className="bg-gradient-to-b from-[#0054e3] to-[#003399] text-white p-2 flex items-center gap-2">
              {bloatEnabled ? (
                <ShieldAlert className="w-5 h-5 text-yellow-300" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-green-300" />
              )}
              <span className="font-bold text-sm">Bloat Protection</span>
            </div>
            
            {/* Toggle Content */}
            <div className="p-3 space-y-3">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#003399]">
                  {bloatEnabled ? 'Authentic 2003 Mode' : 'Protected Mode'}
                </span>
                <Switch
                  checked={!bloatEnabled}
                  onCheckedChange={(checked) => setBloatEnabled(!checked)}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-yellow-500"
                />
              </div>
              
              {/* Description */}
              <div className="bg-white border border-gray-300 rounded p-2 text-xs space-y-2">
                <div className={`flex items-center gap-2 ${bloatEnabled ? 'text-gray-800' : 'text-gray-400'}`}>
                  <span>{bloatEnabled ? '✓' : '✗'}</span>
                  <span>Popup ads</span>
                </div>
                <div className={`flex items-center gap-2 ${bloatEnabled ? 'text-gray-800' : 'text-gray-400'}`}>
                  <span>{bloatEnabled ? '✓' : '✗'}</span>
                  <span>BonziBuddy 🦍</span>
                </div>
                <div className={`flex items-center gap-2 ${bloatEnabled ? 'text-gray-800' : 'text-gray-400'}`}>
                  <span>{bloatEnabled ? '✓' : '✗'}</span>
                  <span>Balloon notifications</span>
                </div>
              </div>
              
              {/* Fun Message */}
              <div className="text-xs text-center italic text-gray-600">
                {bloatEnabled ? (
                  <span>"For the full nostalgic experience!" 🦍</span>
                ) : (
                  <span>"Enjoy your modern, ad-free browsing!" 🛡️</span>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Updates Available */}
        <div className="hover:bg-white/10 p-0.5 rounded cursor-pointer animate-pulse" title="Updates Available">
          <BellRing className="w-4 h-4 text-yellow-400" />
        </div>

        {/* Battery */}
        <div className="hover:bg-white/10 p-0.5 rounded cursor-pointer" title="On AC Power">
          <Battery className="w-4 h-4 text-white/80" />
        </div>

        {/* Volume Control Popup */}
        <Popover>
          <PopoverTrigger className="hover:bg-white/10 p-0.5 rounded cursor-pointer">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-white/80" />
            ) : volume < 50 ? (
              <Volume1 className="w-4 h-4 text-white/80" />
            ) : (
              <Volume2 className="w-4 h-4 text-white/80" />
            )}
          </PopoverTrigger>
          <PopoverContent 
            className="w-24 p-3 bg-[#ece9d8] border-2 border-[#0054e3] shadow-lg"
            align="center"
            sideOffset={8}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-xs font-bold text-[#003399]">Volume</div>
              
              {/* Vertical Slider Container */}
              <div className="h-24 flex items-center justify-center">
                <Slider
                  orientation="vertical"
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    if (value[0] > 0) setMuted(false);
                  }}
                  max={100}
                  step={1}
                  className="h-full"
                />
              </div>
              
              {/* Volume Percentage */}
              <div className="text-xs font-mono">{isMuted ? 0 : volume}%</div>
              
              {/* Mute Checkbox */}
              <label className="flex items-center gap-1 text-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isMuted}
                  onChange={(e) => setMuted(e.target.checked)}
                  className="w-3 h-3"
                />
                Mute
              </label>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Network Status Popup */}
        <Popover>
          <PopoverTrigger className="hover:bg-white/10 p-0.5 rounded cursor-pointer">
            <Wifi className="w-4 h-4 text-white/80" />
          </PopoverTrigger>
          <PopoverContent 
            className="w-64 p-0 bg-[#ece9d8] border-2 border-[#0054e3] shadow-lg"
            align="center"
            sideOffset={8}
          >
            {/* Header */}
            <div className="bg-gradient-to-b from-[#0054e3] to-[#003399] text-white p-2 flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              <span className="font-bold text-sm">Network Connections</span>
            </div>
            
            {/* Connection Status */}
            <div className="p-3 space-y-3">
              {/* Current Connection */}
              <div className="bg-white border border-gray-300 rounded p-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#316ac5] rounded flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Local Area Connection</div>
                    <div className="text-xs text-green-600">Connected</div>
                  </div>
                </div>
                
                <div className="text-xs space-y-1 border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-medium">100.0 Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Signal Strength:</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                </div>
              </div>
              
              {/* Network Details */}
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">IP Address:</span>
                  <span className="font-mono">192.168.1.42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subnet Mask:</span>
                  <span className="font-mono">255.255.255.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gateway:</span>
                  <span className="font-mono">192.168.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DNS Server:</span>
                  <span className="font-mono">8.8.8.8</span>
                </div>
              </div>
              
              {/* Activity */}
              <div className="bg-gray-100 rounded p-2">
                <div className="text-xs font-bold mb-1">Activity</div>
                <div className="flex justify-between text-xs">
                  <div>
                    <span className="text-gray-600">Sent: </span>
                    <span className="font-medium">1,247 packets</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Received: </span>
                    <span className="font-medium">3,891 packets</span>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Clock with Calendar Popup */}
        <Popover>
          <PopoverTrigger 
            className="text-white text-xs font-medium pl-2 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer"
            onClick={() => setCalendarDate(new Date())}
          >
            {formatTime(time)}
          </PopoverTrigger>
          <PopoverContent 
            className="w-56 p-0 bg-[#ece9d8] border-2 border-[#0054e3] shadow-lg"
            align="end"
            sideOffset={8}
          >
            {/* Digital Clock */}
            <div className="bg-gradient-to-b from-[#0054e3] to-[#003399] text-white p-2 text-center">
              <div className="text-2xl font-bold font-mono">{formatFullTime(time)}</div>
              <div className="text-xs opacity-80">
                {DAYS[time.getDay()]}, {MONTHS[time.getMonth()]} {time.getDate()}, {time.getFullYear()}
              </div>
            </div>
            
            {/* Calendar */}
            <div className="p-2">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={prevMonth}
                  className="p-0.5 hover:bg-[#316ac5] hover:text-white rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold">
                  {MONTHS[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </span>
                <button 
                  onClick={nextMonth}
                  className="p-0.5 hover:bg-[#316ac5] hover:text-white rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAYS.map(day => (
                  <div key={day} className="w-6 h-5 flex items-center justify-center text-xs font-bold text-[#003399]">
                    {day.charAt(0)}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-0.5">
                {renderCalendar()}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Taskbar;
