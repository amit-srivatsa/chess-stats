import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { AlertCircle, Download, Info, Loader2, Target } from 'lucide-react';
import { getGamesBackwards, LoadProgress } from '../../services/chessApi';
import { GameRecord, toRecords } from '../../lib/games';
import { tally, MIN_GAMES_FOR_VERDICT } from '../../lib/stats';
import { verdict as buildVerdict } from '../../lib/headline';
import { LossEndings, OpeningTable, ClockCard, TimeOfDay, TiltCard, RatingGapCard } from './Sections';
import VerdictCard from './VerdictCard';
import EngineView from './EngineView';
import AnimatedPiece from '../AnimatedPiece';

const SIZES = [50, 100, 300] as const;

function readSize(): number {
  try {
    const n = Number(localStorage.getItem('why_sample_size'));
    return (SIZES as readonly number[]).includes(n) ? n : 100;
  } catch {
    return 100;
  }
}

const fmtMonth = (d: Date) => d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

const WhyILose: React.FC<{ username: string }> = ({ username }) => {
  const [size, setSize] = useState<number>(readSize);
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username || !username.trim()) {
      setRecords([]);
      setLoading(false);
      setError(null);
      setProgress(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProgress(null);
    getGamesBackwards(username, size, (p) => !cancelled && setProgress(p))
      .then((games) => !cancelled && setRecords(toRecords(games, username)))
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [username, size]);

  const changeSize = (n: number) => {
    setSize(n);
    try {
      localStorage.setItem('why_sample_size', String(n));
    } catch {
      /* storage blocked: keep it in memory only */
    }
  };

  const overall = useMemo(() => tally(records), [records]);
  const verdict = useMemo(() => buildVerdict(records), [records]);
  const range = records.length
    ? `${fmtMonth(records[records.length - 1].startDate)} to ${fmtMonth(records[0].startDate)}`
    : '';

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const url = await toPng(cardRef.current, { width: 1080, height: 1080, pixelRatio: 1 });
      const a = document.createElement('a');
      a.href = url;
      a.download = `why-i-lose-${username}.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  if (!username || !username.trim()) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm max-w-2xl mx-auto">
        <Target className="w-12 h-12 text-violet-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No player selected</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Enter a Chess.com username above to diagnose loss patterns, clock trouble, and opening leaks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-gray">
          {loading && progress
            ? `Loading month ${progress.months} (${progress.games} games so far, ${progress.fromCache} from cache)...`
            : records.length
              ? `${records.length} standard games, ${range}. Computed client-side in your browser.`
              : ''}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-ash-gray font-normal">Games to read</span>
          <div className="flex bg-mist-gray rounded-pill p-1">
            {SIZES.map((n) => (
              <button
                key={n}
                onClick={() => changeSize(n)}
                disabled={loading}
                className={`px-3 py-1 rounded-pill font-normal transition-all ${size === n ? 'bg-ink-black text-paper-white font-medium' : 'text-slate-gray hover:text-ink-black'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-paper-white border border-red-200 text-red-600 p-4 rounded-card flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-mist-gray rounded-card p-12 flex items-center justify-center gap-3 text-slate-gray text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-ink-black" /> Reading your games archive, one month at a time...
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <>
          {/* Headline — Steep Signature Accent Peach Card */}
          {verdict.enough ? (
            <section className="bg-blush-peach text-sienna-brown rounded-card p-8 md:p-12 space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-medium text-sienna-brown opacity-80 inline-flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      The Biggest Leak
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.2] tracking-[-0.015em] text-sienna-brown">
                    {verdict.main?.headline ?? 'No single leak stands out across these games.'}
                  </h2>
                </div>
                <AnimatedPiece 
                  piece="wood_king" 
                  size={58} 
                  alt="Chess King piece" 
                  showShadow={false}
                  className="shrink-0 -mt-2 opacity-90 hidden sm:inline-flex"
                />
              </div>
              {verdict.main && (
                <p className="text-sienna-brown/85 text-base md:text-lg leading-relaxed font-sans max-w-3xl">
                  {verdict.main.detail}
                </p>
              )}
              {verdict.others.length > 0 && (
                <ul className="mt-6 space-y-2 text-sm text-sienna-brown/80 border-t border-sienna-brown/20 pt-4 font-sans">
                  {verdict.others.map((f) => (
                    <li key={f.key} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sienna-brown opacity-60"></span>
                      <span>Also: {f.headline}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="pt-2">
                <button
                  onClick={downloadCard}
                  disabled={exporting}
                  className="inline-flex items-center gap-2 bg-ink-black hover:bg-black text-paper-white text-xs font-medium px-5 py-2.5 rounded-pill transition-colors disabled:opacity-60"
                >
                  {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Download verdict card
                </button>
              </div>
            </section>
          ) : (
            <section className="bg-amber-50 border border-amber-100 text-amber-800 rounded-3xl p-6 flex gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                Too few games for a verdict: {records.length} found, {MIN_GAMES_FOR_VERDICT} needed. The charts below
                are shown, but treat them as noise for now.
              </p>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LossEndings records={records} />
            <ClockCard records={records} />
          </div>
          <OpeningTable records={records} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1"><TimeOfDay records={records} /></div>
            <TiltCard records={records} />
            <RatingGapCard records={records} />
          </div>
          <EngineView records={records} />

          {/* Off-screen source for the PNG export */}
          <div style={{ position: 'fixed', left: -10000, top: 0 }} aria-hidden>
            <VerdictCard ref={cardRef} username={username} verdict={verdict} overall={overall} range={range} />
          </div>
        </>
      )}
    </div>
  );
};

export default WhyILose;
