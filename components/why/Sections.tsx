import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend,
} from 'recharts';
import Card from './Card';
import { GameRecord } from '../../lib/games';
import {
  howLossesEnd, openingLeaks, clockTrouble, byTimeOfDay, tilt, ratingGap, tally,
  END_LABELS, MIN_OPENING_GAMES, Tally,
} from '../../lib/stats';

const r0 = (n: number) => Math.round(n);
const fmtSecs = (s: number | null) =>
  s === null ? 'n/a' : s >= 60 ? `${Math.floor(s / 60)}:${String(r0(s % 60)).padStart(2, '0')}` : `${r0(s)}s`;

const REASON_COLOURS: Record<string, string> = {
  resigned: '#8b5cf6', // violet-500
  checkmated: '#111827', // gray-900
  timeout: '#f59e0b', // amber-500
  abandoned: '#9ca3af', // gray-400
  other: '#d1d5db',
};

// ---------- 4. How losses end ----------

export const LossEndings: React.FC<{ records: GameRecord[] }> = ({ records }) => {
  const rows = howLossesEnd(records);
  const reasons = [...Object.keys(END_LABELS), 'other'].filter((k) => rows.some((r) => r.byReason[k]));
  const data = rows.map((r) => {
    const row: Record<string, number | string> = { name: `${r.timeClass} (${r.losses})` };
    for (const k of reasons) row[k] = r0(((r.byReason[k] ?? 0) / r.losses) * 100);
    return row;
  });
  return (
    <Card title="How your losses end" note="Share of losses, by time control">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 12, fill: '#374151' }} />
            <Tooltip formatter={(v: number, k: string) => [`${v}%`, END_LABELS[k] ?? 'Other']} />
            <Legend formatter={(k: string) => END_LABELS[k] ?? 'Other'} wrapperStyle={{ fontSize: 12 }} />
            {reasons.map((k) => (
              <Bar key={k} dataKey={k} stackId="a" fill={REASON_COLOURS[k]} radius={0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// ---------- 5. Opening leak table ----------

export const OpeningTable: React.FC<{ records: GameRecord[] }> = ({ records }) => {
  const rows = openingLeaks(records);
  const overall = tally(records).winRate;
  return (
    <Card title="Opening leak table" note={`Openings with ${MIN_OPENING_GAMES}+ games`}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">
          No opening has {MIN_OPENING_GAMES} or more games yet. Load more games to see this table.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-2 py-2 font-medium">Opening</th>
                <th className="px-2 py-2 font-medium">As</th>
                <th className="px-2 py-2 font-medium text-right">Games</th>
                <th className="px-2 py-2 font-medium text-right">Score</th>
                <th className="px-2 py-2 font-medium text-right">Vs overall</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.colour}-${r.opening}`} className={`border-t border-gray-100 ${r.leak ? 'bg-red-50/60' : ''}`}>
                  <td className="px-2 py-2 font-medium text-gray-800">{r.opening}</td>
                  <td className="px-2 py-2 text-gray-500 capitalize">{r.colour}</td>
                  <td className="px-2 py-2 text-right text-gray-500">{r.games}</td>
                  <td className="px-2 py-2 text-right font-semibold">{r0(r.winRate)}%</td>
                  <td className={`px-2 py-2 text-right font-semibold ${r.delta < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {r.delta > 0 ? '+' : ''}{r0(r.delta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-3 px-2">
            Score counts a draw as half a win. Overall: {r0(overall)}%. Red rows sit 10+ points below it.
          </p>
        </div>
      )}
    </Card>
  );
};

// ---------- 6. Clock trouble ----------

const Stat: React.FC<{ value: string; label: string; sub?: string; warn?: boolean }> = ({ value, label, sub, warn }) => (
  <div className="bg-gray-50 rounded-2xl p-4">
    <div className={`text-2xl font-bold tracking-tight ${warn ? 'text-amber-600' : 'text-gray-900'}`}>{value}</div>
    <div className="text-sm text-gray-600 font-medium mt-1">{label}</div>
    {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
  </div>
);

export const ClockCard: React.FC<{ records: GameRecord[] }> = ({ records }) => {
  const c = clockTrouble(records);
  return (
    <Card title="Clock trouble" note="Timed games only">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat
          value={`${r0(c.lossesOnTimePct)}%`}
          label="Losses on time"
          sub={`${c.lossesOnTime} games`}
          warn={c.lossesOnTimePct >= 20}
        />
        <Stat
          value={fmtSecs(c.clockAt30Loss)}
          label="Clock at move 30, losses"
          sub={`Wins: ${fmtSecs(c.clockAt30Win)}`}
        />
        <Stat
          value={c.panicMovesLoss.toFixed(1)}
          label="Moves under 10s, per loss"
          sub={`Per win: ${c.panicMovesWin.toFixed(1)}`}
          warn={c.panicMovesLoss > c.panicMovesWin * 1.5 && c.panicMovesLoss >= 2}
        />
      </div>
    </Card>
  );
};

// ---------- 7. Time of day and tilt ----------

export const TimeOfDay: React.FC<{ records: GameRecord[] }> = ({ records }) => {
  const overall = tally(records).winRate;
  const data = byTimeOfDay(records).map((b) => ({
    name: `${String(b.start).padStart(2, '0')}h`,
    label: b.label,
    winRate: b.games ? r0(b.winRate) : null,
    games: b.games,
  }));
  return (
    <Card title="Time of day" note="Your local time, 3-hour blocks">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -16, right: 8 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip
              formatter={(v: number, _k: string, p: { payload?: { games: number } }) => [`${v}% over ${p.payload?.games ?? 0} games`, 'Score']}
              labelFormatter={(_l, p) => (p?.[0]?.payload as { label?: string } | undefined)?.label ?? ''}
            />
            <ReferenceLine y={overall} stroke="#8b5cf6" strokeDasharray="4 4" />
            <Bar dataKey="winRate" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.games < 10 ? '#e5e7eb' : (d.winRate ?? 0) < overall - 8 ? '#ef4444' : '#8b5cf6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-2">Dashed line: your overall score. Grey bars have fewer than 10 games.</p>
    </Card>
  );
};

const TallyRow: React.FC<{ label: string; t: Tally; highlight?: boolean }> = ({ label, t, highlight }) => (
  <div>
    <div className="flex justify-between text-sm mb-1.5">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={`font-bold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
        {t.games ? `${r0(t.winRate)}%` : 'n/a'} <span className="text-gray-400 font-normal">({t.games})</span>
      </span>
    </div>
    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
      <div style={{ width: `${t.winRate}%` }} className={`h-full rounded-full ${highlight ? 'bg-red-400' : 'bg-violet-500'}`} />
    </div>
  </div>
);

export const TiltCard: React.FC<{ records: GameRecord[] }> = ({ records }) => {
  const t = tilt(records);
  const tilted = t.afterLoss.games >= 10 && t.afterWin.winRate - t.afterLoss.winRate >= 8;
  return (
    <Card title="Tilt check" note="Next game, same sitting">
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        <TallyRow label="After a win" t={t.afterWin} />
        <TallyRow label="After a loss" t={t.afterLoss} highlight={tilted} />
        <TallyRow label="After two losses in a row" t={t.afterTwoLosses} />
      </div>
      <p className="text-xs text-gray-400 mt-4">Counts games started within an hour of the previous one.</p>
    </Card>
  );
};

// ---------- 8. Rating gap ----------

export const RatingGapCard: React.FC<{ records: GameRecord[] }> = ({ records }) => {
  const rows = ratingGap(records);
  return (
    <Card title="Rating gap" note="Opponent vs you, at the time">
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {rows.map((r) => (
          <TallyRow key={r.key} label={r.label} t={r} highlight={r.key === 'lower' && r.games >= 10 && r.winRate < 60} />
        ))}
      </div>
    </Card>
  );
};
