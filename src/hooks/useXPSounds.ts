import { useCallback, useRef } from 'react';

// Windows XP and era-appropriate sound URLs - using more reliable sources
const SOUNDS = {
  // Windows XP System Sounds (using archive.org and other reliable sources)
  startup: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Windows_XP_Startup.ogg',
  shutdown: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Windows_XP_Shutdown.ogg',
  error: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Windows_XP_Error.ogg',
  click: 'https://cdn.freesound.org/previews/156/156031_2703579-lq.mp3',
  notify: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Windows_XP_Notify.ogg',
  windowOpen: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Windows_XP_Menu_Command.ogg',
  windowClose: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Windows_XP_Exclamation.ogg',
  minimize: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Windows_XP_Balloon.ogg',
  maximize: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Windows_XP_Hardware_Insert.ogg',
  
  // AOL Sounds
  dialup: 'https://www.soundjay.com/communication/sounds/dial-up-modem-01.mp3',
  aolWelcome: 'https://cdn.freesound.org/previews/55/55938_540389-lq.mp3',
  imReceive: 'https://cdn.freesound.org/previews/25/25879_37876-lq.mp3',
  imSend: 'https://cdn.freesound.org/previews/25/25879_37876-lq.mp3',
  buddySignOn: 'https://cdn.freesound.org/previews/220/220206_4100837-lq.mp3',
  buddySignOff: 'https://cdn.freesound.org/previews/220/220206_4100837-lq.mp3',
  
  // Recycle Bin & File Sounds
  emptyRecycle: 'https://cdn.freesound.org/previews/433/433666_7465186-lq.mp3',
  delete: 'https://cdn.freesound.org/previews/433/433666_7465186-lq.mp3',
  
  // Additional XP Sounds
  logon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Windows_XP_Startup.ogg',
  logoff: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Windows_XP_Shutdown.ogg',
  critical: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Windows_XP_Critical_Stop.ogg',
  exclamation: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Windows_XP_Exclamation.ogg',
  question: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Windows_XP_Balloon.ogg',
  deviceConnect: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Windows_XP_Hardware_Insert.ogg',
  deviceDisconnect: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Windows_XP_Hardware_Remove.ogg',
  menuPopup: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Windows_XP_Menu_Command.ogg',
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
        audio.play().catch(() => {
          // Silently fail - audio may not be available
        });
        return;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(SOUNDS[sound]);
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {
        // Silently fail - audio may not be available
      });
    } catch (e) {
      // Silent fail for audio errors
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
      dialupAudioRef.current.play().catch(() => {
        // Silently fail
      });
    } catch (e) {
      // Silent fail
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
