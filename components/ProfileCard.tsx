import React from 'react';
import { ChessPlayerProfile, ChessPlayerStats } from '../types';
import { MapPin, Users, Calendar, ExternalLink, Shield, CheckCircle2, TrendingUp } from 'lucide-react';

interface ProfileCardProps {
  profile: ChessPlayerProfile;
  stats?: ChessPlayerStats | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, stats }) => {
  const joinDate = new Date(profile.joined * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short'
  });

  // Simple heuristic for OTB estimation
  const calculateOTB = () => {
    if (!stats) return null;
    const rapid = stats.chess_rapid?.last?.rating || 0;
    const blitz = stats.chess_blitz?.last?.rating || 0;
    
    // If we have both, weight them. Blitz is often more correlated for high rated players, 
    // Rapid for lower. We'll take a weighted average.
    if (rapid > 0 && blitz > 0) {
      return Math.round((rapid * 0.6) + (blitz * 0.4));
    }
    return rapid || blitz || 0;
  };

  const otbRating = calculateOTB();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start transition-all hover:shadow-md relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="rounded-full p-1 bg-gradient-to-br from-violet-500 to-cyan-400">
           <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=f3f4f6&color=111827`}
            alt={profile.username}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-sm"
          />
        </div>
        {profile.title && (
          <span className="absolute bottom-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border-2 border-white">
            {profile.title}
          </span>
        )}
      </div>

      <div className="flex-1 text-center md:text-left space-y-4 z-10">
        <div>
           <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {profile.username}
            </h2>
             {profile.status !== 'closed' && (
                <CheckCircle2 className="w-5 h-5 text-violet-500" fill="currentColor" color="white" />
             )}
          </div>
          {profile.name && (
            <p className="text-gray-500 font-medium text-lg">{profile.name}</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
          {profile.location && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
              <MapPin className="w-4 h-4 text-violet-500" />
              <span>{profile.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
            <Users className="w-4 h-4 text-cyan-500" />
            <span>{profile.followers.toLocaleString()} Followers</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>Since {joinDate}</span>
          </div>
        </div>
      </div>
      
      {/* OTB Estimation Section - Type Based Design */}
      <div className="flex flex-col gap-4 w-full md:w-auto z-10 items-center md:items-end">
        {otbRating && otbRating > 0 && (
          <div className="text-center md:text-right">
             <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs font-bold text-violet-600 tracking-widest uppercase">
                <TrendingUp className="w-3 h-3" /> Est. OTB Rating
             </div>
             <div className="text-6xl font-black text-gray-900 tracking-tighter my-1 leading-none">
                {otbRating}
             </div>
             <div className="text-xs text-gray-400 font-medium">
               Based on online performance
             </div>
          </div>
        )}
        
        <a 
            href={profile.url} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100 rounded-xl font-semibold transition-all text-sm w-full md:w-auto"
        >
            View Profile <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;