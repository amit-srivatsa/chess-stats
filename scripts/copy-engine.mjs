// Copies the lite single-threaded Stockfish 19 build (GPL-3.0) from npm into
// public/engine so Vite serves it as a static Web Worker. Runs before dev and build.
import { copyFileSync, mkdirSync } from 'node:fs';

const src = 'node_modules/stockfish/bin';
const dest = 'public/engine';
mkdirSync(dest, { recursive: true });
for (const f of ['stockfish-19-lite-single.js', 'stockfish-19-lite-single.wasm']) {
  copyFileSync(`${src}/${f}`, `${dest}/${f}`);
}
console.log('Stockfish lite single copied to public/engine');
