import React, { useState, useEffect, useCallback, useMemo } from 'react';

type ScreensaverType = 'flying-windows' | '3d-pipes' | 'starfield' | 'mystify';

interface ScreensaverProps {
  idleTimeout?: number; // in milliseconds
  onDismiss?: () => void;
}

const Screensaver: React.FC<ScreensaverProps> = ({ 
  idleTimeout = 60000, // 1 minute default
  onDismiss 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [screensaverType, setScreensaverType] = useState<ScreensaverType>('starfield');
  const [lastActivity, setLastActivity] = useState(Date.now());

  const screensaverTypes: ScreensaverType[] = ['flying-windows', '3d-pipes', 'starfield', 'mystify'];

  const handleActivity = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      onDismiss?.();
      // Pick a random screensaver for next time
      setScreensaverType(screensaverTypes[Math.floor(Math.random() * screensaverTypes.length)]);
    }
    setLastActivity(Date.now());
  }, [isActive, onDismiss]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (Date.now() - lastActivity >= idleTimeout && !isActive) {
        setIsActive(true);
      }
    }, 1000);

    return () => clearInterval(checkIdle);
  }, [lastActivity, idleTimeout, isActive]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black cursor-none overflow-hidden"
      onClick={handleActivity}
      onMouseMove={handleActivity}
    >
      {screensaverType === 'flying-windows' && <FlyingWindows />}
      {screensaverType === '3d-pipes' && <Pipes3D />}
      {screensaverType === 'starfield' && <Starfield />}
      {screensaverType === 'mystify' && <Mystify />}
      
      <div className="absolute bottom-4 left-4 text-white/30 text-xs">
        Move mouse or press any key to exit
      </div>
    </div>
  );
};

