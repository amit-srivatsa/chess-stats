import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChessGame } from '../types';

interface RatingChartProps {
  games: ChessGame[];
  username: string;
}

const RatingChart: React.FC<RatingChartProps> = ({ games, username }) => {
  const chartData = useMemo(() => {
    // Sort oldest to newest
    const sortedGames = [...games]
      .filter(g => g.rated === true)
      .sort((a, b) => a.end_time - b.end_time);

    return sortedGames.map((game) => {
      const isWhite = game.white.username.toLowerCase() === username.toLowerCase();
      const player = isWhite ? game.white : game.black;
      
      const date = new Date(game.end_time * 1000);
      const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      // Separate ratings by time class
      let rapid = null;
      let blitz = null;
      let bullet = null;

      if (game.time_class === 'rapid') rapid = player.rating;
      if (game.time_class === 'blitz') blitz = player.rating;
      if (game.time_class === 'bullet') bullet = player.rating;

      return {
        date: dateStr,
        timestamp: game.end_time,
        rapid,
        blitz,
        bullet
      };
    });
  }, [games, username]);

  if (chartData.length < 2) return null;

  // Calculate generic domain
  const allRatings = chartData.flatMap(d => [d.rapid, d.blitz, d.bullet]).filter(Number) as number[];
  const minRating = Math.min(...allRatings) - 50;
  const maxRating = Math.max(...allRatings) + 50;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Rating Monitor</h3>
        <div className="flex gap-3 text-xs font-medium">
             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Rapid</div>
             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500"></span> Blitz</div>
             <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Bullet</div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 10 }} 
              tickMargin={10}
              minTickGap={40}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF" 
              domain={[minRating, maxRating]} 
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderColor: '#E5E7EB', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
              labelStyle={{ color: '#6B7280', marginBottom: '4px', fontSize: '12px' }}
            />
            
            {/* Rapid: Bright Yellow */}
            <Line 
              connectNulls
              type="monotone" 
              dataKey="rapid" 
              stroke="#FACC15" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#FACC15', stroke: '#fff', strokeWidth: 2 }}
            />
            {/* Blitz: Purple */}
            <Line 
              connectNulls
              type="monotone" 
              dataKey="blitz" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
            />
            {/* Bullet: Pink */}
            <Line 
              connectNulls
              type="monotone" 
              dataKey="bullet" 
              stroke="#EC4899" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#EC4899', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingChart;