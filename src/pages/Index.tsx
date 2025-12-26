import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import BootScreen from '@/components/xp/BootScreen';
import LoginScreen from '@/components/xp/LoginScreen';
import Desktop from '@/components/xp/Desktop';
import { useXPSounds } from '@/hooks/useXPSounds';

type AppState = 'boot' | 'login' | 'desktop';

interface WindowState {
  id: string;
  title: string;
  component: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  zIndex: number;
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (id: string, title: string, component: string, width?: number, height?: number) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  activeWindowId: string | null;
  playClick: () => void;
}

export const WindowContext = createContext<WindowContextType | null>(null);

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error('useWindows must be used within WindowProvider');
  return context;
};

const Index = () => {
  const [appState, setAppState] = useState<AppState>('boot');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zCounter, setZCounter] = useState(100);
  const { playStartup, playClick } = useXPSounds();

  useEffect(() => {
    // Play startup sound when boot begins
    const soundTimer = setTimeout(() => playStartup(), 500);
    const bootTimer = setTimeout(() => setAppState('login'), 3500);
    return () => {
      clearTimeout(bootTimer);
      clearTimeout(soundTimer);
    };
  }, [playStartup]);

  const openWindow = useCallback((id: string, title: string, component: string, width = 500, height = 400) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: zCounter + 1 } : w);
      }
      const offset = prev.length * 30;
      return [...prev, {
        id,
        title,
        component,
        x: 100 + offset,
        y: 50 + offset,
        width,
        height,
        isMinimized: false,
        zIndex: zCounter + 1
      }];
    });
    setZCounter(z => z + 1);
    setActiveWindowId(id);
  }, [zCounter]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(null);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: zCounter + 1, isMinimized: false } : w
    ));
    setZCounter(z => z + 1);
    setActiveWindowId(id);
  }, [zCounter]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    setActiveWindowId(null);
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const handleLogin = () => setAppState('desktop');

  if (appState === 'boot') return <BootScreen />;
  if (appState === 'login') return <LoginScreen onLogin={handleLogin} />;

  return (
    <WindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      updateWindowPosition,
      activeWindowId,
      playClick
    }}>
      <Desktop />
    </WindowContext.Provider>
  );
};

export default Index;
