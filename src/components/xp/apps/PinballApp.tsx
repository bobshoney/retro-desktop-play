import { useState, useEffect, useCallback, useRef } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Bumper {
  x: number;
  y: number;
  radius: number;
  points: number;
  color: string;
  isLit: boolean;
}

const PinballApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(50000);
  const [balls, setBalls] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ball, setBall] = useState<Ball | null>(null);
  const [leftFlipper, setLeftFlipper] = useState(0);
  const [rightFlipper, setRightFlipper] = useState(0);
  const [bumpers, setBumpers] = useState<Bumper[]>([
    { x: 150, y: 120, radius: 25, points: 1000, color: '#ff0000', isLit: false },
    { x: 250, y: 100, radius: 25, points: 1000, color: '#00ff00', isLit: false },
    { x: 350, y: 120, radius: 25, points: 1000, color: '#0000ff', isLit: false },
    { x: 200, y: 180, radius: 20, points: 500, color: '#ffff00', isLit: false },
    { x: 300, y: 180, radius: 20, points: 500, color: '#ff00ff', isLit: false },
  ]);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const gameLoopRef = useRef<number>();

  const GRAVITY = 0.15;
  const FRICTION = 0.99;
  const FLIPPER_POWER = -12;
  const TABLE_WIDTH = 500;
  const TABLE_HEIGHT = 600;

  const launchBall = useCallback(() => {
    if (balls <= 0) return;
    setBall({
      x: TABLE_WIDTH - 30,
      y: TABLE_HEIGHT - 100,
      vx: -3 - Math.random() * 2,
      vy: -15 - Math.random() * 3,
    });
    setIsPlaying(true);
    setShowStartScreen(false);
  }, [balls]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft') {
      setLeftFlipper(1);
    }
    if (e.key === '/' || e.key === 'ArrowRight') {
      setRightFlipper(1);
    }
    if (e.key === ' ' && !isPlaying) {
      launchBall();
    }
  }, [isPlaying, launchBall]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft') {
      setLeftFlipper(0);
    }
    if (e.key === '/' || e.key === 'ArrowRight') {
      setRightFlipper(0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const checkBumperCollision = useCallback((ballX: number, ballY: number, ballRadius: number) => {
    let hitBumper = false;
    let newVx = ball?.vx || 0;
    let newVy = ball?.vy || 0;

    const newBumpers = bumpers.map(bumper => {
      const dx = ballX - bumper.x;
      const dy = ballY - bumper.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ballRadius + bumper.radius) {
        hitBumper = true;
        const angle = Math.atan2(dy, dx);
        const speed = Math.sqrt(newVx * newVx + newVy * newVy) * 1.2;
        newVx = Math.cos(angle) * speed;
        newVy = Math.sin(angle) * speed;
        setScore(prev => prev + bumper.points);
        return { ...bumper, isLit: true };
      }
      return { ...bumper, isLit: bumper.isLit && Math.random() > 0.1 };
    });

    if (hitBumper) {
      setBumpers(newBumpers);
      return { vx: newVx, vy: newVy };
    }
    return null;
  }, [ball, bumpers]);

  useEffect(() => {
    if (!isPlaying || !ball) return;

    const gameLoop = () => {
      setBall(prev => {
        if (!prev) return null;

        let newX = prev.x + prev.vx;
        let newY = prev.y + prev.vy;
        let newVx = prev.vx * FRICTION;
        let newVy = prev.vy + GRAVITY;

        // Wall bounces
        if (newX < 20) {
          newX = 20;
          newVx = Math.abs(newVx) * 0.8;
        }
        if (newX > TABLE_WIDTH - 20) {
          newX = TABLE_WIDTH - 20;
          newVx = -Math.abs(newVx) * 0.8;
        }
        if (newY < 20) {
          newY = 20;
          newVy = Math.abs(newVy) * 0.8;
        }

        // Bumper collision
        const bumperHit = checkBumperCollision(newX, newY, 10);
        if (bumperHit) {
          newVx = bumperHit.vx;
          newVy = bumperHit.vy;
        }

        // Flipper collision zones
        const flipperY = TABLE_HEIGHT - 80;
        const leftFlipperX = 120;
        const rightFlipperX = TABLE_WIDTH - 120;

        // Left flipper
        if (newY > flipperY - 20 && newY < flipperY + 20 && newX > 60 && newX < leftFlipperX + 60) {
          if (leftFlipper === 1) {
            newVy = FLIPPER_POWER;
            newVx = (newX - leftFlipperX) * 0.1;
            setScore(prev => prev + 100);
          }
        }

        // Right flipper
        if (newY > flipperY - 20 && newY < flipperY + 20 && newX < TABLE_WIDTH - 60 && newX > rightFlipperX - 60) {
          if (rightFlipper === 1) {
            newVy = FLIPPER_POWER;
            newVx = (newX - rightFlipperX) * 0.1;
            setScore(prev => prev + 100);
          }
        }

        // Ball lost
        if (newY > TABLE_HEIGHT) {
          setBalls(prev => prev - 1);
          setIsPlaying(false);
          if (balls <= 1) {
            if (score > highScore) {
              setHighScore(score);
            }
            setShowStartScreen(true);
          }
          return null;
        }

        return { x: newX, y: newY, vx: newVx, vy: newVy };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, ball, leftFlipper, rightFlipper, balls, score, highScore, checkBumperCollision]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, TABLE_HEIGHT);
    gradient.addColorStop(0, '#1a0a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT);

    // Stars background
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % TABLE_WIDTH;
      const y = (i * 53) % (TABLE_HEIGHT - 100);
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Table borders
    ctx.strokeStyle = '#4a4a8a';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, TABLE_WIDTH - 20, TABLE_HEIGHT - 20);

    // Draw bumpers
    bumpers.forEach(bumper => {
      ctx.beginPath();
      ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
      
      const bumperGradient = ctx.createRadialGradient(
        bumper.x - 5, bumper.y - 5, 0,
        bumper.x, bumper.y, bumper.radius
      );
      bumperGradient.addColorStop(0, bumper.isLit ? '#ffffff' : bumper.color);
      bumperGradient.addColorStop(1, bumper.isLit ? bumper.color : '#333333');
      
      ctx.fillStyle = bumperGradient;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Score display areas
    ctx.fillStyle = '#2a2a4a';
    ctx.fillRect(20, 20, 150, 60);
    ctx.fillRect(TABLE_WIDTH - 170, 20, 150, 60);

    // Labels
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 12px "Segoe UI"';
    ctx.fillText('SCORE', 30, 40);
    ctx.fillText('HIGH SCORE', TABLE_WIDTH - 160, 40);

    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px "Courier New"';
    ctx.fillText(score.toLocaleString(), 30, 65);
    ctx.fillText(highScore.toLocaleString(), TABLE_WIDTH - 160, 65);

    // Draw flippers
    const flipperY = TABLE_HEIGHT - 80;
    const leftFlipperX = 120;
    const rightFlipperX = TABLE_WIDTH - 120;

    // Left flipper
    ctx.save();
    ctx.translate(leftFlipperX - 50, flipperY);
    ctx.rotate(leftFlipper === 1 ? -0.4 : 0.2);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(80, -4);
    ctx.lineTo(80, 4);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Right flipper
    ctx.save();
    ctx.translate(rightFlipperX + 50, flipperY);
    ctx.rotate(rightFlipper === 1 ? 0.4 : -0.2);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-80, -4);
    ctx.lineTo(-80, 4);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw ball
    if (ball) {
      const ballGradient = ctx.createRadialGradient(
        ball.x - 3, ball.y - 3, 0,
        ball.x, ball.y, 10
      );
      ballGradient.addColorStop(0, '#ffffff');
      ballGradient.addColorStop(0.5, '#cccccc');
      ballGradient.addColorStop(1, '#666666');
      
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = ballGradient;
      ctx.fill();
    }

    // Ball count
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 12px "Segoe UI"';
    ctx.fillText('BALLS:', 20, TABLE_HEIGHT - 30);
    for (let i = 0; i < balls; i++) {
      ctx.beginPath();
      ctx.arc(70 + i * 20, TABLE_HEIGHT - 35, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#cccccc';
      ctx.fill();
    }

    // Launch tube
    ctx.fillStyle = '#333366';
    ctx.fillRect(TABLE_WIDTH - 50, TABLE_HEIGHT - 200, 30, 180);

  }, [ball, bumpers, score, highScore, balls, leftFlipper, rightFlipper]);

  const resetGame = () => {
    setBalls(3);
    setScore(0);
    setShowStartScreen(true);
    setBall(null);
    setIsPlaying(false);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Title Bar */}
      <div className="bg-gradient-to-b from-[#000033] to-[#000066] text-white text-center py-1 border-b border-[#4444aa]">
        <span className="font-bold text-lg tracking-wider" style={{ fontFamily: 'Impact, sans-serif' }}>
          3D PINBALL - SPACE CADET
        </span>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-2 relative">
        <canvas
          ref={canvasRef}
          width={TABLE_WIDTH}
          height={TABLE_HEIGHT}
          className="border-4 border-[#333366] rounded shadow-2xl"
        />

        {/* Start Screen Overlay */}
        {showStartScreen && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-4" style={{ fontFamily: 'Impact, sans-serif', color: '#ff6600' }}>
                🚀 SPACE CADET 🚀
              </div>
              <div className="text-2xl mb-6 text-yellow-400">3D PINBALL</div>
              
              {balls <= 0 && score > 0 && (
                <div className="mb-6">
                  <div className="text-xl text-red-500">GAME OVER</div>
                  <div className="text-lg">Final Score: {score.toLocaleString()}</div>
                  {score >= highScore && (
                    <div className="text-green-400 animate-pulse">NEW HIGH SCORE!</div>
                  )}
                </div>
              )}

              <div className="space-y-2 mb-6 text-sm">
                <div>Press <kbd className="bg-gray-700 px-2 py-1 rounded">SPACE</kbd> to launch ball</div>
                <div>Press <kbd className="bg-gray-700 px-2 py-1 rounded">Z</kbd> or <kbd className="bg-gray-700 px-2 py-1 rounded">←</kbd> for left flipper</div>
                <div>Press <kbd className="bg-gray-700 px-2 py-1 rounded">/</kbd> or <kbd className="bg-gray-700 px-2 py-1 rounded">→</kbd> for right flipper</div>
              </div>

              <button
                onClick={balls <= 0 ? resetGame : launchBall}
                className="bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                {balls <= 0 ? 'NEW GAME' : 'PLAY'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-2 py-1 flex justify-between text-xs">
        <span>Use keyboard to control flippers</span>
        <span>© Microsoft Corporation</span>
      </div>
    </div>
  );
};

export default PinballApp;
