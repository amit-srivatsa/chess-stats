import React from 'react';
import { ChessGame } from '../types';

interface PerformanceChartProps {
  games: ChessGame[];
  username: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ games, username }) => {
  // Calculate performance by color
  const stats = games.reduce((acc, game) => {
    const isWhite = game.white.username.toLowerCase() === username.toLowerCase();
    const result = isWhite ? game.white.result : game.black.result;
    
    if (isWhite) {
        acc.white.total++;
        if (result === 'win') acc.white.wins++;
        if (['agreed', 'repetition', 'stalemate', 'insufficient', '50move'].includes(result)) acc.white.draws++;
    } else {
        acc.black.total++;
        if (result === 'win') acc.black.wins++;
        if (['agreed', 'repetition', 'stalemate', 'insufficient', '50move'].includes(result)) acc.black.draws++;
    }
    return acc;
  }, {
    white: { total: 0, wins: 0, draws: 0 },
    black: { total: 0, wins: 0, draws: 0 }
  });

  const getPercent = (wins: number, total: number) => total > 0 ? Math.round((wins / total) * 100) : 0;

  const whiteWinRate = getPercent(stats.white.wins, stats.white.total);
  const blackWinRate = getPercent(stats.black.wins, stats.black.total);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance by Color</h3>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Last {games.length} Games</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-center gap-8">
         {/* White Stats */}
         <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-gray-700">Playing White</span>
                <span className="font-bold text-violet-600">{whiteWinRate}% Win Rate</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    style={{ width: `${whiteWinRate}%` }} 
                    className="h-full bg-violet-500 rounded-full shadow-lg shadow-violet-200"
                ></div>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>{stats.white.total} Games</span>
                <span>{stats.white.wins} Wins</span>
                <span>{stats.white.draws} Draws</span>
            </div>
         </div>

         {/* Black Stats */}
         <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-gray-700">Playing Black</span>
                <span className="font-bold text-gray-900">{blackWinRate}% Win Rate</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    style={{ width: `${blackWinRate}%` }} 
                    className="h-full bg-gray-800 rounded-full shadow-lg shadow-gray-300"
                ></div>
            </div>
             <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>{stats.black.total} Games</span>
                <span>{stats.black.wins} Wins</span>
                <span>{stats.black.draws} Draws</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PerformanceChart;