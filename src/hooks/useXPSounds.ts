import { useCallback, useRef } from 'react';

// Windows XP sound URLs - using reliable hosted sources
const SOUNDS = {
  startup: 'https://www.myinstants.com/media/sounds/windows-xp-startup.mp3',
  error: 'https://www.myinstants.com/media/sounds/erro.mp3',
  click: 'https://www.myinstants.com/media/sounds/click-button.mp3',
  notify: 'https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3',
};

export const useXPSounds = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((sound: keyof typeof SOUNDS, volume = 0.3) => {
    try {
      console.log('Playing sound:', sound, SOUNDS[sound]);
      
      // Don't interrupt for click sounds
      if (sound === 'click') {
        const clickAudio = new Audio(SOUNDS[sound]);
        clickAudio.volume = volume;
        clickAudio.play().catch((err) => {
          console.log('Click audio play error:', err);
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

  const playClick = useCallback(() => playSound('click', 0.3), [playSound]);
  const playError = useCallback(() => playSound('error', 0.4), [playSound]);
  const playNotify = useCallback(() => playSound('notify', 0.4), [playSound]);
  const playStartup = useCallback(() => playSound('startup', 0.5), [playSound]);

  return {
    playClick,
    playError,
    playNotify,
    playStartup,
    playSound,
  };
};
