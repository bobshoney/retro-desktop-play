import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import BootScreen from '@/components/xp/BootScreen';
import LoginScreen from '@/components/xp/LoginScreen';
import ShutdownScreen from '@/components/xp/ShutdownScreen';
import Desktop from '@/components/xp/Desktop';
import { useXPSounds } from '@/hooks/useXPSounds';

type AppState = 'boot' | 'login' | 'desktop' | 'shutdown';

interface WindowState {
  id: string;
  title: string;
  component: string;
  iconSrc?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  prevBounds?: { x: number; y: number; width: number; height: number };
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (id: string, title: string, component: string, iconSrc?: string, width?: number, height?: number) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  activeWindowId: string | null;
  logOff: () => void;
  shutDown: () => void;
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
  const { playLogoff } = useXPSounds();

  const handleBootComplete = useCallback(() => {
    setAppState('login');
  }, []);

  const openWindow = useCallback((id: string, title: string, component: string, iconSrc?: string, width = 500, height = 400) => {
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
        iconSrc,
        x: 100 + offset,
        y: 50 + offset,
        width,
        height,
        isMinimized: false,
        isMaximized: false,
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

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.isMaximized) {
        // Restore to previous bounds
        return {
          ...w,
          isMaximized: false,
          x: w.prevBounds?.x ?? w.x,
          y: w.prevBounds?.y ?? w.y,
          width: w.prevBounds?.width ?? w.width,
          height: w.prevBounds?.height ?? w.height,
          prevBounds: undefined
        };
      } else {
        // Save current bounds and maximize
        return {
          ...w,
          isMaximized: true,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height }
        };
      }
    }));
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width: Math.max(200, width), height: Math.max(150, height) } : w
    ));
  }, []);

  const handleLogin = () => setAppState('desktop');

  const logOff = useCallback(() => {
    setWindows([]);
    setActiveWindowId(null);
    setAppState('login');
  }, []);

  const shutDown = useCallback(() => {
    playLogoff();
    setWindows([]);
    setActiveWindowId(null);
    setAppState('shutdown');
    setTimeout(() => {
      setAppState('boot');
    }, 4000);
  }, [playLogoff]);

  if (appState === 'boot') return <BootScreen onComplete={handleBootComplete} />;
  if (appState === 'login') return <LoginScreen onLogin={handleLogin} />;
  if (appState === 'shutdown') return <ShutdownScreen />;

  return (
    <WindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleMaximize,
      updateWindowPosition,
      updateWindowSize,
      activeWindowId,
      logOff,
      shutDown
    }}>
      <Desktop />
    </WindowContext.Provider>
  );
};

export default Index;
