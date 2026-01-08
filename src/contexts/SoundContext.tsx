import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// Sound configuration
const SOUNDS = {
  startup: '/sounds/xp-startup',
  logoff: '/sounds/xp-logoff',
  logon: '/sounds/xp-logon',
  error: '/sounds/xp-error',
  notify: '/sounds/xp-notify',
  ding: '/sounds/xp-ding',
  chord: '/sounds/xp-chord',
  recycle: '/sounds/xp-recycle',
  click: '/sounds/xp-click',
  critical: '/sounds/xp-critical',
  hardwareInsert: '/sounds/xp-hardware-insert',
  hardwareRemove: '/sounds/xp-hardware-remove',
  restore: '/sounds/xp-restore',
} as const;

type SoundName = keyof typeof SOUNDS;

interface SoundContextType {
  // State
  volume: number;
  isMuted: boolean;
  isAudioUnlocked: boolean;
  
  // State setters
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  
  // Sound players
  playSound: (sound: SoundName, volumeMultiplier?: number) => void;
  playStartup: () => void;
  playLogoff: () => void;
  playLogon: () => void;
  playClick: () => void;
  playError: () => void;
  playNotify: () => void;
  playDing: () => void;
  playChord: () => void;
  playRecycle: () => void;
  playCritical: () => void;
  playHardwareInsert: () => void;
  playHardwareRemove: () => void;
  playRestore: () => void;
  
  // Audio unlock
  unlockAudio: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

// Detect supported audio format
const getSupportedFormat = (): 'opus' | 'mp3' => {
  const audio = document.createElement('audio');
  // Check opus support
  if (audio.canPlayType('audio/ogg; codecs=opus') !== '' || 
      audio.canPlayType('audio/opus') !== '') {
    return 'opus';
  }
  return 'mp3';
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolumeState] = useState(75);
  const [isMuted, setMuted] = useState(false);
  const [isAudioUnlocked, setAudioUnlocked] = useState(false);
  const [audioFormat, setAudioFormat] = useState<'opus' | 'mp3'>('opus');
  
  const longSoundRef = useRef<HTMLAudioElement | null>(null);
  const audioPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Detect audio format on mount
  useEffect(() => {
    const format = getSupportedFormat();
    setAudioFormat(format);
    console.log(`[XP Sounds] Using audio format: ${format}`);
  }, []);

  // Unlock audio on first user interaction
  const unlockAudio = useCallback(() => {
    if (isAudioUnlocked) return;
    
    // Create and play a silent audio to unlock
    const silentAudio = new Audio();
    silentAudio.volume = 0;
    silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    
    silentAudio.play()
      .then(() => {
        setAudioUnlocked(true);
        console.log('[XP Sounds] Audio unlocked successfully');
        silentAudio.pause();
      })
      .catch((err) => {
        console.warn('[XP Sounds] Audio unlock failed:', err.message);
      });
  }, [isAudioUnlocked]);

  // Auto-unlock on any user interaction
  useEffect(() => {
    const handleInteraction = () => {
      unlockAudio();
    };

    // Listen for first interaction
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [unlockAudio]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(100, newVolume)));
  }, []);

  const playSound = useCallback((sound: SoundName, volumeMultiplier = 1) => {
    console.log(`[XP Sounds] playSound called: ${sound}, muted: ${isMuted}, volume: ${volume}`);
    
    if (isMuted || volume === 0) {
      console.log(`[XP Sounds] Skipped ${sound} (muted or volume 0)`);
      return;
    }

    const basePath = SOUNDS[sound];
    const soundUrl = `${basePath}.${audioFormat}`;
    
    console.log(`[XP Sounds] Attempting to play: ${soundUrl}`);
    
    // Long sounds that should stop previous long sounds
    const longSounds: SoundName[] = ['startup', 'logoff', 'logon'];
    
    try {
      const audio = new Audio(soundUrl);
      audio.volume = (volume / 100) * volumeMultiplier;
      
      // For long sounds, stop any previous long sound
      if (longSounds.includes(sound)) {
        if (longSoundRef.current) {
          longSoundRef.current.pause();
          longSoundRef.current.currentTime = 0;
        }
        longSoundRef.current = audio;
      }
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`[XP Sounds] Playing: ${sound} (format: ${audioFormat}, volume: ${Math.round(audio.volume * 100)}%)`);
          })
          .catch((err) => {
            console.warn(`[XP Sounds] Failed to play ${sound}:`, err.message);
            
            // If opus failed, try mp3 fallback
            if (audioFormat === 'opus') {
              console.log('[XP Sounds] Trying MP3 fallback...');
              const fallbackUrl = `${basePath}.mp3`;
              const fallbackAudio = new Audio(fallbackUrl);
              fallbackAudio.volume = audio.volume;
              fallbackAudio.play().catch(e => {
                console.warn(`[XP Sounds] MP3 fallback also failed:`, e.message);
              });
            }
          });
      }

      // Clean up after playing
      audio.addEventListener('ended', () => {
        if (longSoundRef.current === audio) {
          longSoundRef.current = null;
        }
      });
      
    } catch (err) {
      console.error(`[XP Sounds] Error creating audio for ${sound}:`, err);
    }
  }, [volume, isMuted, audioFormat]);

  // Individual sound functions with appropriate volume levels
  const playStartup = useCallback(() => playSound('startup', 0.7), [playSound]);
  const playLogoff = useCallback(() => playSound('logoff', 0.7), [playSound]);
  const playLogon = useCallback(() => playSound('logon', 0.7), [playSound]);
  const playClick = useCallback(() => playSound('click', 0.2), [playSound]);
  const playError = useCallback(() => playSound('error', 0.5), [playSound]);
  const playNotify = useCallback(() => playSound('notify', 0.4), [playSound]);
  const playDing = useCallback(() => playSound('ding', 0.4), [playSound]);
  const playChord = useCallback(() => playSound('chord', 0.4), [playSound]);
  const playRecycle = useCallback(() => playSound('recycle', 0.5), [playSound]);
  const playCritical = useCallback(() => playSound('critical', 0.5), [playSound]);
  const playHardwareInsert = useCallback(() => playSound('hardwareInsert', 0.4), [playSound]);
  const playHardwareRemove = useCallback(() => playSound('hardwareRemove', 0.4), [playSound]);
  const playRestore = useCallback(() => playSound('restore', 0.3), [playSound]);

  return (
    <SoundContext.Provider value={{
      volume,
      isMuted,
      isAudioUnlocked,
      setVolume,
      setMuted,
      playSound,
      playStartup,
      playLogoff,
      playLogon,
      playClick,
      playError,
      playNotify,
      playDing,
      playChord,
      playRecycle,
      playCritical,
      playHardwareInsert,
      playHardwareRemove,
      playRestore,
      unlockAudio,
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSounds must be used within SoundProvider');
  }
  return context;
};

// Backwards compatibility hook
export const useXPSounds = () => {
  return useSounds();
};
