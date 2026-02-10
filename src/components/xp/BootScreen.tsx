import React, { useState, useEffect, useRef, useCallback } from 'react';

// BIOS POST lines - authentic early 2000s PC boot sequence
const BIOS_LINES = [
  { text: 'Award Modular BIOS v6.00PG, An Energy Star Ally', delay: 0 },
  { text: 'Copyright (C) 1984-2003, Award Software, Inc.', delay: 80 },
  { text: '', delay: 200 },
  { text: 'Intel(R) Pentium(R) 4 CPU 2.80GHz', delay: 300 },
  { text: 'Speed: 2.80 GHz', delay: 100 },
  { text: '', delay: 50 },
  { text: 'Press DEL to enter SETUP, ESC to skip memory test', delay: 200 },
  { text: '', delay: 100 },
  { text: 'Checking NVRAM..', delay: 300 },
  { text: '512MB OK', delay: 400 },
  { text: '', delay: 50 },
  { text: 'Auto-Detecting Primary Master....IDE Hard Disk', delay: 350 },
  { text: 'Auto-Detecting Primary Slave.....ATAPI CD-ROM', delay: 300 },
  { text: 'Auto-Detecting Secondary Master..None', delay: 200 },
  { text: 'Auto-Detecting Secondary Slave...None', delay: 200 },
  { text: '', delay: 100 },
  { text: 'Primary Master  : WDC WD800JB-00JJC0   80.0GB', delay: 150 },
  { text: 'Primary Slave   : HL-DT-ST CD-RW GCE-8526B', delay: 150 },
  { text: '', delay: 100 },
  { text: 'Floppy Disk(s): 1.44M 3.5 in.', delay: 200 },
  { text: '', delay: 100 },
  { text: 'Verifying DMI Pool Data ........ ', delay: 500 },
  { text: 'Update Success', delay: 300 },
  { text: '', delay: 100 },
  { text: 'Boot from CD: _', delay: 400 },
  { text: '', delay: 200 },
  { text: 'Starting Windows XP...', delay: 0 },
];

type BootPhase = 'bios' | 'xp-logo' | 'done';

interface BootScreenProps {
  onComplete?: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<BootPhase>('bios');
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [xpProgress, setXpProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const beepPlayed = useRef(false);

  // Play BIOS beep on mount
  useEffect(() => {
    if (beepPlayed.current) return;
    beepPlayed.current = true;
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1000;
      osc.type = 'square';
      gain.gain.value = 0.08;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio context may not be unlocked yet
    }
  }, []);

  // BIOS text sequence
  useEffect(() => {
    if (phase !== 'bios') return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    let totalDelay = 300; // initial pause

    const showNext = () => {
      if (currentIndex >= BIOS_LINES.length) {
        // Transition to XP logo after last line
        timeoutId = setTimeout(() => setPhase('xp-logo'), 600);
        return;
      }

      const line = BIOS_LINES[currentIndex];
      totalDelay = line.delay;
      
      timeoutId = setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text]);
        currentIndex++;
        // Auto-scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        showNext();
      }, totalDelay);
    };

    showNext();
    return () => clearTimeout(timeoutId);
  }, [phase]);

  // XP logo progress bar
  useEffect(() => {
    if (phase !== 'xp-logo') return;

    // Play a subtle HDD activity sound
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.01;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();
    } catch {
      // ignore
    }

    const interval = setInterval(() => {
      setXpProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('done');
            onComplete?.();
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  // BIOS POST screen
  if (phase === 'bios') {
    return (
      <div className="fixed inset-0 bg-black z-[99999] flex flex-col overflow-hidden font-mono select-none">
        <div
          ref={containerRef}
          className="flex-1 p-4 overflow-y-auto text-[#AAAAAA] text-xs sm:text-sm leading-5"
          style={{ fontFamily: "'Courier New', 'Lucida Console', monospace" }}
        >
          {visibleLines.map((line, i) => (
            <div key={i} className={`whitespace-pre ${i === 0 ? 'text-[#55FFFF] font-bold' : ''} ${line.includes('512MB') ? 'text-[#55FF55]' : ''} ${line.includes('Starting Windows') ? 'text-white font-bold' : ''}`}>
              {line || '\u00A0'}
            </div>
          ))}
          {/* Blinking cursor */}
          <span className="inline-block w-2 h-4 bg-[#AAAAAA] animate-pulse" />
        </div>
      </div>
    );
  }

  // XP Logo boot screen
  if (phase === 'xp-logo') {
    return (
      <div className="xp-boot-screen">
        <div className="flex flex-col items-center gap-8">
          {/* Windows XP Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-8 h-8 bg-[#f65314] rounded-sm animate-pulse"></div>
                <div className="w-8 h-8 bg-[#7cbb00] rounded-sm animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-8 h-8 bg-[#00a1f1] rounded-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-8 h-8 bg-[#ffbb00] rounded-sm animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
            <div className="text-white ml-4">
              <div className="text-3xl font-light tracking-wide">Microsoft</div>
              <div className="text-4xl font-bold tracking-tight">Windows<span className="text-2xl align-super">XP</span></div>
            </div>
          </div>

          <div className="text-white text-lg tracking-widest">
            Professional
          </div>

          {/* Animated progress bar with moving blocks */}
          <div className="mt-8 h-3 overflow-hidden rounded-sm" style={{ width: 220, background: '#1a1a2e' }}>
            <div className="h-full relative overflow-hidden">
              <div className="xp-boot-progress h-full" style={{ width: `${xpProgress}%` }} />
              {/* Animated blocks overlay */}
              <div className="absolute inset-0 flex gap-[2px]" style={{ animation: 'bootBlocks 1s linear infinite' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full flex-1 rounded-[1px]"
                    style={{
                      background: 'linear-gradient(180deg, #5B9BD5 0%, #2D6BC4 50%, #1A4FA0 100%)',
                      opacity: (i + Math.floor(xpProgress / 5)) % 3 === 0 ? 1 : 0.3,
                      transition: 'opacity 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 text-gray-400 text-xs">
          Copyright © Microsoft Corporation
        </div>
      </div>
    );
  }

  return null;
};

export default BootScreen;
