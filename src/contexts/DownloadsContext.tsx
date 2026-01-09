import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DownloadedTrack {
  id: string;
  title: string;
  artist: string;
  source: 'napster' | 'limewire';
  audioUrl: string;
  duration: string;
}

interface DownloadsContextType {
  downloads: DownloadedTrack[];
  addDownload: (track: DownloadedTrack) => void;
  removeDownload: (id: string) => void;
  clearDownloads: () => void;
}

const DownloadsContext = createContext<DownloadsContextType | undefined>(undefined);

export const DownloadsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadedTrack[]>([]);

  const addDownload = (track: DownloadedTrack) => {
    setDownloads(prev => {
      // Don't add duplicates
      if (prev.some(d => d.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const removeDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const clearDownloads = () => {
    setDownloads([]);
  };

  return (
    <DownloadsContext.Provider value={{ downloads, addDownload, removeDownload, clearDownloads }}>
      {children}
    </DownloadsContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadsContext);
  if (!context) {
    throw new Error('useDownloads must be used within a DownloadsProvider');
  }
  return context;
};
