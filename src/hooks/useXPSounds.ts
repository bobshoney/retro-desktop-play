import { useCallback, useRef } from 'react';

// Windows XP sound URLs - using reliable hosted sources
const SOUNDS = {
  startup: 'https://www.myinstants.com/media/sounds/windows-xp-startup.mp3',
  shutdown: 'https://www.myinstants.com/media/sounds/windows-xp-shutdown.mp3',
  error: 'https://www.myinstants.com/media/sounds/erro.mp3',
  click: 'https://www.myinstants.com/media/sounds/click-button.mp3',
  notify: 'https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3',
  windowOpen: 'https://www.myinstants.com/media/sounds/windows-xp-navigation-start.mp3',
  windowClose: 'https://www.myinstants.com/media/sounds/windows-xp-exclamation.mp3',
  minimize: 'https://www.myinstants.com/media/sounds/windows-xp-balloon.mp3',
  maximize: 'https://www.myinstants.com/media/sounds/windows-xp-hardware-insert.mp3',
};

export const useXPSounds = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((sound: keyof typeof SOUNDS, volume = 0.3) => {
    try {
      // Quick sounds that shouldn't interrupt others
      if (['click', 'minimize', 'maximize', 'windowOpen', 'windowClose'].includes(sound)) {
        const audio = new Audio(SOUNDS[sound]);
        audio.volume = volume;
        audio.play().catch((err) => {
          console.log('Audio play error:', err);
        });
        return;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(SOUNDS[sound]);
      audioRef.current.volume = volume;
      audioRef.current.play().catch((err) => {
        console.log('Audio play error:', err);
      });
    } catch (e) {
      console.log('Sound error:', e);
    }
  }, []);

  const playClick = useCallback(() => playSound('click', 0.2), [playSound]);
  const playError = useCallback(() => playSound('error', 0.4), [playSound]);
  const playNotify = useCallback(() => playSound('notify', 0.4), [playSound]);
  const playStartup = useCallback(() => playSound('startup', 0.5), [playSound]);
  const playShutdown = useCallback(() => playSound('shutdown', 0.5), [playSound]);
  const playWindowOpen = useCallback(() => playSound('windowOpen', 0.3), [playSound]);
  const playWindowClose = useCallback(() => playSound('windowClose', 0.3), [playSound]);
  const playMinimize = useCallback(() => playSound('minimize', 0.25), [playSound]);
  const playMaximize = useCallback(() => playSound('maximize', 0.25), [playSound]);

  return {
    playClick,
    playError,
    playNotify,
    playStartup,
    playShutdown,
    playWindowOpen,
    playWindowClose,
    playMinimize,
    playMaximize,
    playSound,
  };
};
