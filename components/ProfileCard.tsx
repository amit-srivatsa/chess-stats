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
    <div className="bg-paper-white rounded-card p-6 md:p-8 border border-border-subtle shadow-subtle flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
      <div className="relative z-10 shrink-0">
        <div className="rounded-full p-0.5 border border-border-subtle">
           <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=f2f2f3&color=17191c`}
            alt={profile.username}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
          />
        </div>
        {profile.title && (
          <span className="absolute bottom-0 right-0 bg-ink-black text-paper-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-paper-white">
            {profile.title}
          </span>
        )}
      </div>

      <div className="flex-1 text-center md:text-left space-y-4 z-10">
        <div>
           <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
            <h2 className="font-serif text-3xl font-normal text-ink-black tracking-tight">
              {profile.username}
            </h2>
             {profile.status !== 'closed' && (
                <CheckCircle2 className="w-4 h-4 text-slate-gray" />
             )}
          </div>
          {profile.name && (
            <p className="text-slate-gray font-normal text-sm sm:text-base mt-0.5">{profile.name}</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-slate-gray">
          {profile.location && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-mist-gray rounded-pill">
              <MapPin className="w-3.5 h-3.5 text-slate-gray" />
              <span>{profile.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-mist-gray rounded-pill">
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