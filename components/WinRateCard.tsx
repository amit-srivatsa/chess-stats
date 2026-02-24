import React, { useState } from 'react';
import { ChessPlayerStats } from '../types';

interface WinRateCardProps {
  stats: ChessPlayerStats;
}

const WinRateCard: React.FC<WinRateCardProps> = ({ stats }) => {
  const [activeTab, setActiveTab] = useState<'rapid' | 'blitz' | 'bullet'>('rapid');

  const getData = () => {
    switch (activeTab) {
        case 'blitz': return stats.chess_blitz?.record;
        case 'bullet': return stats.chess_bullet?.record;
        case 'rapid': default: return stats.chess_rapid?.record;
    }
  };

  const record = getData() || { win: 0, loss: 0, draw: 0 };
  const total = record.win + record.loss + record.draw;
  const percentage = total > 0 ? Math.round((record.win / total) * 100) : 0;
  
  // SVG Circle calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">Win Rate</h3>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
             <button 
                onClick={() => setActiveTab('rapid')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === 'rapid' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
             >
                Rapid
             </button>
             <button 
                onClick={() => setActiveTab('blitz')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === 'blitz' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
             >
                Blitz
             </button>
             <button 
                onClick={() => setActiveTab('bullet')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${activeTab === 'bullet' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
             >
                Bullet
             </button>
          </div>
      </div>
      
      <div className="relative w-48 h-48 mx-auto">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#F3F4F6"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
          <span className="text-sm text-gray-500 font-medium capitalize">{activeTab}</span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between px-4">
         <div className="flex flex-col items-center">
             <span className="w-3 h-3 rounded-full bg-violet-500 mb-1"></span>
             <span className="text-xs text-gray-400 font-medium">Wins</span>
             <span className="font-bold text-gray-700">{record.win}</span>
         </div>
         <div className="flex flex-col items-center">
             <span className="w-3 h-3 rounded-full bg-gray-300 mb-1"></span>
             <span className="text-xs text-gray-400 font-medium">Draws</span>
             <span className="font-bold text-gray-700">{record.draw}</span>
         </div>
         <div className="flex flex-col items-center">
             <span className="w-3 h-3 rounded-full bg-red-400 mb-1"></span>
             <span className="text-xs text-gray-400 font-medium">Loss</span>
             <span className="font-bold text-gray-700">{record.loss}</span>
         </div>
      </div>
    </div>
  );
};

export default WinRateCard;