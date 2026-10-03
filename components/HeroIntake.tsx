import React, { useState } from 'react';
import { Search, ArrowRight, TrendingDown, Clock, ShieldCheck, ChevronDown, ChevronUp, Cpu, Sparkles } from 'lucide-react';
import AnimatedPiece from './AnimatedPiece';

interface HeroIntakeProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const SAMPLE_PLAYERS = [
  { name: 'magnuscarlsen', label: 'Magnus Carlsen' },
  { name: 'hikaru', label: 'Hikaru Nakamura' },
  { name: 'ghandeevam2003', label: 'Arjun Erigaisi' },
];

export const HeroIntake: React.FC<HeroIntakeProps> = ({ onSearch, isLoading }) => {
  const [inputVal, setInputVal] = useState('');
  const [showStrategyNote, setShowStrategyNote] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  return (
    <div className="space-y-20 md:space-y-28 py-6 md:py-12">
      {/* 1. HERO SECTION: Signifier Serif Headline + Floating Chess Artifacts */}
      <div className="relative max-w-4xl mx-auto text-center space-y-6 md:space-y-8 pt-4">
        
        {/* Subtle Category Marker */}
        <div className="inline-flex items-center gap-2 text-xs text-ash-gray font-normal tracking-wide">
          <span>A personal build by Amit</span>
        </div>

        {/* Hero Lockup with Floating Piece */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6">
          <div className="hidden lg:block -mt-6">
            <AnimatedPiece 
              piece="wood_knight" 
              size={92} 
              alt="Chess Knight piece" 
              floatVariant="default"
            />
          </div>

          {/* Oversized Signifier Serif Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] text-ink-black font-normal leading-[1.18] tracking-[-0.02em] max-w-3xl">
            Understand where your losses <span className="italic font-normal">actually</span> come from.
          </h1>

          <div className="hidden lg:block -mt-6">
            <AnimatedPiece 
              piece="black_king" 
              size={86} 
              alt="Chess King piece" 
              floatVariant="alt"
            />
          </div>
        </div>

        {/* Quiet Subhead */}
        <p className="text-slate-gray text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          A quiet in-browser diagnostic tool that reads your last 100 Chess.com games to reveal why you lose: clock panic, opening leaks, post-loss tilt, or unforced blunders.
        </p>

        {/* Input / Composer Container */}
        <div className="max-w-xl mx-auto pt-2">
          <form 
            onSubmit={handleSubmit} 
            className="p-2 sm:p-2.5 bg-paper-white rounded-elevated border border-border-subtle shadow-subtle flex flex-col sm:flex-row items-center gap-2.5 transition-all focus-within:border-slate-gray"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-4 h-4 text-smoke-gray ml-3 pointer-events-none shrink-0" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter any Chess.com username"
                autoFocus
                className="w-full py-2.5 pl-3 pr-4 text-ink-black placeholder-smoke-gray bg-transparent text-sm sm:text-base focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-pill bg-ink-black text-paper-white text-sm font-medium hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Analyzing…' : 'Analyze games'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Suggestions with ghost pill buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-gray">
            <span className="text-ash-gray">Quick test:</span>
            {SAMPLE_PLAYERS.map((player) => (
              <button
                key={player.name}
                type="button"
                onClick={() => onSearch(player.name)}
                className="px-3.5 py-1.5 rounded-pill transition-all text-xs font-normal text-slate-gray hover:text-ink-black hover:bg-mist-gray bg-mist-gray/60 border border-border-subtle"
              >
                {player.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. FLOATING PRODUCT ARTIFACTS COLLAGE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 text-left max-w-4xl mx-auto">
          {/* Artifact 1: Author Baselining with Wood Bishop */}
          <div className="bg-paper-white p-5 rounded-elevated border border-border-subtle shadow-artifact space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-ash-gray">
              <span>Author baseline finding</span>
              <span className="font-mono text-[11px]">peeves73</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-medium text-ink-black font-sans">
                  68%
                </div>
                <div className="text-xs text-slate-gray mt-0.5">
                  Resignations after tactical blunder
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <AnimatedPiece 
                  piece="wood_bishop" 
                  size={38} 
                  alt="Bishop" 
                  showShadow={false}
                  className="opacity-80"
                />
              </div>
            </div>
            {/* Gestural line representation */}
            <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px] text-slate-gray">
              <span>Clock pressure: only 14%</span>
              <span className="text-sienna-brown font-medium">Blunder move 18–25</span>
            </div>
          </div>

          {/* Artifact 2: Signature Steep Accent Peach Card with Centered Black Queen */}
          <div className="bg-blush-peach text-sienna-brown p-5 rounded-card space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <span className="text-[11px] font-medium tracking-wider uppercase opacity-80">
                  Editorial Spotlight
                </span>
                <p className="font-serif text-lg leading-snug font-normal">
                  "I was sure I lost on time. The data proved the clock was just an excuse."
                </p>
              </div>
              <div className="shrink-0 flex items-center justify-center self-center pl-1">
                <AnimatedPiece 
                  piece="black_queen" 
                  size={34} 
                  alt="Black Queen" 
                  showShadow={false} 
                />
              </div>
            </div>
            <div className="text-xs opacity-75 pt-2 border-t border-sienna-brown/20 flex items-center justify-between">
              <span>Tested on 100 recent games</span>
              <span>Stockfish 19</span>
            </div>
          </div>

          {/* Artifact 3: Privacy & Engine Artifact with Black Rook */}
          <div className="bg-paper-white p-5 rounded-elevated border border-border-subtle shadow-artifact space-y-3 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-ash-gray">
              <span>Client-side engine</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <div className="text-sm font-medium text-ink-black">
                  100% In-Browser Privacy
                </div>
                <p className="text-xs text-slate-gray mt-1 leading-relaxed">
                  Stockfish 19 runs directly in a local Web Worker. No game logs leave your machine.
                </p>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <AnimatedPiece 
                  piece="black_rook" 
                  size={36} 
                  alt="Black Rook" 
                  showShadow={false} 
                  className="opacity-80"
                />
              </div>
            </div>
            <div className="text-[11px] text-ash-gray pt-2 border-t border-border-subtle/80">
              0 bytes sent to external servers
            </div>
          </div>
        </div>
      </div>

      {/* 3. NEUTRAL FEATURE CARDS (#f2f2f3 Mist Gray, 24px radius, no shadow) */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs text-ash-gray uppercase tracking-wider font-normal">
            Diagnostics
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-black font-normal">
            Four quiet checks on every game.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-mist-gray p-7 rounded-card space-y-2.5">
            <span className="text-xs text-ash-gray">01</span>
            <h3 className="text-lg font-medium text-ink-black">
              Sample discipline
            </h3>
            <p className="text-sm text-slate-gray leading-relaxed">
              Openings with fewer than 10 games are hidden. Under 30 total games, the tool refuses to jump to conclusions. You get reliable findings, not noise.
            </p>
          </div>

          <div className="bg-mist-gray p-7 rounded-card space-y-2.5">
            <span className="text-xs text-ash-gray">02</span>
            <h3 className="text-lg font-medium text-ink-black">
              Turning point analysis
            </h3>
            <p className="text-sm text-slate-gray leading-relaxed">
              Stockfish 19 replays your losses in the browser to identify the exact move where your winning chances dropped the most while you still had a fighting game.
            </p>
          </div>

          <div className="bg-mist-gray p-7 rounded-card space-y-2.5">
            <span className="text-xs text-ash-gray">03</span>
            <h3 className="text-lg font-medium text-ink-black">
              Clock trouble vs blunder
            </h3>
            <p className="text-sm text-slate-gray leading-relaxed">
              Separates actual flag drops from resignations. Checks your remaining time after move 30 to see whether speed or board vision caused the loss.
            </p>
          </div>

          <div className="bg-mist-gray p-7 rounded-card space-y-2.5">
            <span className="text-xs text-ash-gray">04</span>
            <h3 className="text-lg font-medium text-ink-black">
              Tilt & time-of-day dips
            </h3>
            <p className="text-sm text-slate-gray leading-relaxed">
              Measures your performance immediately following a loss or back-to-back defeats, plus win rates split across 3-hour local time blocks.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SEPARATE, SUBTLE "BEHIND THE BUILD" NOTE (Quiet & Collapsible) */}
      <section className="max-w-2xl mx-auto pt-6 border-t border-border-subtle">
        <button
          type="button"
          onClick={() => setShowStrategyNote(!showStrategyNote)}
          className="w-full flex items-center justify-between text-xs text-slate-gray hover:text-ink-black py-2 transition-colors cursor-pointer group"
        >
          <span className="font-medium group-hover:underline">
            Behind the build: Why I built this tool (note by Amit Srivatsa)
          </span>
          {showStrategyNote ? (
            <ChevronUp className="w-4 h-4 text-slate-gray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-gray" />
          )}
        </button>

        {showStrategyNote && (
          <div className="mt-4 p-6 bg-fog-white rounded-elevated border border-border-subtle text-sm text-slate-gray space-y-3 leading-relaxed">
            <p className="text-ink-black font-medium">
              Chess was the excuse. The real question was: can messy public data be turned into one honest sentence?
            </p>
            <p>
              Most dashboards drown players in averages. When building this, the interesting part wasn't writing code — it was deciding what rules a number must clear before it earns the right to speak:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-gray">
              <li>Openings under 10 games are hidden; under 30 games the tool gives no verdict.</li>
              <li>Calculations use the audited Lichess winning-probability sigmoid formula clamped to centipawn depth 12.</li>
              <li>Moves played after a game is already dead-lost are excluded so the turning point represents actionable advice.</li>
              <li>Everything stays in your browser's IndexedDB. Zero servers, zero telemetry.</li>
            </ul>
            <p className="text-xs text-ash-gray pt-2">
              Part of Buildtober by Amit Srivatsa.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HeroIntake;
