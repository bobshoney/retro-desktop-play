import React, { useState, useRef, useEffect } from 'react';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
];

const PaintApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCanvasCoords(e);
    setLastPos(coords);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const coords = getCanvasCoords(e);
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    setLastPos(coords);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#c0c0c0]">
      {/* Menu Bar */}
      <div className="flex gap-4 px-2 py-1 bg-[#c0c0c0] text-xs border-b border-gray-400">
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Image</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Colors</span>
        <span className="hover:bg-blue-600 hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tool sidebar */}
        <div className="w-12 bg-[#c0c0c0] p-1 border-r border-gray-400 flex flex-col gap-1">
          <button onClick={clearCanvas} className="xp-button text-xs p-1" title="Clear">🗑️</button>
          <div className="mt-2">
            <label className="text-xs">Size</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-2 overflow-auto bg-gray-600">
          <canvas
            ref={canvasRef}
            width={500}
            height={350}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair bg-white border border-gray-400"
          />
        </div>
      </div>

      {/* Color Palette */}
      <div className="flex items-center gap-2 p-1 bg-[#c0c0c0] border-t border-gray-400">
        <div 
          className="w-8 h-8 border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-wrap gap-0.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-4 h-4 border ${color === c ? 'border-black' : 'border-gray-400'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaintApp;
