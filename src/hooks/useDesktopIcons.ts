import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 80;
const ICON_PADDING = 16;

export interface IconPosition {
  id: string;
  x: number;
  y: number;
}

const defaultPositions: IconPosition[] = [
  // Column 1 - System & Personal
  { id: 'mycomputer', x: 16, y: 16 },
  { id: 'resume', x: 16, y: 96 },
  { id: 'about', x: 16, y: 176 },
  { id: 'contact', x: 16, y: 256 },
  { id: 'notepad', x: 16, y: 336 },
  { id: 'calc', x: 16, y: 416 },
  // Column 2 - Internet & Communication
  { id: 'ie', x: 96, y: 16 },
  { id: 'aol', x: 96, y: 96 },
  { id: 'msn', x: 96, y: 176 },
  { id: 'cmd', x: 96, y: 256 },
  // Column 3 - P2P & Music
  { id: 'napster', x: 176, y: 16 },
  { id: 'limewire', x: 176, y: 96 },
  { id: 'kazaa', x: 176, y: 176 },
  { id: 'winamp', x: 176, y: 256 },
  { id: 'mediaplayer', x: 176, y: 336 },
  // Column 4 - Games & Creative
  { id: 'minesweeper', x: 256, y: 16 },
  { id: 'solitaire', x: 256, y: 96 },
  { id: 'pinball', x: 256, y: 176 },
  { id: 'paint', x: 256, y: 256 },
];

export const useDesktopIcons = () => {
  const [positions, setPositions] = useState<IconPosition[]>(() => {
    const saved = localStorage.getItem('xp-icon-positions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultPositions;
      }
    }
    return defaultPositions;
  });

  useEffect(() => {
    localStorage.setItem('xp-icon-positions', JSON.stringify(positions));
  }, [positions]);

  const snapToGrid = useCallback((x: number, y: number): { x: number; y: number } => {
    const snappedX = Math.max(ICON_PADDING, Math.round((x - ICON_PADDING) / GRID_SIZE) * GRID_SIZE + ICON_PADDING);
    const snappedY = Math.max(ICON_PADDING, Math.round((y - ICON_PADDING) / GRID_SIZE) * GRID_SIZE + ICON_PADDING);
    return { x: snappedX, y: snappedY };
  }, []);

  const updateIconPosition = useCallback((id: string, x: number, y: number) => {
    const snapped = snapToGrid(x, y);
    setPositions(prev => {
      const existing = prev.find(p => p.id === id);
      if (existing) {
        return prev.map(p => p.id === id ? { ...p, ...snapped } : p);
      }
      return [...prev, { id, ...snapped }];
    });
  }, [snapToGrid]);

  const getIconPosition = useCallback((id: string): { x: number; y: number } => {
    const pos = positions.find(p => p.id === id);
    return pos ? { x: pos.x, y: pos.y } : { x: 16, y: 16 };
  }, [positions]);

  const resetPositions = useCallback(() => {
    setPositions(defaultPositions);
    localStorage.removeItem('xp-icon-positions');
  }, []);

  return {
    positions,
    updateIconPosition,
    getIconPosition,
    resetPositions,
    snapToGrid,
  };
};
