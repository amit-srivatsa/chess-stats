import React from 'react';
import { ChessGame } from '../types';
import { ExternalLink, Hash, Clock, AlertCircle } from 'lucide-react';

interface GameListProps {
  games: ChessGame[];
  username: string;
}

const GameList: React.FC<GameListProps> = ({ games, username }) => {
  // Show more games now that we scroll
  const recentGames = games.slice(0, 20);

  const formatTimeControl = (tc: string) => {
    // Usually "600" or "600+5"
    const parts = tc.split('+');
    const seconds = parseInt(parts[0], 10);
    const minutes = Math.floor(seconds / 60);
    const increment = parts[1] ? `+${parts[1]}` : '';
    return `${minutes} min${increment}`;
  };

  const getResultDetails = (game: ChessGame, me: any, opponent: any) => {
    // Infer result method based on result code. 
    // Codes: win, checkmated, agreed, repetition, timeout, resigned, stalemate, insufficient, 50move, abandoned
    
    // If I won
    if (me.result === 'win') {
        if (opponent.result === 'checkmated') return 'Won by Checkmate';
        if (opponent.result === 'timeout') return 'Won by Timeout';
        if (opponent.result === 'resigned') return 'Won by Resignation';
        if (opponent.result === 'abandoned') return 'Won by Abandonment';
        return 'Won';
    }
    
    // If I lost
    if (me.result === 'checkmated') return 'Checkmated';
    if (me.result === 'timeout') return 'Lost on Time';
    if (me.result === 'resigned') return 'Resigned';
    if (me.result === 'abandoned') return 'Abandoned';

    // Draws
    if (me.result === 'agreed') return 'Draw by Agreement';
    if (me.result === 'repetition') return 'Draw by Repetition';
    if (me.result === 'stalemate') return 'Stalemate';
    if (me.result === 'insufficient') return 'Insufficient Material';
    if (me.result === '50move') return '50-Move Rule';
    if (me.result === 'timevsinsufficient') return 'Draw (Time vs Insuff)';

    return me.result; // Fallback
  };

  const getResultColor = (result: string, myResult: string) => {
    if (myResult === 'win') return 'text-violet-600 bg-violet-50 border-violet-100';
    if (['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'].includes(myResult)) return 'text-gray-500 bg-gray-50 border-gray-100';
    return 'text-red-500 bg-red-50 border-red-100';
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Recent Matches</h3>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Scroll for more</span>
      </div>
      
      {/* Scrollable Area */}
      <div className="divide-y divide-gray-50 overflow-y-auto flex-1 custom-scrollbar pr-1">
        {recentGames.map((game) => {
          const isWhite = game.white.username.toLowerCase() === username.toLowerCase();
          const me = isWhite ? game.white : game.black;
          const opponent = isWhite ? game.black : game.white;
          const resultText = getResultDetails(game, me, opponent);
          const resultStyles = getResultColor(game.white.result, me.result);
          
          return (
            <div key={game.uuid} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer border-l-4 border-l-transparent hover:border-l-violet-400">
              <div className="flex items-center gap-4">
                {/* Result Badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${resultStyles}`}>
                    {me.result === 'win' ? 'W' : (['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient'].includes(me.result) ? 'D' : 'L')}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{opponent.username}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {opponent.rating}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTimeControl(game.time_control)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="capitalize">{resultText}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-gray-700">
                        {me.rating} 
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                        {game.time_class}
                    </div>
                 </div>
                 <a 
                    href={game.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-violet-600 rounded-full transition-all"
                    title="Analyze Game"
                  >
                    <ExternalLink className="w-4 h-4" />
                 </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameList;