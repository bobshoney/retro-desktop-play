import React, { useState, useCallback } from 'react';
import { Smile, Frown, Meh } from 'lucide-react';

type CellState = 'hidden' | 'revealed' | 'flagged';
type GameState = 'playing' | 'won' | 'lost';

interface Cell {
  isMine: boolean;
  neighborCount: number;
  state: CellState;
}

const GRID_SIZE = 9;
const MINE_COUNT = 10;

const createBoard = (): Cell[][] => {
  const board: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      isMine: false,
      neighborCount: 0,
      state: 'hidden' as CellState,
    }))
  );

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor counts
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && board[nr][nc].isMine) {
              count++;
            }
          }
        }
        board[r][c].neighborCount = count;
      }
    }
  }

  return board;
};

const MinesweeperApp: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);

  const revealCell = useCallback((row: number, col: number, currentBoard: Cell[][]): Cell[][] => {
    const newBoard = currentBoard.map(r => r.map(c => ({ ...c })));
    
    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return;
      if (newBoard[r][c].state !== 'hidden') return;
      
      newBoard[r][c].state = 'revealed';
      
      if (newBoard[r][c].neighborCount === 0 && !newBoard[r][c].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc);
          }
        }
      }
    };
    
    reveal(row, col);
    return newBoard;
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    if (board[row][col].state !== 'hidden') return;

    if (board[row][col].isMine) {
      // Game over - reveal all mines
      const newBoard = board.map(r => r.map(c => ({
        ...c,
        state: c.isMine ? 'revealed' as CellState : c.state
      })));
      setBoard(newBoard);
      setGameState('lost');
      return;
    }

    const newBoard = revealCell(row, col, board);
    setBoard(newBoard);

    // Check win condition
    const hiddenNonMines = newBoard.flat().filter(c => c.state === 'hidden' && !c.isMine);
    if (hiddenNonMines.length === 0) {
      setGameState('won');
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    if (board[row][col].state === 'revealed') return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    if (newBoard[row][col].state === 'hidden') {
      newBoard[row][col].state = 'flagged';
      setMinesLeft(m => m - 1);
    } else {
      newBoard[row][col].state = 'hidden';
      setMinesLeft(m => m + 1);
    }
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(createBoard());
    setGameState('playing');
    setMinesLeft(MINE_COUNT);
  };

  const getNumberColor = (num: number): string => {
    const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-800', 'text-red-800', 'text-cyan-600', 'text-black', 'text-gray-600'];
    return colors[num] || '';
  };

  const FaceIcon = gameState === 'won' ? Smile : gameState === 'lost' ? Frown : Meh;

  return (
    <div className="p-2 bg-[#c0c0c0] h-full flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-[200px] bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 p-1 mb-2">
        <div className="bg-black text-red-500 font-mono px-2 py-1 text-lg">
          {String(minesLeft).padStart(3, '0')}
        </div>
        <button 
          onClick={resetGame}
          className="w-8 h-8 flex items-center justify-center bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white"
        >
          <FaceIcon className={`w-5 h-5 ${gameState === 'won' ? 'text-yellow-500' : gameState === 'lost' ? 'text-yellow-600' : 'text-yellow-400'}`} />
        </button>
        <div className="bg-black text-red-500 font-mono px-2 py-1 text-lg">
          000
        </div>
      </div>

      {/* Grid */}
      <div className="border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white p-0.5 bg-[#c0c0c0]">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                className={`w-5 h-5 text-xs font-bold flex items-center justify-center
                  ${cell.state === 'hidden' || cell.state === 'flagged'
                    ? 'bg-[#c0c0c0] border border-t-white border-l-white border-b-gray-600 border-r-gray-600 active:border-gray-400'
                    : 'bg-[#c0c0c0] border border-gray-400'
                  }
                  ${getNumberColor(cell.neighborCount)}
                `}
              >
                {cell.state === 'flagged' && '🚩'}
                {cell.state === 'revealed' && cell.isMine && '💣'}
                {cell.state === 'revealed' && !cell.isMine && cell.neighborCount > 0 && cell.neighborCount}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Status */}
      {gameState !== 'playing' && (
        <div className={`mt-2 text-sm font-bold ${gameState === 'won' ? 'text-green-600' : 'text-red-600'}`}>
          {gameState === 'won' ? '🎉 You Win!' : '💥 Game Over!'}
        </div>
      )}
    </div>
  );
};

export default MinesweeperApp;
