import React, { forwardRef } from 'react';
import { Verdict } from '../../lib/headline';
import { Tally } from '../../lib/stats';

interface VerdictCardProps {
  username: string;
  verdict: Verdict;
  overall: Tally;
  range: string;
}

/**
 * The shareable 1080 x 1080 image. Rendered off screen and exported to PNG.
 * Plain inline styles and system fonts so the export never depends on a CDN.
 */
const VerdictCard = forwardRef<HTMLDivElement, VerdictCardProps>(({ username, verdict, overall, range }, ref) => (
  <div
    ref={ref}
    style={{
      width: 1080, height: 1080, padding: 88, boxSizing: 'border-box',
      background: '#111827', color: '#f9fafb', display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, Segoe UI, Roboto, sans-serif',
    }}
  >
    <div style={{ fontSize: 30, letterSpacing: 4, textTransform: 'uppercase', color: '#a78bfa', fontWeight: 600 }}>
      Why I lose at chess
    </div>
    <div style={{ fontSize: 28, color: '#9ca3af', marginTop: 12 }}>
      {username} · {overall.games} games · {range}
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      <div style={{ fontSize: 76, lineHeight: 1.12, fontWeight: 700, letterSpacing: -1 }}>
        {verdict.main?.headline ?? 'No single leak stands out yet.'}
      </div>
    </div>
    {verdict.main && (
      <div style={{ fontSize: 32, color: '#d1d5db', lineHeight: 1.35, marginBottom: 40 }}>{verdict.main.detail}</div>
    )}
    <div style={{ display: 'flex', gap: 48, borderTop: '2px solid #374151', paddingTop: 32, fontSize: 28, color: '#9ca3af' }}>
      <span><b style={{ color: '#f9fafb' }}>{overall.wins}</b> {overall.wins === 1 ? 'win' : 'wins'}</span>
      <span><b style={{ color: '#f9fafb' }}>{overall.losses}</b> {overall.losses === 1 ? 'loss' : 'losses'}</span>
      <span><b style={{ color: '#f9fafb' }}>{overall.draws}</b> {overall.draws === 1 ? 'draw' : 'draws'}</span>
      <span style={{ marginLeft: 'auto' }}>Chess.com public data · no AI</span>
    </div>
  </div>
));

export default VerdictCard;
