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
      </footer>
    </div>
  );
};

export default Layout;