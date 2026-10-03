import React from 'react';

// Filled glyphs for both sides, coloured by CSS. \uFE0E stops the pawn rendering as an emoji.
const FILLED: Record<string, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const glyph = (p: string) => (p ? `${FILLED[p.toLowerCase()]}\uFE0E` : '');

/** A dependency-free board from a FEN, seen from the player's side. */
const MiniBoard: React.FC<{ fen: string; flipped?: boolean }> = ({ fen, flipped }) => {
  const rows = fen.split(' ')[0].split('/').map((row) =>
    row.split('').flatMap((ch) => (/\d/.test(ch) ? Array(Number(ch)).fill('') : [ch])),
  );
  const ranks = flipped ? [...rows].reverse().map((r) => [...r].reverse()) : rows;
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full max-w-[320px] aspect-square rounded-xl overflow-hidden border border-gray-200">
      {ranks.flatMap((row, r) =>
        row.map((piece, c) => (
          <div
            key={`${r}-${c}`}
            className={`flex items-center justify-center text-[28px] leading-none select-none ${(r + c) % 2 ? 'bg-violet-300' : 'bg-violet-50'}`}
            style={{ color: piece && piece === piece.toUpperCase() ? '#fff' : '#111827', textShadow: piece && piece === piece.toUpperCase() ? '0 0 2px #111827, 0 0 1px #111827' : 'none' }}
          >
            {glyph(piece)}
          </div>
        )),
      )}
    </div>
  );
};

export default MiniBoard;
