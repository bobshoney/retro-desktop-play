import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Undo } from 'lucide-react';

// Card types
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Color = 'red' | 'black';

interface Card {
  suit: Suit;
  value: number; // 1-13 (Ace to King)
  faceUp: boolean;
  id: string;
}

interface DragState {
  cards: Card[];
  sourceType: 'tableau' | 'waste' | 'foundation';
  sourceIndex: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const getColor = (suit: Suit): Color => {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
};

const getValueDisplay = (value: number): string => {
  if (value === 1) return 'A';
  if (value === 11) return 'J';
  if (value === 12) return 'Q';
  if (value === 13) return 'K';
  return value.toString();
};

const getSuitSymbol = (suit: Suit): string => {
  const symbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
  return symbols[suit];
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, faceUp: false, id: `${suit}-${value}` });
    }
  }
  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const SolitaireApp: React.FC = () => {
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [winAnimationCards, setWinAnimationCards] = useState<{ card: Card; x: number; y: number; vx: number; vy: number }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);

  // Initialize game
  const initGame = useCallback(() => {
    const deck = shuffleDeck(createDeck());
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    let cardIndex = 0;

    // Deal cards to tableau
    for (let col = 0; col < 7; col++) {
      for (let row = col; row < 7; row++) {
        const card = { ...deck[cardIndex], faceUp: row === col };
        newTableau[row].push(card);
        cardIndex++;
      }
    }

    // Remaining cards go to stock
    const remainingCards = deck.slice(cardIndex).map(c => ({ ...c, faceUp: false }));

    setTableau(newTableau);
    setFoundations([[], [], [], []]);
    setStock(remainingCards);
    setWaste([]);
    setGameWon(false);
    setWinAnimationCards([]);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check for win
  useEffect(() => {
    const totalInFoundations = foundations.reduce((sum, f) => sum + f.length, 0);
    if (totalInFoundations === 52 && !gameWon) {
      setGameWon(true);
      startWinAnimation();
    }
  }, [foundations, gameWon]);

  const startWinAnimation = () => {
    const allCards: { card: Card; x: number; y: number; vx: number; vy: number }[] = [];
    foundations.forEach((foundation, fIndex) => {
      foundation.forEach((card, cIndex) => {
        allCards.push({
          card,
          x: 280 + fIndex * 85,
          y: 10,
          vx: (Math.random() - 0.5) * 8,
          vy: -Math.random() * 5 - 2,
        });
      });
    });
    setWinAnimationCards(allCards);
  };

  // Animate win cards
  useEffect(() => {
    if (winAnimationCards.length === 0) return;

    const interval = setInterval(() => {
      setWinAnimationCards(prev => {
        const updated = prev.map(c => ({
          ...c,
          x: c.x + c.vx,
          y: c.y + c.vy,
          vy: c.vy + 0.3, // gravity
        })).filter(c => c.y < 500);
        
        if (updated.length === 0) {
          clearInterval(interval);
        }
        return updated;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [winAnimationCards.length > 0]);

  // Draw from stock
  const drawFromStock = () => {
    if (stock.length === 0) {
      // Reset stock from waste
      setStock(waste.map(c => ({ ...c, faceUp: false })).reverse());
      setWaste([]);
    } else {
      const card = { ...stock[stock.length - 1], faceUp: true };
      setStock(prev => prev.slice(0, -1));
      setWaste(prev => [...prev, card]);
    }
  };

  // Check if card can be placed on tableau pile
  const canPlaceOnTableau = (card: Card, pile: Card[]): boolean => {
    if (pile.length === 0) {
      return card.value === 13; // Only Kings on empty piles
    }
    const topCard = pile[pile.length - 1];
    return topCard.faceUp && 
           getColor(card.suit) !== getColor(topCard.suit) && 
           card.value === topCard.value - 1;
  };

  // Check if card can be placed on foundation
  const canPlaceOnFoundation = (card: Card, foundation: Card[]): boolean => {
    if (foundation.length === 0) {
      return card.value === 1; // Only Aces on empty foundations
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && card.value === topCard.value + 1;
  };

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent, cards: Card[], sourceType: 'tableau' | 'waste' | 'foundation', sourceIndex: number) => {
    if (cards.length === 0 || !cards[0].faceUp) return;
    e.preventDefault();
    
    const rect = gameRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      cards,
      sourceType,
      sourceIndex,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState || !gameRef.current) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    setDragState(prev => prev ? {
      ...prev,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top,
    } : null);
  }, [dragState]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!dragState || !gameRef.current) {
      setDragState(null);
      return;
    }

    const rect = gameRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    // Check drop on foundations
    for (let i = 0; i < 4; i++) {
      const fx = 280 + i * 85;
      const fy = 10;
      if (dropX >= fx && dropX <= fx + 70 && dropY >= fy && dropY <= fy + 96) {
        if (dragState.cards.length === 1 && canPlaceOnFoundation(dragState.cards[0], foundations[i])) {
          // Move to foundation
          const newFoundations = [...foundations];
          newFoundations[i] = [...newFoundations[i], dragState.cards[0]];
          setFoundations(newFoundations);
          removeFromSource();
          setDragState(null);
          return;
        }
      }
    }

    // Check drop on tableau
    for (let i = 0; i < 7; i++) {
      const tx = 10 + i * 85;
      const ty = 120;
      const pileHeight = Math.max(96, tableau[i].length * 20 + 76);
      
      if (dropX >= tx && dropX <= tx + 70 && dropY >= ty && dropY <= ty + pileHeight) {
        if (canPlaceOnTableau(dragState.cards[0], tableau[i])) {
          // Move to tableau
          const newTableau = [...tableau];
          newTableau[i] = [...newTableau[i], ...dragState.cards];
          setTableau(newTableau);
          removeFromSource();
          setDragState(null);
          return;
        }
      }
    }

    setDragState(null);
  }, [dragState, tableau, foundations]);

  const removeFromSource = () => {
    if (!dragState) return;

    if (dragState.sourceType === 'waste') {
      setWaste(prev => prev.slice(0, -1));
    } else if (dragState.sourceType === 'tableau') {
      setTableau(prev => {
        const newTableau = [...prev];
        const pile = [...newTableau[dragState.sourceIndex]];
        pile.splice(pile.length - dragState.cards.length, dragState.cards.length);
        // Flip top card if face down
        if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
          pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true };
        }
        newTableau[dragState.sourceIndex] = pile;
        return newTableau;
      });
    } else if (dragState.sourceType === 'foundation') {
      setFoundations(prev => {
        const newFoundations = [...prev];
        newFoundations[dragState.sourceIndex] = newFoundations[dragState.sourceIndex].slice(0, -1);
        return newFoundations;
      });
    }
  };

  // Auto-move to foundation on double click
  const handleDoubleClick = (card: Card, sourceType: 'tableau' | 'waste', sourceIndex: number) => {
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(card, foundations[i])) {
        const newFoundations = [...foundations];
        newFoundations[i] = [...newFoundations[i], card];
        setFoundations(newFoundations);

        if (sourceType === 'waste') {
          setWaste(prev => prev.slice(0, -1));
        } else {
          setTableau(prev => {
            const newTableau = [...prev];
            const pile = [...newTableau[sourceIndex]];
            pile.pop();
            if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
              pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true };
            }
            newTableau[sourceIndex] = pile;
            return newTableau;
          });
        }
        return;
      }
    }
  };

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  // Render a card
  const renderCard = (card: Card, onClick?: () => void, onMouseDown?: (e: React.MouseEvent) => void, onDoubleClick?: () => void, style?: React.CSSProperties, isDragging?: boolean) => {
    if (!card.faceUp) {
      return (
        <div
          className="w-[70px] h-[96px] rounded-lg border-2 border-white/50 cursor-pointer select-none"
          style={{
            background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%)',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            ...style,
          }}
          onClick={onClick}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-16 border border-white/30 rounded bg-gradient-to-br from-blue-800 to-blue-950" />
          </div>
        </div>
      );
    }

    const color = getColor(card.suit);
    return (
      <div
        className={`w-[70px] h-[96px] bg-white rounded-lg border border-gray-300 cursor-grab select-none ${isDragging ? 'shadow-xl' : 'shadow-md'}`}
        style={{
          boxShadow: isDragging ? '4px 4px 12px rgba(0,0,0,0.4)' : '2px 2px 4px rgba(0,0,0,0.2)',
          ...style,
        }}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
      >
        <div className={`h-full p-1 flex flex-col justify-between ${color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>
          <div className="text-xs font-bold leading-none">
            {getValueDisplay(card.value)}
            <div className="text-sm">{getSuitSymbol(card.suit)}</div>
          </div>
          <div className="text-2xl text-center">{getSuitSymbol(card.suit)}</div>
          <div className="text-xs font-bold leading-none text-right rotate-180">
            {getValueDisplay(card.value)}
            <div className="text-sm">{getSuitSymbol(card.suit)}</div>
          </div>
        </div>
      </div>
    );
  };

  // Empty pile placeholder
  const renderEmptyPile = (type: 'foundation' | 'tableau') => (
    <div
      className="w-[70px] h-[96px] rounded-lg border-2 border-dashed border-white/30"
      style={{
        background: type === 'foundation' ? 'rgba(255,255,255,0.1)' : 'transparent',
      }}
    />
  );

  return (
    <div
      ref={gameRef}
      className="h-full relative overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #1a5f2a 0%, #0d3d15 100%)',
        backgroundImage: `
          radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")
        `,
      }}
    >
      {/* Menu bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-[#ece9d8] text-xs border-b border-gray-400">
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Game</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-1 cursor-pointer">Help</span>
        <div className="flex-1" />
        <button
          onClick={initGame}
          className="flex items-center gap-1 px-2 py-0.5 hover:bg-gray-200 rounded"
        >
          <RotateCcw className="w-3 h-3" />
          New Game
        </button>
      </div>

      {/* Game area */}
      <div className="p-2">
        {/* Top row: Stock, Waste, and Foundations */}
        <div className="flex gap-4 mb-4">
          {/* Stock */}
          <div className="relative">
            {stock.length > 0 ? (
              <div onClick={drawFromStock}>
                {renderCard(stock[stock.length - 1])}
              </div>
            ) : (
              <div
                className="w-[70px] h-[96px] rounded-lg border-2 border-dashed border-white/40 flex items-center justify-center cursor-pointer"
                onClick={drawFromStock}
              >
                <RotateCcw className="w-6 h-6 text-white/50" />
              </div>
            )}
          </div>

          {/* Waste */}
          <div className="relative w-[70px] h-[96px]">
            {waste.length > 0 ? (
              renderCard(
                waste[waste.length - 1],
                undefined,
                (e) => handleMouseDown(e, [waste[waste.length - 1]], 'waste', 0),
                () => handleDoubleClick(waste[waste.length - 1], 'waste', 0)
              )
            ) : (
              renderEmptyPile('tableau')
            )}
          </div>

          <div className="w-[70px]" /> {/* Spacer */}

          {/* Foundations */}
          {foundations.map((foundation, i) => (
            <div key={i} className="relative">
              {foundation.length > 0 ? (
                renderCard(
                  foundation[foundation.length - 1],
                  undefined,
                  (e) => handleMouseDown(e, [foundation[foundation.length - 1]], 'foundation', i)
                )
              ) : (
                renderEmptyPile('foundation')
              )}
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="flex gap-[15px]">
          {tableau.map((pile, pileIndex) => (
            <div key={pileIndex} className="relative w-[70px]" style={{ minHeight: '200px' }}>
              {pile.length === 0 ? (
                renderEmptyPile('tableau')
              ) : (
                pile.map((card, cardIndex) => {
                  const isTopCard = cardIndex === pile.length - 1;
                  const cardsFromHere = pile.slice(cardIndex);
                  const canDrag = card.faceUp;

                  return (
                    <div
                      key={card.id}
                      className="absolute"
                      style={{ top: cardIndex * 20, zIndex: cardIndex }}
                    >
                      {renderCard(
                        card,
                        undefined,
                        canDrag ? (e) => handleMouseDown(e, cardsFromHere, 'tableau', pileIndex) : undefined,
                        isTopCard && card.faceUp ? () => handleDoubleClick(card, 'tableau', pileIndex) : undefined
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dragging cards */}
      {dragState && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: dragState.currentX - 35,
            top: dragState.currentY - 20,
            zIndex: 1000,
          }}
        >
          {dragState.cards.map((card, i) => (
            <div key={card.id} style={{ position: 'absolute', top: i * 20 }}>
              {renderCard(card, undefined, undefined, undefined, undefined, true)}
            </div>
          ))}
        </div>
      )}

      {/* Win animation */}
      {winAnimationCards.map((c, i) => (
        <div
          key={`win-${c.card.id}-${i}`}
          className="absolute pointer-events-none"
          style={{ left: c.x, top: c.y, zIndex: 2000 }}
        >
          {renderCard(c.card)}
        </div>
      ))}

      {/* Win message */}
      {gameWon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-[3000]">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 You Win! 🎉</h2>
            <p className="text-gray-600 mb-4">Congratulations! You've won Solitaire!</p>
            <button
              onClick={initGame}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolitaireApp;