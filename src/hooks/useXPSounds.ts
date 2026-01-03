import { useCallback, useRef } from 'react';

// Local Windows XP sounds - downloaded from archive.org
const SOUNDS = {
  startup: '/sounds/xp-startup.opus',
  logoff: '/sounds/xp-logoff.opus',
  logon: '/sounds/xp-logon.opus',
  error: '/sounds/xp-error.opus',
  notify: '/sounds/xp-notify.opus',
  ding: '/sounds/xp-ding.opus',
  chord: '/sounds/xp-chord.opus',
  recycle: '/sounds/xp-recycle.opus',
  click: '/sounds/xp-click.opus',
  critical: '/sounds/xp-critical.opus',
  hardwareInsert: '/sounds/xp-hardware-insert.opus',
  hardwareRemove: '/sounds/xp-hardware-remove.opus',
  restore: '/sounds/xp-restore.opus',
};

export const useXPSounds = () => {
  const longSoundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((sound: keyof typeof SOUNDS, volume = 0.3) => {
    try {
      // Long sounds that should stop previous long sounds
      const longSounds = ['startup', 'logoff', 'logon'];
      
      const audio = new Audio(SOUNDS[sound]);
      audio.volume = volume;
      
      if (longSounds.includes(sound)) {
        if (longSoundRef.current) {
          longSoundRef.current.pause();
          longSoundRef.current.currentTime = 0;
        }
        longSoundRef.current = audio;
      }
      
      audio.play().catch(() => {});
    } catch {
      // Silent fail
    }
  }, []);

  // System sounds - play at appropriate moments
  const playStartup = useCallback(() => playSound('startup', 0.5), [playSound]);
  const playLogoff = useCallback(() => playSound('logoff', 0.5), [playSound]);
  const playLogon = useCallback(() => playSound('logon', 0.5), [playSound]);
  
  // UI feedback sounds
  const playClick = useCallback(() => playSound('click', 0.15), [playSound]);
  const playError = useCallback(() => playSound('error', 0.4), [playSound]);
  const playNotify = useCallback(() => playSound('notify', 0.3), [playSound]);
  const playDing = useCallback(() => playSound('ding', 0.3), [playSound]);
  const playChord = useCallback(() => playSound('chord', 0.3), [playSound]);
  
  // Recycle bin
  const playRecycle = useCallback(() => playSound('recycle', 0.4), [playSound]);
  
  // Critical/warning
  const playCritical = useCallback(() => playSound('critical', 0.4), [playSound]);
  
  // Hardware
  const playHardwareInsert = useCallback(() => playSound('hardwareInsert', 0.3), [playSound]);
  const playHardwareRemove = useCallback(() => playSound('hardwareRemove', 0.3), [playSound]);
  
  // Window restore
  const playRestore = useCallback(() => playSound('restore', 0.25), [playSound]);

  return {
    // System
    playStartup,
    playLogoff,
    playLogon,
    
    // UI
    playClick,
    playError,
    playNotify,
    playDing,
    playChord,
    
    // Recycle bin
    playRecycle,
    
    // Critical
    playCritical,
    
    // Hardware
    playHardwareInsert,
    playHardwareRemove,
    
    // Window
    playRestore,
    
    // Generic
    playSound,
  };
};
