import React, { useState } from 'react';
import { Search, Loader2, User, X } from 'lucide-react';

interface HeaderProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  currentUser?: string;
  onClear?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isLoading, currentUser, onClear }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim().toLowerCase());
      setInputValue('');
    }
  };

  return (
    <header className="py-4 md:py-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle/70">
      {/* Brand & Attribution */}
      <div className="flex items-center gap-4">
        <button 
          type="button" 
          onClick={onClear} 
          className="text-left group cursor-pointer focus:outline-none flex items-end gap-2.5 pb-0.5"
          title="Return to intake"
        >
          {/* Animated Header Chess Piece with lively bob and ground shadow */}
          <div className="relative w-7 h-9 flex items-end justify-center shrink-0 mb-0.5">
            <img 
              src="./assets/pieces/wood_knight.png" 
              alt="Chess Knight" 
              className="w-7 h-7 object-contain animate-header-piece transition-transform duration-300 group-hover:scale-115" 
            />
            <div className="absolute -bottom-1 w-5 h-1.5 pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
                <ellipse cx="50" cy="12" rx="42" ry="7" fill="rgba(23, 25, 28, 0.12)" />
              </svg>
            </div>
          </div>

          {/* Perfectly baseline-aligned Brand + Attribution */}
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl md:text-[26px] leading-none font-normal tracking-tight text-ink-black group-hover:text-slate-gray transition-colors">
              Chess Stats
            </span>
            <span className="text-xs text-slate-gray font-normal hidden sm:inline leading-none">
              by Amit Srivatsa
            </span>
          </div>
        </button>

        {currentUser && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs bg-mist-gray text-ink-black border border-border-subtle">
            <User className="w-3 h-3 text-slate-gray" />
            <span className="font-medium">{currentUser}</span>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="ml-1 text-slate-gray hover:text-ink-black p-0.5 rounded-full transition-colors"
                title="Switch player"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search Chess.com user..."
              className="bg-mist-gray border border-transparent rounded-pill py-2 pl-4 pr-4 text-sm text-ink-black placeholder-smoke-gray focus:outline-none focus:bg-white focus:border-border-subtle transition-all w-52 sm:w-64"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-ink-black hover:bg-black text-paper-white rounded-pill text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;