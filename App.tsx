import React, { useEffect, useState, useCallback } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import StatCard from './components/StatCard';
import WinRateCard from './components/WinRateCard';
import RatingChart from './components/RatingChart';
import PerformanceChart from './components/PerformanceChart';
import GameList from './components/GameList';
import { getProfile, getStats, getRecentGames } from './services/chessApi';
import { ChessPlayerProfile, ChessPlayerStats, ChessGame } from './types';
import { AlertCircle, Zap, Trophy, Brain } from 'lucide-react';

const DEFAULT_USER = 'peeves73';

function App() {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('chess_username') || DEFAULT_USER;
  });
  
  const [profile, setProfile] = useState<ChessPlayerProfile | null>(null);
  const [stats, setStats] = useState<ChessPlayerStats | null>(null);
  const [games, setGames] = useState<ChessGame[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (user: string) => {
    setIsLoading(true);
    setError(null);
    setProfile(null); 
    
    try {
      const [profileData, statsData, gamesData] = await Promise.all([
        getProfile(user),
        getStats(user),
        getRecentGames(user)
      ]);

      setProfile(profileData);
      setStats(statsData);
      setGames(gamesData);
      
      localStorage.setItem('chess_username', user);
      
    } catch (err) {
      console.error(err);
      setError(`Could not find data for user "${user}".`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(username);
  }, [fetchData, username]);

  return (
    <Layout>
      <Header onSearch={(u) => setUsername(u)} isLoading={isLoading} />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
           <div className="h-48 bg-gray-200 rounded-3xl md:col-span-3"></div>
           <div className="h-64 bg-gray-200 rounded-3xl"></div>
           <div className="h-64 bg-gray-200 rounded-3xl"></div>
           <div className="h-64 bg-gray-200 rounded-3xl"></div>
        </div>
      )}

      {!isLoading && profile && stats && (
        <div className="space-y-6">
          <ProfileCard profile={profile} stats={stats} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {/* Widget 1: Circular Win Rate (Rapid) */}
            <div className="col-span-1 lg:col-span-1 min-h-[320px]">
                <WinRateCard stats={stats} />
            </div>

            {/* Widget 2: Line Chart */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 min-h-[320px]">
                <RatingChart games={games} username={profile.username} />
            </div>

            {/* Widget 3: Stats Column */}
            <div className="col-span-1 flex flex-col gap-6 h-full">
                 <div className="flex-1">
                     {stats.chess_rapid && (
                        <StatCard 
                            title="Current Rapid"
                            value={stats.chess_rapid.last.rating}
                            icon={<Zap className="w-6 h-6" />}
                            isPurple={true}
                        />
                     )}
                 </div>
                 <div className="flex-1">
                     {stats.puzzle_rush?.best ? (
                        <StatCard 
                            title="Puzzle Rush Best"
                            value={stats.puzzle_rush.best.score}
                            subtitle={`${stats.puzzle_rush.best.total_attempts} attempts`}
                            icon={<Brain className="w-6 h-6" />}
                            isPurple={false}
                        />
                     ) : (
                        <div className="h-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center items-center text-gray-400">
                             <Trophy className="w-8 h-8 mb-2 opacity-50" />
                             <span className="text-sm">No Puzzle Data</span>
                        </div>
                     )}
                 </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="h-80">
                 <PerformanceChart games={games} username={profile.username} />
             </div>
             <div className="h-80">
                 <GameList games={games} username={profile.username} />
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;