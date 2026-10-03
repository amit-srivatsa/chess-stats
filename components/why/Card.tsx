import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}

/** Same card shell as the dashboard widgets. */
const Card: React.FC<CardProps> = ({ title, note, children, className = '' }) => (
  <section className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col ${className}`}>
    <div className="flex justify-between items-start gap-4 mb-5">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {note && (
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg shrink-0">{note}</span>
      )}
    </div>
    {children}
  </section>
);

export default Card;
