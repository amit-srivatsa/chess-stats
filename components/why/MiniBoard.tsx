import React from 'react';

// Classic wood board colours, with the cburnett piece set (Colin M.L. Burnett, GPLv2+) from public/pieces.
const LIGHT = '#f0d9b5';
const DARK = '#b58863';
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const pieceSrc = (p: string) =>
  `${import.meta.env.BASE_URL}pieces/cburnett/${p === p.toUpperCase() ? 'w' : 'b'}${p.toUpperCase()}.svg`;

/** A dependency-free board from a FEN, seen from the player's side. */
const MiniBoard: React.FC<{ fen: string; flipped?: boolean }> = ({ fen, flipped }) => {
  const rows = fen.split(' ')[0].split('/').map((row) =>
    row.split('').flatMap((ch) => (/\d/.test(ch) ? Array(Number(ch)).fill('') : [ch])),
  );
  const ranks = flipped ? [...rows].reverse().map((r) => [...r].reverse()) : rows;
  const files = flipped ? [...FILES].reverse() : FILES;
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full max-w-[320px] aspect-square rounded-md overflow-hidden shadow-md">
      {ranks.flatMap((row, r) =>
        row.map((piece, c) => {
          const dark = (r + c) % 2 === 1;
          const rank = flipped ? r + 1 : 8 - r;
          return (
            <div key={`${r}-${c}`} className="relative" style={{ background: dark ? DARK : LIGHT }}>
              {piece && <img src={pieceSrc(piece)} alt={piece} className="absolute inset-0 w-full h-full select-none" draggable={false} />}
              {c === 0 && (
                <span className="absolute top-0.5 left-1 text-[10px] font-semibold leading-none" style={{ color: dark ? LIGHT : DARK }}>
                  {rank}
                </span>
              )}
              {r === 7 && (
                <span className="absolute bottom-0.5 right-1 text-[10px] font-semibold leading-none" style={{ color: dark ? LIGHT : DARK }}>
                  {files[c]}
                </span>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
};

export default MiniBoard;
