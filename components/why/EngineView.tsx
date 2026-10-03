import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine } from 'recharts';
import { Cpu, Loader2 } from 'lucide-react';
import Card from './Card';
import MiniBoard from './MiniBoard';
import { GameRecord, plies } from '../../lib/games';
import { Engine } from '../../lib/engine';
import { cacheGet, cacheSet } from '../../lib/cache';
import { evalSeries, findTurningPoint } from '../../lib/turningPoint';

const DEPTH = 12;

interface CachedEval {
  evals: number[];
  best: (string | null)[];
  ms: number;
}

const r0 = (n: number) => Math.round(n);

/** Stretch goal: run lite Stockfish on one chosen loss and find the move where it turned. */
const EngineView: React.FC<{ records: GameRecord[] }> = ({ records }) => {
  const losses = useMemo(() => records.filter((r) => r.outcome === 'loss').slice(0, 30), [records]);
  const [selected, setSelected] = useState<string>(losses[0]?.id ?? '');
  const [result, setResult] = useState<CachedEval | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const runId = useRef(0);

  const game = losses.find((g) => g.id === selected) ?? losses[0];
  const moves = useMemo(() => (game ? plies(game.pgn) : []), [game]);

  useEffect(() => () => engineRef.current?.terminate(), []);

  // Show a cached analysis straight away when switching games.
  useEffect(() => {
    setResult(null);
    setProgress(null);
    runId.current++;
    if (game) cacheGet<CachedEval>(`eval/${game.id}/${DEPTH}`).then((c) => c && setResult(c));
  }, [game]);

  const analyse = async () => {
    if (!game) return;
    const id = ++runId.current;
    engineRef.current ??= new Engine();
    const engine = engineRef.current;
    const fens = [moves[0]?.fenBefore, ...moves.map((m) => m.fenAfter)].filter(Boolean) as string[];
    await engine.newGame();
    const evals: number[] = [];
    const best: (string | null)[] = [];
    const t0 = performance.now();
    setProgress({ done: 0, total: fens.length });
    for (let i = 0; i < fens.length; i++) {
      const e = await engine.evaluate(fens[i], DEPTH);
      if (id !== runId.current) return; // user switched games
      evals.push(e.cp);
      best.push(e.best);
      setProgress({ done: i + 1, total: fens.length });
    }
    const out = { evals, best, ms: r0(performance.now() - t0) };
    await cacheSet(`eval/${game.id}/${DEPTH}`, out);
    setResult(out);
    setProgress(null);
  };

  const series = result && game ? evalSeries(result.evals, game.colour) : [];
  const turn = result && game ? findTurningPoint(series, moves, game.colour, result.best) : null;

  if (!losses.length) return null;

  return (
    <Card title="Where one loss turned" note="Stockfish 19 lite, in your browser">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-5">
        <select
          value={game?.id ?? ''}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700"
        >
          {losses.map((g) => (
            <option key={g.id} value={g.id}>
              {g.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {g.timeClass} · vs {g.oppName} ({g.oppRating}) · {g.opening} · {g.moveCount} moves
            </option>
          ))}
        </select>
        <button
          onClick={analyse}
          disabled={!!progress}
          className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl disabled:opacity-60"
        >
          {progress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
          {progress ? `Analysing ${progress.done} of ${progress.total}` : result ? 'Analyse again' : 'Find the turning point'}
        </button>
      </div>

      {progress && (
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-5">
          <div className="h-full bg-violet-500 transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
        </div>
      )}

      {result && game && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ left: -16, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="winFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="ply"
                    type="number"
                    domain={[0, series.length - 1]}
                    ticks={series.filter((p) => p.ply % 10 === 1).map((p) => p.ply)}
                    tickFormatter={(p: number) => `move ${Math.ceil(p / 2)}`}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                  />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <ReferenceLine y={50} stroke="#e5e7eb" />
                  <Tooltip
                    formatter={(v: number) => [`${r0(v)}%`, 'Your win chance']}
                    labelFormatter={(p: number) => (p === 0 ? 'Start' : `Move ${Math.ceil(p / 2)}${p % 2 ? '' : '...'} ${moves[p - 1]?.san ?? ''}`)}
                  />
                  <Area type="monotone" dataKey="myWin" stroke="#7c3aed" strokeWidth={2} fill="url(#winFill)" isAnimationActive={false} />
                  {turn && <ReferenceDot x={turn.ply} y={turn.after} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Your win chance after every move ({result.evals.length} positions, depth {DEPTH}, {(result.ms / 1000).toFixed(1)} s in total). Red dot: the turning point.
            </p>
          </div>
          {turn && (
            <div className="flex flex-col gap-3">
              <MiniBoard fen={turn.fenBefore} flipped={game.colour === 'black'} />
              <div className="text-sm">
                <div className="font-semibold text-gray-900">
                  You played {turn.moveLabel}: {r0(turn.before)}% to {r0(turn.after)}%
                </div>
                {turn.bestSan && <div className="text-gray-500 mt-1">The engine preferred {turn.bestSan}.</div>}
                <a href={game.url} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline mt-2 inline-block">
                  Open the game on Chess.com
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !progress && (
        <p className="text-sm text-gray-500">
          Pick one of your last {losses.length} losses. The engine runs on your device, one position at a time; nothing is uploaded.
        </p>
      )}
    </Card>
  );
};

export default EngineView;
