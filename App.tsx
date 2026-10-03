import React, { useEffect, useState, useCallback } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import HeroIntake from './components/HeroIntake';
import ProfileCard from './components/ProfileCard';
import StatCard from './components/StatCard';
import WinRateCard from './components/WinRateCard';
import RatingChart from './components/RatingChart';
import PerformanceChart from './components/PerformanceChart';
import GameList from './components/GameList';
import { getProfile, getStats, getRecentGames } from './services/chessApi';
import { ChessPlayerProfile, ChessPlayerStats, ChessGame } from './types';
import WhyILose from './components/why/WhyILose';
import { AlertCircle, Zap, Trophy, Brain, LayoutDashboard, Target } from 'lucide-react';

type Tab = 'dashboard' | 'why';
const tabFromHash = (): Tab => (window.location.hash === '#why' ? 'why' : 'dashboard');

function getInitialUsername(): string {
  // 1. Check URL query params (?u= or ?user=)
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('u') || params.get('user');
    if (fromUrl && fromUrl.trim()) {
      return fromUrl.trim().toLowerCase();
    }
  } catch {}

  // 2. Check localStorage, but purge 'peeves73' so personal data never preloads
  try {
    const stored = localStorage.getItem('chess_username');
    if (stored) {
      const cleaned = stored.trim().toLowerCase();
      if (cleaned === 'peeves73') {
        localStorage.removeItem('chess_username');
        return '';
      }
      return cleaned;
    }
  } catch {}

  return '';
}

function App() {
  const [username, setUsername] = useState<string>(getInitialUsername);
  
  const [profile, setProfile] = useState<ChessPlayerProfile | null>(null);
  const [stats, setStats] = useState<ChessPlayerStats | null>(null);
  const [games, setGames] = useState<ChessGame[]>([]);
  
  const [tab, setTab] = useState<Tab>(tabFromHash);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (user: string) => {
    if (!user || !user.trim()) {
      setProfile(null);
      setStats(null);
      setGames([]);
      setIsLoading(false);
      return;
    }

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
      
      try {
        localStorage.setItem('chess_username', user);
      } catch {}
      
    } catch (err) {
      console.error(err);
      setError(`Could not find data for user "${user}". Please verify the username and try again.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((newUsername: string) => {
    const clean = newUsername.trim().toLowerCase();
    if (!clean) return;
    setUsername(clean);

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('u', clean);
      window.history.replaceState(null, '', url.toString());
    } catch {}
  }, []);

  const handleClear = useCallback(() => {
    setUsername('');
    setProfile(null);
    setStats(null);
    setGames([]);
    setError(null);
    try {
      localStorage.removeItem('chess_username');
    } catch {}

    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('u');
      url.searchParams.delete('user');
      window.history.replaceState(null, '', url.toString());
    } catch {}
  }, []);

  useEffect(() => {
    if (username) {
      fetchData(username);
    }
  }, [fetchData, username]);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const openTab = (t: Tab) => {
    setTab(t);
    window.history.replaceState(null, '', t === 'why' ? '#why' : window.location.pathname + window.location.search);
  };

  return (
    <Layout>
      <Header 
        onSearch={handleSearch} 
        isLoading={isLoading} 
        currentUser={username} 
        onClear={handleClear} 
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button 
            type="button" 
            onClick={handleClear}
            className="text-xs font-semibold underline text-red-700 hover:text-red-900 shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* When no user has been entered, or when lookup failed without a profile, show intake */}
      {(!username || (!profile && !isLoading)) && (
        <HeroIntake onSearch={handleSearch} isLoading={isLoading} />
      )}

      {username && (
        <nav className="flex gap-2 mb-8" aria-label="Views">
          {([
            ['dashboard', 'Dashboard', LayoutDashboard],
            ['why', 'Why I lose', Target],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => openTab(key)}
              aria-current={tab === key ? 'page' : undefined}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                tab === key ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>
      )}

      {username && tab === 'why' && (
        <WhyILose username={username} />
      )}

      {username && tab === 'dashboard' && isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
           <div className="h-48 bg-gray-200 rounded-3xl md:col-span-3"></div>
           <div className="h-64 bg-gray-200 rounded-3xl"></div>
           <div className="h-64 bg-gray-200 rounded-3xl"></div>
           <div className="h-64 bg-gray-200 rounded-3xl"></div>
        </div>
      )}

      {username && tab === 'dashboard' && !isLoading && profile && stats && (
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