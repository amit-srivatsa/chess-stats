import React from 'react';

// Violet board to match the page (Tailwind violet-50 / violet-300), with the classic
// cburnett piece set (Colin M.L. Burnett, GPLv2+) from public/pieces.
const LIGHT = '#f5f3ff';
const DARK = '#c4b5fd';

const pieceSrc = (p: string) =>
  `${import.meta.env.BASE_URL}pieces/cburnett/${p === p.toUpperCase() ? 'w' : 'b'}${p.toUpperCase()}.svg`;

/** A dependency-free board from a FEN, seen from the player's side. */
const MiniBoard: React.FC<{ fen: string; flipped?: boolean }> = ({ fen, flipped }) => {
  const rows = fen.split(' ')[0].split('/').map((row) =>
    row.split('').flatMap((ch) => (/\d/.test(ch) ? Array(Number(ch)).fill('') : [ch])),
  );
  const ranks = flipped ? [...rows].reverse().map((r) => [...r].reverse()) : rows;
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full max-w-[320px] aspect-square rounded-xl overflow-hidden border border-gray-200">
      {ranks.flatMap((row, r) =>
        row.map((piece, c) => {
          const dark = (r + c) % 2 === 1;
          return (
            <div key={`${r}-${c}`} className="relative" style={{ background: dark ? DARK : LIGHT }}>
              {piece && <img src={pieceSrc(piece)} alt={piece} className="absolute inset-0 w-full h-full select-none" draggable={false} />}
            </div>
          );
        }),
      )}
    </div>
  );
};

export default MiniBoard;
