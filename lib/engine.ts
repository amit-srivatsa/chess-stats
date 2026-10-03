// Thin promise wrapper around the Stockfish Web Worker (lite, single-threaded).
// The worker script itself is the engine; we only speak UCI to it.

export interface EngineEval {
  cp: number; // centipawns from White's point of view (mate mapped to +-1000)
  best: string | null; // best move in UCI notation, for the side to move
}

const MATE_CP = 1000;

export class Engine {
  private worker: Worker;
  private ready: Promise<void>;

  constructor() {
    const base = import.meta.env.BASE_URL ?? '/';
    this.worker = new Worker(`${base}engine/stockfish-19-lite-single.js`);
    this.ready = this.waitFor('uciok', 'uci')
      .then(() => this.waitFor('readyok', 'isready'))
      .then(() => undefined);
  }

  private waitFor(token: string, send?: string, onLine?: (l: string) => void): Promise<string> {
    return new Promise((resolve) => {
      const handler = (e: MessageEvent) => {
        const line = String(e.data);
        onLine?.(line);
        if (line.startsWith(token)) {
          this.worker.removeEventListener('message', handler);
          resolve(line);
        }
      };
      this.worker.addEventListener('message', handler);
      if (send) this.worker.postMessage(send);
    });
  }

  /** Clear the hash table so a fixed-depth analysis gives the same answer every run. */
  async newGame(): Promise<void> {
    await this.ready;
    this.worker.postMessage('ucinewgame');
    await this.waitFor('readyok', 'isready');
  }

  /** Evaluate one position to a fixed depth (single thread, so the result is repeatable). */
  async evaluate(fen: string, depth = 12): Promise<EngineEval> {
    await this.ready;
    const whiteToMove = fen.split(' ')[1] === 'w';
    let score = 0;
    this.worker.postMessage(`position fen ${fen}`);
    const bestLine = await this.waitFor('bestmove', `go depth ${depth}`, (line) => {
      const cp = line.match(/score cp (-?\d+)/);
      const mate = line.match(/score mate (-?\d+)/);
      if (cp) score = Number(cp[1]);
      else if (mate) score = Number(mate[1]) > 0 ? MATE_CP : -MATE_CP;
    });
    const best = bestLine.split(' ')[1];
    return {
      cp: whiteToMove ? score : -score,
      best: best && best !== '(none)' ? best : null,
    };
  }

  terminate() {
    this.worker.terminate();
  }
}

/**
 * Lichess win-chance formula (lila ui/lib/src/ceval/winningChances.ts), with
 * its clamp to +-1000 cp, rescaled from -1..1 to a 0 to 100 win percentage.
 * Lichess calls a drop of 0.1 / 0.2 / 0.3 (5 / 10 / 15 points here) an
 * inaccuracy / mistake / blunder.
 */
export function winPercent(cp: number): number {
  const c = Math.min(Math.max(-1000, cp), 1000);
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * c)) - 1);
}
