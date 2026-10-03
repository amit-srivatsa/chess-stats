import { Chess } from 'chess.js';
import { Colour, PlyInfo } from './games';
import { winPercent } from './engine';

export interface EvalPoint {
  ply: number; // 0 = start position
  myWin: number; // my win chance after this ply, 0 to 100
}

export interface TurningPoint {
  ply: number;
  moveLabel: string; // "23... Qxb2"
  before: number; // my win chance before the move
  after: number; // and after it
  bestSan: string | null;
  fenBefore: string;
}

/** evals[i] is the engine eval (White POV cp) of the position after ply i (evals[0] = start). */
export function evalSeries(evals: number[], colour: Colour): EvalPoint[] {
  return evals.map((cp, ply) => ({ ply, myWin: winPercent(colour === 'white' ? cp : -cp) }));
}

function uciToSan(fen: string, uci: string | null): string | null {
  if (!uci) return null;
  try {
    const c = new Chess(fen);
    const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    return m?.san ?? null;
  } catch {
    return null;
  }
}

/** Below this win chance the game is already gone, so a later drop is not the turning point. */
const STILL_ALIVE = 25;

/**
 * The move of mine that dropped my win chance the most while the game was
 * still alive. Falls back to the biggest drop anywhere if every move of mine
 * came from an already lost position.
 */
export function findTurningPoint(
  series: EvalPoint[],
  moves: PlyInfo[],
  colour: Colour,
  bestMoves: (string | null)[], // engine best move in the position before each ply (index = ply - 1)
): TurningPoint | null {
  return (
    biggestDrop(series, moves, colour, bestMoves, STILL_ALIVE) ??
    biggestDrop(series, moves, colour, bestMoves, 0)
  );
}

function biggestDrop(
  series: EvalPoint[],
  moves: PlyInfo[],
  colour: Colour,
  bestMoves: (string | null)[],
  minBefore: number,
): TurningPoint | null {
  let best: TurningPoint | null = null;
  for (const m of moves) {
    const mine = (m.ply % 2 === 1) === (colour === 'white');
    if (!mine || !series[m.ply]) continue;
    const before = series[m.ply - 1].myWin;
    if (before < minBefore) continue;
    const after = series[m.ply].myWin;
    if (!best || before - after > best.before - best.after) {
      const moveNo = Math.ceil(m.ply / 2);
      best = {
        ply: m.ply,
        moveLabel: `${moveNo}${m.ply % 2 === 1 ? '.' : '...'} ${m.san}`,
        before,
        after,
        bestSan: uciToSan(m.fenBefore, bestMoves[m.ply - 1]),
        fenBefore: m.fenBefore,
      };
    }
  }
  return best;
}
