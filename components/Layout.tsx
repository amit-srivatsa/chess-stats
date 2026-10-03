import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-paper-white text-ink-black selection:bg-blush-peach selection:text-sienna-brown antialiased">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {children}
      </main>
      
      {/* Steep Editorial Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 border-t border-border-subtle mt-20 text-slate-gray text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base text-ink-black font-normal">Chess Stats</span>
            <span className="text-ash-gray">•</span>
            <span>A personal build by Amit Srivatsa</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-gray">
            <a 
              href="https://amitsrivatsa.com" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-ink-black transition-colors"
            >
              amitsrivatsa.com
            </a>
            <a 
              href="https://github.com/amit-srivatsa/chess-stats" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-ink-black transition-colors"
            >
              GitHub
            </a>
            <span className="text-slate-gray">
              Piece illustrations by{' '}
              <a 
                href="http://www.freepik.com" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-ink-black underline transition-colors"
              >
                brgfx / Freepik
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;