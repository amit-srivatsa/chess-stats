import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}

/** Same card shell as the dashboard widgets. */
const Card: React.FC<CardProps> = ({ title, note, children, className = '' }) => (
  <section className={`bg-paper-white rounded-card p-6 border border-border-subtle shadow-subtle flex flex-col ${className}`}>
    <div className="flex justify-between items-start gap-4 mb-5">
      <h3 className="text-base sm:text-lg font-medium text-ink-black">{title}</h3>
      {note && (
        <span className="text-xs text-slate-gray bg-mist-gray px-2.5 py-0.5 rounded-pill shrink-0">
          {note}
        </span>
      )}
    </div>
    {children}
  </section>
);

export default Card;
