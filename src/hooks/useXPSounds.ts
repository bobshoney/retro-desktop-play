import { useCallback, useRef } from 'react';

// Windows XP and era-appropriate sound URLs
const SOUNDS = {
  // Windows XP System Sounds
  startup: 'https://www.myinstants.com/media/sounds/windows-xp-startup.mp3',
  shutdown: 'https://www.myinstants.com/media/sounds/windows-xp-shutdown.mp3',
  error: 'https://www.myinstants.com/media/sounds/erro.mp3',
  click: 'https://www.myinstants.com/media/sounds/click-button.mp3',
  notify: 'https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3',
  windowOpen: 'https://www.myinstants.com/media/sounds/windows-xp-navigation-start.mp3',
  windowClose: 'https://www.myinstants.com/media/sounds/windows-xp-exclamation.mp3',
  minimize: 'https://www.myinstants.com/media/sounds/windows-xp-balloon.mp3',
  maximize: 'https://www.myinstants.com/media/sounds/windows-xp-hardware-insert.mp3',
  
  // AOL Sounds
  dialup: 'https://www.myinstants.com/media/sounds/dial-up-modem-01.mp3',
  aolWelcome: 'https://www.myinstants.com/media/sounds/youve-got-mail-sound.mp3',
  imReceive: 'https://www.myinstants.com/media/sounds/aim-message-received.mp3',
  imSend: 'https://www.myinstants.com/media/sounds/aim-sound.mp3',
  buddySignOn: 'https://www.myinstants.com/media/sounds/aim-door-open-sound.mp3',
  buddySignOff: 'https://www.myinstants.com/media/sounds/aim-door-slam.mp3',
  
  // Recycle Bin & File Sounds
  emptyRecycle: 'https://www.myinstants.com/media/sounds/recycle.mp3',
  delete: 'https://www.myinstants.com/media/sounds/trash_empty.mp3',
  
  // Additional XP Sounds
  logon: 'https://www.myinstants.com/media/sounds/windows-xp-logon.mp3',
  logoff: 'https://www.myinstants.com/media/sounds/windows-xp-logoff.mp3',
  critical: 'https://www.myinstants.com/media/sounds/windows-critical-stop.mp3',
  exclamation: 'https://www.myinstants.com/media/sounds/windows-xp-exclamation.mp3',
  question: 'https://www.myinstants.com/media/sounds/windows-xp-balloon.mp3',
  deviceConnect: 'https://www.myinstants.com/media/sounds/windows-xp-hardware-insert.mp3',
  deviceDisconnect: 'https://www.myinstants.com/media/sounds/windows-xp-hardware-remove.mp3',
  menuPopup: 'https://www.myinstants.com/media/sounds/menu-selection-click.mp3',
};

export const useXPSounds = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dialupAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((sound: keyof typeof SOUNDS, volume = 0.3) => {
    try {
      // Quick sounds that shouldn't interrupt others
      const quickSounds = [
        'click', 'minimize', 'maximize', 'windowOpen', 'windowClose',
        'imReceive', 'imSend', 'buddySignOn', 'buddySignOff', 'menuPopup',
        'delete', 'deviceConnect', 'deviceDisconnect'
      ];
      
      if (quickSounds.includes(sound)) {
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

  // Special handler for dialup that can be stopped
  const playDialup = useCallback((volume = 0.4) => {
    try {
      if (dialupAudioRef.current) {
        dialupAudioRef.current.pause();
      }
      dialupAudioRef.current = new Audio(SOUNDS.dialup);
      dialupAudioRef.current.volume = volume;
      dialupAudioRef.current.play().catch((err) => {
        console.log('Dialup audio play error:', err);
      });
    } catch (e) {
      console.log('Dialup sound error:', e);
    }
  }, []);

  const stopDialup = useCallback(() => {
    if (dialupAudioRef.current) {
      dialupAudioRef.current.pause();
      dialupAudioRef.current.currentTime = 0;
    }
  }, []);

  // Core XP sounds
  const playClick = useCallback(() => playSound('click', 0.2), [playSound]);
  const playError = useCallback(() => playSound('error', 0.4), [playSound]);
  const playNotify = useCallback(() => playSound('notify', 0.4), [playSound]);
  const playStartup = useCallback(() => playSound('startup', 0.5), [playSound]);
  const playShutdown = useCallback(() => playSound('shutdown', 0.5), [playSound]);
  const playWindowOpen = useCallback(() => playSound('windowOpen', 0.3), [playSound]);
  const playWindowClose = useCallback(() => playSound('windowClose', 0.3), [playSound]);
  const playMinimize = useCallback(() => playSound('minimize', 0.25), [playSound]);
  const playMaximize = useCallback(() => playSound('maximize', 0.25), [playSound]);
  
  // AOL sounds
  const playAOLWelcome = useCallback(() => playSound('aolWelcome', 0.5), [playSound]);
  const playIMReceive = useCallback(() => playSound('imReceive', 0.4), [playSound]);
  const playIMSend = useCallback(() => playSound('imSend', 0.4), [playSound]);
  const playBuddySignOn = useCallback(() => playSound('buddySignOn', 0.4), [playSound]);
  const playBuddySignOff = useCallback(() => playSound('buddySignOff', 0.4), [playSound]);
  
  // Recycle bin sounds
  const playEmptyRecycle = useCallback(() => playSound('emptyRecycle', 0.4), [playSound]);
  const playDelete = useCallback(() => playSound('delete', 0.3), [playSound]);
  
  // Additional XP sounds
  const playLogon = useCallback(() => playSound('logon', 0.5), [playSound]);
  const playLogoff = useCallback(() => playSound('logoff', 0.5), [playSound]);
  const playCritical = useCallback(() => playSound('critical', 0.4), [playSound]);
  const playExclamation = useCallback(() => playSound('exclamation', 0.3), [playSound]);
  const playDeviceConnect = useCallback(() => playSound('deviceConnect', 0.3), [playSound]);
  const playDeviceDisconnect = useCallback(() => playSound('deviceDisconnect', 0.3), [playSound]);
  const playMenuPopup = useCallback(() => playSound('menuPopup', 0.2), [playSound]);

  return {
    // Core XP
    playClick,
    playError,
    playNotify,
    playStartup,
    playShutdown,
    playWindowOpen,
    playWindowClose,
    playMinimize,
    playMaximize,
    
    // AOL
    playDialup,
    stopDialup,
    playAOLWelcome,
    playIMReceive,
    playIMSend,
    playBuddySignOn,
    playBuddySignOff,
    
    // Recycle Bin
    playEmptyRecycle,
    playDelete,
    
    // Additional
    playLogon,
    playLogoff,
    playCritical,
    playExclamation,
    playDeviceConnect,
    playDeviceDisconnect,
    playMenuPopup,
    
    playSound,
  };
};
