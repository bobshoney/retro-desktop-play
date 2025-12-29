import React, { useState, useEffect } from 'react';
import { Volume2, Wifi, Minus, Square, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWindows } from '@/pages/Index';
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
  const { windows, focusWindow, minimizeWindow, toggleMaximize, closeWindow, activeWindowId, playClick } = useWindows();

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
    playClick();
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
    playClick();
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    playClick();
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
        onClick={(e) => {
          playClick();
          onStartClick(e);
        }}
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
      <div className="w-px h-5 bg-blue-400/50 mx-2"></div>

      {/* Open Windows */}
      <div className="flex-1 flex items-center gap-1 overflow-hidden px-1">
        {windows.map((window) => {
          const isActive = activeWindowId === window.id && !window.isMinimized;
          return (
            <ContextMenu key={window.id}>
              <ContextMenuTrigger asChild>
                <button
                  onClick={() => handleWindowClick(window.id, window.isMinimized)}
                  className={`h-7 px-2 text-xs text-white truncate max-w-44 rounded-sm border transition-all flex items-center gap-1.5
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
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-40 bg-[#ece9d8] border-[#0054e3] shadow-md">
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
                  onClick={() => { playClick(); focusWindow(window.id); }}
                >
                  <Square className="w-3 h-3" />
                  Restore
                </ContextMenuItem>
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
                  onClick={() => { playClick(); minimizeWindow(window.id); }}
                >
                  <Minus className="w-3 h-3" />
                  Minimize
                </ContextMenuItem>
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white"
                  onClick={() => { playClick(); toggleMaximize(window.id); }}
                >
                  <Square className="w-3 h-3" />
                  {window.isMaximized ? 'Restore' : 'Maximize'}
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-gray-400" />
                <ContextMenuItem 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#316ac5] hover:text-white font-bold"
                  onClick={() => { playClick(); closeWindow(window.id); }}
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
        className="flex items-center gap-2 px-2 h-full"
        style={{
          background: 'linear-gradient(180deg, #0f4c9c 0%, #1565c0 50%, #0d47a1 100%)'
        }}
      >
        <Volume2 className="w-4 h-4 text-white/80" />
        <Wifi className="w-4 h-4 text-white/80" />
        
        {/* Clock with Calendar Popup */}
        <Popover>
          <PopoverTrigger asChild>
            <button 
              className="text-white text-xs font-medium pl-2 hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer"
              onClick={() => {
                playClick();
                setCalendarDate(new Date());
              }}
            >
              {formatTime(time)}
            </button>
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
