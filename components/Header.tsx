import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface HeaderProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim().toLowerCase());
      setInputValue('');
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Checkmate Stats
        </h1>
        <p className="text-gray-500 mt-1">Player Analytics Dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="relative w-full md:w-80 group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search username..."
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