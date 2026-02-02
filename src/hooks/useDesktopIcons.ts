import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 80;
const ICON_PADDING = 16;

export interface IconPosition {
  id: string;
  x: number;
  y: number;
}

const defaultPositions: IconPosition[] = [
  // Column 1
  { id: 'resume', x: 16, y: 16 },
  { id: 'about', x: 16, y: 96 },
  { id: 'contact', x: 16, y: 176 },
  { id: 'ie', x: 16, y: 256 },
  { id: 'aol', x: 16, y: 336 },
  // Column 2
  { id: 'napster', x: 96, y: 16 },
  { id: 'limewire', x: 96, y: 96 },
  { id: 'kazaa', x: 96, y: 176 },
  { id: 'winamp', x: 96, y: 256 },
  { id: 'minesweeper', x: 96, y: 336 },
  // Column 3
  { id: 'paint', x: 176, y: 16 },
  { id: 'notepad', x: 176, y: 96 },
  { id: 'mediaplayer', x: 176, y: 176 },
  { id: 'cmd', x: 176, y: 256 },
  { id: 'msn', x: 176, y: 336 },
  // Column 4
  { id: 'pinball', x: 256, y: 16 },
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
