import { useEffect, useState } from 'react';

interface BlueScreenProps {
  onDismiss?: () => void;
}

const BlueScreen: React.FC<BlueScreenProps> = ({ onDismiss }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Random error codes
  const errorCodes = [
    'IRQL_NOT_LESS_OR_EQUAL',
    'KERNEL_DATA_INPAGE_ERROR',
    'PAGE_FAULT_IN_NONPAGED_AREA',
    'DRIVER_IRQL_NOT_LESS_OR_EQUAL',
    'SYSTEM_SERVICE_EXCEPTION',
    'BAD_POOL_HEADER',
    'MEMORY_MANAGEMENT',
    'KMODE_EXCEPTION_NOT_HANDLED',
    'UNEXPECTED_KERNEL_MODE_TRAP',
    'CRITICAL_PROCESS_DIED',
  ];
  
  const [errorCode] = useState(() => 
    errorCodes[Math.floor(Math.random() * errorCodes.length)]
  );
  
  const [stopCode] = useState(() => 
    `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}`
  );

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 200);

    // Auto dismiss after 15 seconds (press any key dismisses immediately)
    const timeout = setTimeout(() => {
      onDismiss?.();
    }, 15000);

    const handleKeyPress = () => {
      onDismiss?.();
    };

    const handleClick = () => {
      onDismiss?.();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      clearInterval(cursorInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [onDismiss]);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#0000AA] flex items-center justify-center cursor-none select-none"
      style={{ fontFamily: 'Consolas, "Lucida Console", monospace' }}
    >
      <div className="text-white text-sm leading-relaxed max-w-3xl p-8">
        <div className="text-center mb-8">
          <span className="bg-white text-[#0000AA] px-4 py-1 font-bold">
            Windows
          </span>
        </div>

        <p className="mb-4">
          A problem has been detected and Windows has been shut down to prevent damage
          to your computer.
        </p>

        <p className="mb-4 font-bold text-yellow-300">
          {errorCode}
        </p>

        <p className="mb-4">
          If this is the first time you've seen this Stop error screen,
          restart your computer. If this screen appears again, follow
          these steps:
        </p>

        <p className="mb-2">
          Check to make sure any new hardware or software is properly installed.
          If this is a new installation, ask your hardware or software manufacturer
          for any Windows updates you might need.
        </p>

        <p className="mb-4">
          If problems continue, disable or remove any newly installed hardware
          or software. Disable BIOS memory options such as caching or shadowing.
          If you need to use Safe Mode to remove or disable components, restart
          your computer, press F8 to select Advanced Startup Options, and then
          select Safe Mode.
        </p>

        <p className="mb-4 font-mono text-xs">
          Technical information:
        </p>

        <p className="mb-2 font-mono text-xs">
          *** STOP: {stopCode} (0x00000001, 0x00000002, 0x00000003, 0x00000004)
        </p>

        <p className="mb-4 font-mono text-xs">
          *** {errorCode.toLowerCase().replace(/_/g, '')}.sys - Address {stopCode} base at {stopCode}
        </p>

        <div className="mt-8">
          <p>
            Collecting data for crash dump ...
          </p>
          <p>
            Initializing disk for crash dump ...
          </p>
          <p className="mb-2">
            Physical memory dump: {Math.min(Math.round(progress), 100)}% complete
          </p>
          <div className="w-64 h-4 bg-[#000066] border border-white/30">
            <div 
              className="h-full bg-white/60 transition-all duration-200"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <p className="mt-8 animate-pulse">
          Press any key to restart{showCursor ? '_' : ' '}
        </p>
      </div>
    </div>
  );
};

export default BlueScreen;
