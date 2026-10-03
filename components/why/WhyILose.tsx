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

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {loading && progress
            ? `Loading month ${progress.months} (${progress.games} games so far, ${progress.fromCache} from cache)...`
            : records.length
              ? `${records.length} standard games, ${range}. Everything is computed in your browser.`
              : ''}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Games to read</span>
          <div className="flex bg-white border border-gray-200 rounded-xl p-1">
            {SIZES.map((n) => (
              <button
                key={n}
                onClick={() => changeSize(n)}
                disabled={loading}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${size === n ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-3xl p-10 border border-gray-100 flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" /> Reading your games, one month at a time
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <>
          {/* Headline */}
          {verdict.enough ? (
            <section className="bg-gray-900 text-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold uppercase tracking-widest">
                <Target className="w-4 h-4" /> The biggest leak
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">
                {verdict.main?.headline ?? 'No single leak stands out across these games.'}
              </h2>
              {verdict.main && <p className="text-gray-300 mt-3">{verdict.main.detail}</p>}
              {verdict.others.length > 0 && (
                <ul className="mt-6 space-y-1.5 text-sm text-gray-300 border-t border-gray-700 pt-4">
                  {verdict.others.map((f) => (
                    <li key={f.key}>Also: {f.headline}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={downloadCard}
                disabled={exporting}
                className="mt-6 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download verdict card
              </button>
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
