import { useCallback, useRef } from 'react';

// Windows XP authentic sound URLs
const SOUNDS = {
  startup: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Windows_XP_Startup.ogg',
  error: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Windows_Critical_Stop.wav',
  click: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Windows_XP_Navigation_Start.ogg',
  notify: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Windows_XP_Balloon.wav',
  logon: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Windows_XP_Startup.ogg',
};

export const useXPSounds = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((sound: keyof typeof SOUNDS, volume = 0.3) => {
    try {
      // Don't interrupt for click sounds
      if (sound === 'click') {
        const clickAudio = new Audio(SOUNDS[sound]);
        clickAudio.volume = volume;
        clickAudio.play().catch(() => {});
        return;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(SOUNDS[sound]);
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch (e) {
      // Silently fail if audio isn't supported
    }
  }, []);

  const playClick = useCallback(() => playSound('click', 0.2), [playSound]);
  const playError = useCallback(() => playSound('error', 0.3), [playSound]);
  const playNotify = useCallback(() => playSound('notify', 0.3), [playSound]);
  const playStartup = useCallback(() => playSound('startup', 0.5), [playSound]);
  const playLogon = useCallback(() => playSound('logon', 0.4), [playSound]);

  return {
    playClick,
    playError,
    playNotify,
    playStartup,
    playLogon,
    playSound,
  };
};