// Flying Windows Logo Screensaver
const FlyingWindows: React.FC = () => {
  const logos = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 60,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
    }))
  , []);

  const [positions, setPositions] = useState(logos);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(logo => {
        let newX = logo.x + logo.speedX;
        let newY = logo.y + logo.speedY;
        let newSpeedX = logo.speedX;
        let newSpeedY = logo.speedY;

        if (newX <= 0 || newX >= 95) newSpeedX = -newSpeedX;
        if (newY <= 0 || newY >= 90) newSpeedY = -newSpeedY;

        return {
          ...logo,
          x: Math.max(0, Math.min(95, newX)),
          y: Math.max(0, Math.min(90, newY)),
          speedX: newSpeedX,
          speedY: newSpeedY,
          rotation: logo.rotation + logo.rotationSpeed,
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {positions.map(logo => (
        <div
          key={logo.id}
          className="absolute transition-none"
          style={{
            left: `${logo.x}%`,
            top: `${logo.y}%`,
            width: logo.size,
            height: logo.size,
            transform: `rotate(${logo.rotation}deg)`,
          }}
        >
          <svg viewBox="0 0 88 88" className="w-full h-full drop-shadow-lg">
            <rect x="2" y="2" width="38" height="38" fill="#F25022" rx="2" />
            <rect x="48" y="2" width="38" height="38" fill="#7FBA00" rx="2" />
            <rect x="2" y="48" width="38" height="38" fill="#00A4EF" rx="2" />
            <rect x="48" y="48" width="38" height="38" fill="#FFB900" rx="2" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// 3D Pipes Screensaver
const Pipes3D: React.FC = () => {
  const [pipes, setPipes] = useState<Array<{
    id: number;
    segments: Array<{ x: number; y: number; direction: string }>;
    color: string;
  }>>([]);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  useEffect(() => {
    const createPipe = () => {
      const startX = Math.floor(Math.random() * 20) * 5;
      const startY = Math.floor(Math.random() * 15) * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        id: Date.now() + Math.random(),
        segments: [{ x: startX, y: startY, direction: 'right' }],
        color,
      };
    };

    setPipes([createPipe()]);

    const interval = setInterval(() => {
      setPipes(prev => {
        const updated = prev.map(pipe => {
          if (pipe.segments.length > 50) return pipe;
          
          const lastSegment = pipe.segments[pipe.segments.length - 1];
          const directions = ['up', 'down', 'left', 'right'];
          const newDirection = directions[Math.floor(Math.random() * directions.length)];
          
          let newX = lastSegment.x;
          let newY = lastSegment.y;
          
          switch (newDirection) {
            case 'up': newY -= 5; break;
            case 'down': newY += 5; break;
            case 'left': newX -= 5; break;
            case 'right': newX += 5; break;
          }
          
          if (newX < 0 || newX > 100 || newY < 0 || newY > 100) {
            return pipe;
          }
          
          return {
            ...pipe,
            segments: [...pipe.segments, { x: newX, y: newY, direction: newDirection }],
          };
        });

        // Add new pipe occasionally
        if (Math.random() < 0.05 && updated.length < 5) {
          return [...updated, createPipe()];
        }

        // Remove old pipes
        if (updated.length > 3 && updated[0].segments.length > 40) {
          return [...updated.slice(1), createPipe()];
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      <svg className="w-full h-full">
        {pipes.map(pipe => (
          <g key={pipe.id}>
            {pipe.segments.map((segment, i) => {
              if (i === 0) return null;
              const prev = pipe.segments[i - 1];
              return (
                <g key={i}>
                  <line
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${segment.x}%`}
                    y2={`${segment.y}%`}
                    stroke={pipe.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))',
                    }}
                  />
                  {/* Joint balls */}
                  <circle
                    cx={`${segment.x}%`}
                    cy={`${segment.y}%`}
                    r="6"
                    fill={pipe.color}
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                    }}
                  />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
};

// Starfield Screensaver
const Starfield: React.FC = () => {
  const [stars, setStars] = useState<Array<{
    id: number;
    x: number;
    y: number;
    z: number;
    prevX: number;
    prevY: number;
  }>>([]);

  useEffect(() => {
    const createStars = () => {
      return Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000 + 100,
        prevX: 0,
        prevY: 0,
      }));
    };

    setStars(createStars());

    const interval = setInterval(() => {
      setStars(prev => prev.map(star => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const scale = 300 / star.z;
        const prevX = star.x * scale + centerX;
        const prevY = star.y * scale + centerY;
        
        let newZ = star.z - 10;
        
        if (newZ <= 0) {
          return {
            ...star,
            x: (Math.random() - 0.5) * 2000,
            y: (Math.random() - 0.5) * 2000,
            z: 1000,
            prevX,
            prevY,
          };
        }
        
        return {
          ...star,
          z: newZ,
          prevX,
          prevY,
        };
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      <svg className="w-full h-full">
        {stars.map(star => {
          const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
          const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;
          const scale = 300 / star.z;
          const x = star.x * scale + centerX;
          const y = star.y * scale + centerY;
          const size = Math.max(0.5, (1000 - star.z) / 300);
          const opacity = Math.min(1, (1000 - star.z) / 500);
          
          if (x < 0 || x > (typeof window !== 'undefined' ? window.innerWidth : 1000) || 
              y < 0 || y > (typeof window !== 'undefined' ? window.innerHeight : 600)) {
            return null;
          }
          
          return (
            <g key={star.id}>
              {star.prevX > 0 && (
                <line
                  x1={star.prevX}
                  y1={star.prevY}
                  x2={x}
                  y2={y}
                  stroke="white"
                  strokeWidth={size * 0.5}
                  opacity={opacity * 0.5}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="white"
                opacity={opacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Mystify Screensaver (bouncing lines)
const Mystify: React.FC = () => {
  const [polygons, setPolygons] = useState<Array<{
    id: number;
    points: Array<{ x: number; y: number; vx: number; vy: number }>;
    color: string;
    trail: Array<Array<{ x: number; y: number }>>;
  }>>([]);

  const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF6600'];

  useEffect(() => {
    const createPolygon = (color: string) => ({
      id: Math.random(),
      points: Array.from({ length: 4 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      })),
      color,
      trail: [] as Array<Array<{ x: number; y: number }>>,
    });

    setPolygons(colors.slice(0, 2).map(color => createPolygon(color)));

    const interval = setInterval(() => {
      setPolygons(prev => prev.map(polygon => {
        const newPoints = polygon.points.map(point => {
          let newX = point.x + point.vx;
          let newY = point.y + point.vy;
          let newVx = point.vx;
          let newVy = point.vy;

          if (newX <= 0 || newX >= 100) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(100, newY));
          }

          return { x: newX, y: newY, vx: newVx, vy: newVy };
        });

        const currentPositions = newPoints.map(p => ({ x: p.x, y: p.y }));
        const newTrail = [...polygon.trail, currentPositions].slice(-15);

        return {
          ...polygon,
          points: newPoints,
          trail: newTrail,
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      <svg className="w-full h-full">
        {polygons.map(polygon => (
          <g key={polygon.id}>
            {polygon.trail.map((positions, trailIndex) => (
              <polygon
                key={trailIndex}
                points={positions.map(p => `${p.x}%,${p.y}%`).join(' ')}
                fill="none"
                stroke={polygon.color}
                strokeWidth="1"
                opacity={(trailIndex + 1) / polygon.trail.length * 0.6}
              />
            ))}
            <polygon
              points={polygon.points.map(p => `${p.x}%,${p.y}%`).join(' ')}
              fill="none"
              stroke={polygon.color}
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Screensaver;
