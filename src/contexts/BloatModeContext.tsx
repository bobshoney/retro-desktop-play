import React, { createContext, useContext, useState, useCallback } from 'react';

interface BloatModeContextType {
  bloatEnabled: boolean;
  setBloatEnabled: (enabled: boolean) => void;
  hasActiveAds: boolean;
  setHasActiveAds: (active: boolean) => void;
  // New: track popup spawns to show "block popups?" notification
  popupSpawnCount: number;
  notifyPopupSpawn: () => void;
  showBlockerPrompt: boolean;
  dismissBlockerPrompt: () => void;
}

const BloatModeContext = createContext<BloatModeContextType | null>(null);

const STORAGE_KEY = 'xp-bloat-mode';
const PROMPT_THRESHOLD = 2; // Show blocker prompt after this many popups

export const BloatModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bloatEnabled, setBloatEnabledState] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true; // Default to true for authentic experience
  });
  const [hasActiveAds, setHasActiveAds] = useState(false);
  const [popupSpawnCount, setPopupSpawnCount] = useState(0);
  const [showBlockerPrompt, setShowBlockerPrompt] = useState(false);
  const [hasSeenPrompt, setHasSeenPrompt] = useState(false);

  const setBloatEnabled = useCallback((enabled: boolean) => {
    setBloatEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));
    if (!enabled) {
      setHasActiveAds(false);
      setShowBlockerPrompt(false);
    }
  }, []);

  const notifyPopupSpawn = useCallback(() => {
    if (!bloatEnabled) return;
    
    setPopupSpawnCount(prev => {
      const newCount = prev + 1;
      // Show blocker prompt after threshold popups, if not already shown
      if (newCount >= PROMPT_THRESHOLD && !hasSeenPrompt) {
        setShowBlockerPrompt(true);
      }
      return newCount;
    });
    setHasActiveAds(true);
  }, [bloatEnabled, hasSeenPrompt]);

  const dismissBlockerPrompt = useCallback(() => {
    setShowBlockerPrompt(false);
    setHasSeenPrompt(true);
  }, []);

  return (
    <BloatModeContext.Provider value={{
      bloatEnabled,
      setBloatEnabled,
      hasActiveAds,
      setHasActiveAds,
      popupSpawnCount,
      notifyPopupSpawn,
      showBlockerPrompt,
      dismissBlockerPrompt,
    }}>
      {children}
    </BloatModeContext.Provider>
  );
};

export const useBloatMode = () => {
  const context = useContext(BloatModeContext);
  if (!context) {
    throw new Error('useBloatMode must be used within a BloatModeProvider');
  }
  return context;
};
