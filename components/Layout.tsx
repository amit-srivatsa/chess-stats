import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 selection:bg-violet-500 selection:text-white">
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </main>
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>Data provided by Chess.com Public API</p>
        <p className="mt-1">
          Engine:{' '}
          <a href="https://github.com/nmrugg/stockfish.js" className="underline hover:text-gray-600" target="_blank" rel="noreferrer">
            Stockfish.js
          </a>{' '}
          (Stockfish 19, GPL-3.0), running in your browser. This app is{' '}
          <a href="https://github.com/amit-srivatsa/chess-stats" className="underline hover:text-gray-600" target="_blank" rel="noreferrer">
            open source under GPL-3.0
          </a>.
        </p>
      </footer>
    </div>
  );
};

export default Layout;