import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface BloatModeContextType {
  bloatEnabled: boolean;
  setBloatEnabled: (enabled: boolean) => void;
  hasActiveAds: boolean;
  setHasActiveAds: (active: boolean) => void;
}

const BloatModeContext = createContext<BloatModeContextType | null>(null);

const STORAGE_KEY = 'xp-bloat-mode';

export const BloatModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bloatEnabled, setBloatEnabledState] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true; // Default to true for authentic experience
  });
  const [hasActiveAds, setHasActiveAds] = useState(false);

  const setBloatEnabled = useCallback((enabled: boolean) => {
    setBloatEnabledState(enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, []);

  return (
    <BloatModeContext.Provider value={{
      bloatEnabled,
      setBloatEnabled,
      hasActiveAds,
      setHasActiveAds
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
