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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={onClear} 
            className="text-left group cursor-pointer focus:outline-none"
            title="Return to intake"
          >
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-violet-600 transition-colors">
              Checkmate Stats
            </h1>
          </button>
          {currentUser && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200/60 shadow-xs">
              <User className="w-3.5 h-3.5" />
              {currentUser}
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="ml-1 text-violet-400 hover:text-violet-700 rounded-full p-0.5 hover:bg-violet-100 transition-colors"
                  title="Switch player"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}
        </div>
        <p className="text-gray-500 mt-1">Player Analytics Dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="relative w-full md:w-80 group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search any username..."
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-5 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </form>
    </header>
  );
};

export default Header;