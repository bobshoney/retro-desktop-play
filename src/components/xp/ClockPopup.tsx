import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

interface ClockPopupProps {
  children: React.ReactNode;
}

const ClockPopup: React.FC<ClockPopupProps> = ({ children }) => {
  const [time, setTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    
    // Previous month's trailing days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="w-6 h-5 flex items-center justify-center text-xs text-gray-400">
          {prevMonthDays - i}
        </div>
      );
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                      today.getMonth() === month && 
                      today.getFullYear() === year;
      days.push(
        <div 
          key={day} 
          className={`w-6 h-5 flex items-center justify-center text-xs cursor-pointer rounded-sm
            ${isToday ? 'bg-[#003399] text-white font-bold border border-[#6699ff]' : 'hover:bg-[#316ac5] hover:text-white'}`}
        >
          {day}
        </div>
      );
    }
    
    // Next month's leading days
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="w-6 h-5 flex items-center justify-center text-xs text-gray-400">
          {i}
        </div>
      );
    }
    
    return days;
  };

  const formatFullTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-56 p-0 bg-[#ece9d8] border-2 border-[#0054e3] shadow-lg"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#0054e3] to-[#003399] text-white p-2 text-center">
          <div className="text-lg font-bold font-mono">{formatFullTime(time)}</div>
          <div className="text-xs opacity-90">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Calendar */}
        <div className="p-2">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={prevMonth}
              className="p-0.5 hover:bg-[#316ac5] hover:text-white rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-bold text-[#003399]">
              {MONTHS[calendarDate.getMonth()]} {calendarDate.getFullYear()}
            </div>
            <button 
              onClick={nextMonth}
              className="p-0.5 hover:bg-[#316ac5] hover:text-white rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAYS.map((day, i) => (
              <div key={i} className="w-6 h-4 flex items-center justify-center text-xs font-bold text-[#003399]">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {renderCalendar()}
          </div>
        </div>

        {/* Footer - Time Zone */}
        <div className="border-t border-gray-400 px-2 py-1 text-xs text-gray-600 text-center">
          Current time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ClockPopup;
