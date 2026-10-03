import React from 'react';

export type PieceName = 
  | 'wood_knight' 
  | 'wood_king' 
  | 'wood_queen' 
  | 'wood_rook' 
  | 'wood_pawn' 
  | 'wood_bishop'
  | 'black_knight' 
  | 'black_king'
  | 'black_queen'
  | 'black_rook'
  | 'black_bishop'
  | 'black_pawn';

interface AnimatedPieceProps {
  piece: PieceName;
  size?: number;
  alt?: string;
  className?: string;
  floatVariant?: 'default' | 'alt';
  showShadow?: boolean;
}

export const AnimatedPiece: React.FC<AnimatedPieceProps> = ({
  piece,
  size = 96,
  alt = 'Chess Piece',
  className = '',
  floatVariant = 'default',
  showShadow = true,
}) => {
  const floatClass = floatVariant === 'alt' ? 'animate-piece-float-alt' : 'animate-piece-float';

  return (
    <div 
      className={`relative inline-flex flex-col items-center justify-center select-none group pointer-events-auto ${className}`}
      style={{ width: size, height: showShadow ? size * 1.35 : size * 1.4 }}
    >
      {/* Floating Piece Image */}
      <div className={`relative z-10 w-full h-full flex items-center justify-center ${floatClass} transition-transform duration-300 ease-out group-hover:scale-105`}>
        <img
          src={`./assets/pieces/${piece}.png`}
          alt={alt}
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          loading="eager"
        />
      </div>

      {/* Subtle Breathing Ground Contact Shadow */}
      {showShadow && (
        <div className="absolute bottom-1 w-3/4 h-3 z-0 animate-piece-shadow flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
            <ellipse 
              cx="50" 
              cy="12" 
              rx="42" 
              ry="7" 
              fill="rgba(23, 25, 28, 0.09)" 
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AnimatedPiece;
