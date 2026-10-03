import React, { useState } from 'react';
import { Target, Brain, ShieldCheck, Search, ArrowRight, Zap } from 'lucide-react';

interface HeroIntakeProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const SAMPLE_PLAYERS = [
  { name: 'magnuscarlsen', label: 'Magnus Carlsen' },
  { name: 'hikaru', label: 'Hikaru Nakamura' },
  { name: 'danielnaroditsky', label: 'Daniel Naroditsky' },
];

export const HeroIntake: React.FC<HeroIntakeProps> = ({ onSearch, isLoading }) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  return (
    <div className="space-y-10 py-6">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          100% In-Browser Analytics
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Uncover why you lose on Chess.com
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Enter any Chess.com username to inspect rating curves, win rates, clock scrambles, and opening leaks computed directly in your browser.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-3xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-4 pointer-events-none" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Chess.com username (e.g. hikaru)"
                autoFocus
                className="w-full py-3.5 pl-3 pr-4 text-gray-900 placeholder-gray-400 bg-transparent text-base focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-violet-600 text-white font-medium hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <span>{isLoading ? 'Loading...' : 'Analyze Stats'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-sm text-gray-500">
          <span>Or try with a grandmaster:</span>
          {SAMPLE_PLAYERS.map((player) => (
            <button
              key={player.name}
              type="button"
              onClick={() => onSearch(player.name)}
              className="px-3 py-1 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition-all text-xs font-medium"
            >
              {player.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Why I Lose Diagnostics</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Walks backward through your recent games to detect clock trouble, time-of-day dips, opening drop-offs, and post-loss tilt.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">In-Browser Stockfish</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Replays your losses using Stockfish 19 running locally in a Web Worker to identify the exact turning point move where the win chance vanished.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">Private & Zero-Backend</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Direct client-side fetch via Chess.com's public API. No login, no password, and your data stays on your machine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroIntake;
