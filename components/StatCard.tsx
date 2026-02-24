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

const StatCard: React.FC<StatCardProps> = ({ title, icon, value, subtitle, isPurple = false }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-3 rounded-2xl ${isPurple ? 'bg-violet-50 text-violet-600' : 'bg-cyan-50 text-cyan-600'}`}>
           {icon}
        </div>
        {subtitle && (
            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                {subtitle}
            </span>
        )}
      </div>

      <div>
        <div className="text-4xl font-bold text-gray-900 mt-2 mb-1 tracking-tight">
          {value}
        </div>
        <div className="text-gray-500 font-medium text-sm">
          {title}
        </div>
      </div>
    </div>
  );
};

export default StatCard;