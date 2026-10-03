import React from 'react';
import { RatingStat } from '../types';
import { Trophy } from 'lucide-react';

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subtitle?: string;
  trend?: string;
  isPurple?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, value, subtitle }) => {
  return (
    <div className="bg-paper-white rounded-card p-6 border border-border-subtle shadow-subtle flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2.5 rounded-xl bg-mist-gray text-ink-black">
           {icon}
        </div>
        {subtitle && (
            <span className="text-xs text-slate-gray bg-mist-gray px-2.5 py-0.5 rounded-pill font-normal">
                {subtitle}
            </span>
        )}
      </div>

      <div className="pt-2">
        <div className="text-3xl font-medium text-ink-black tracking-tight font-sans">
          {value}
        </div>
        <div className="text-slate-gray text-xs mt-1 font-normal">
          {title}
        </div>
      </div>
    </div>
  );
};

export default StatCard;