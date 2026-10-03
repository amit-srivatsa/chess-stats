import { GameRecord, Colour } from './games';

// All functions are pure: records in, plain numbers out. Records are newest first.

export const MIN_GAMES_FOR_VERDICT = 30;
export const MIN_OPENING_GAMES = 10;

export interface Tally {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // 0 to 100, draws count as half
}

export function tally(records: GameRecord[]): Tally {
  const wins = records.filter((r) => r.outcome === 'win').length;
  const losses = records.filter((r) => r.outcome === 'loss').length;
  const draws = records.length - wins - losses;
  const winRate = records.length ? ((wins + draws / 2) / records.length) * 100 : 0;
  return { games: records.length, wins, losses, draws, winRate };
}

const pct = (n: number, d: number) => (d ? (n / d) * 100 : 0);

// ---------- 4. How losses end ----------

export const END_LABELS: Record<string, string> = {
  checkmated: 'Checkmated',
  resigned: 'Resigned',
  timeout: 'Lost on time',
  abandoned: 'Abandoned',
};

export interface LossEndRow {
  timeClass: string;
  losses: number;
  byReason: Record<string, number>; // reason -> count
}

export function howLossesEnd(records: GameRecord[]): LossEndRow[] {
  const losses = records.filter((r) => r.outcome === 'loss');
  const classes = [...new Set(losses.map((r) => r.timeClass))];
  return classes
    .map((timeClass) => {
      const group = losses.filter((r) => r.timeClass === timeClass);
      const byReason: Record<string, number> = {};
      for (const r of group) {
        const key = END_LABELS[r.endReason] ? r.endReason : 'other';
        byReason[key] = (byReason[key] ?? 0) + 1;
      }
      return { timeClass, losses: group.length, byReason };
    })
    .sort((a, b) => b.losses - a.losses);
}

// ---------- 5. Opening leak table ----------

export interface OpeningRow extends Tally {
  opening: string;
  colour: Colour;
  delta: number; // win rate minus overall, in points
  leak: boolean;
}

export function openingLeaks(records: GameRecord[], minGames = MIN_OPENING_GAMES): OpeningRow[] {
  const overall = tally(records).winRate;
  const groups = new Map<string, GameRecord[]>();
  for (const r of records) {
    const key = `${r.colour}|${r.opening}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()]
    .map(([key, group]) => {
      const [colour, opening] = key.split('|') as [Colour, string];
      const t = tally(group);
      const delta = t.winRate - overall;
      return { ...t, opening, colour, delta, leak: delta <= -10 };
    })
    .filter((row) => row.games >= minGames && row.opening !== 'Unknown')
    .sort((a, b) => a.delta - b.delta);
}

// ---------- 6. Clock trouble ----------

export interface ClockStats {
  lossesOnTime: number;
  lossesOnTimePct: number;
  /** Median seconds left at my move 30, losses vs wins (games that reached move 30). */
  clockAt30Loss: number | null;
  clockAt30Win: number | null;
  /** Average number of my moves played with under 10 seconds left, per game. */
  panicMovesLoss: number;
  panicMovesWin: number;
}

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function clockTrouble(records: GameRecord[]): ClockStats {
  const timed = records.filter((r) => r.baseSeconds !== null && r.myClocks.length);
  const losses = timed.filter((r) => r.outcome === 'loss');
  const wins = timed.filter((r) => r.outcome === 'win');
  const at30 = (g: GameRecord[]) =>
    median(g.filter((r) => r.myClocks.length >= 30).map((r) => r.myClocks[29]));
  const panic = (g: GameRecord[]) =>
    g.length ? g.reduce((n, r) => n + r.myClocks.filter((c) => c < 10).length, 0) / g.length : 0;
  const onTime = losses.filter((r) => r.endReason === 'timeout').length;
  return {
    lossesOnTime: onTime,
    lossesOnTimePct: pct(onTime, losses.length),
    clockAt30Loss: at30(losses),
    clockAt30Win: at30(wins),
    panicMovesLoss: panic(losses),
    panicMovesWin: panic(wins),
  };
}

// ---------- 7. Time of day and tilt ----------

export interface HourBlock extends Tally {
  label: string; // "18 to 21"
  start: number;
}

export function byTimeOfDay(records: GameRecord[], blockHours = 3): HourBlock[] {
  const blocks: HourBlock[] = [];
  for (let start = 0; start < 24; start += blockHours) {
    const group = records.filter((r) => r.hour >= start && r.hour < start + blockHours);
    const end = (start + blockHours) % 24;
    blocks.push({ ...tally(group), start, label: `${pad(start)}:00 to ${pad(end)}:00` });
  }
  return blocks;
}

const pad = (n: number) => String(n).padStart(2, '0');

export interface TiltStats {
  afterWin: Tally;
  afterLoss: Tally;
  afterTwoLosses: Tally;
}

/** Win rate in the next game, split by what happened in the previous one(s). */
export function tilt(records: GameRecord[], maxGapMinutes = 60): TiltStats {
  const chrono = [...records].sort((a, b) => a.endTime - b.endTime);
  const afterWin: GameRecord[] = [];
  const afterLoss: GameRecord[] = [];
  const afterTwo: GameRecord[] = [];
  for (let i = 1; i < chrono.length; i++) {
    const prev = chrono[i - 1];
    const cur = chrono[i];
    // Only count games played in the same sitting.
    if (cur.startDate.getTime() / 1000 - prev.endTime > maxGapMinutes * 60) continue;
    if (prev.outcome === 'win') afterWin.push(cur);
    if (prev.outcome === 'loss') {
      afterLoss.push(cur);
      if (i >= 2 && chrono[i - 2].outcome === 'loss') afterTwo.push(cur);
    }
  }
  return { afterWin: tally(afterWin), afterLoss: tally(afterLoss), afterTwoLosses: tally(afterTwo) };
}

// ---------- 8. Rating gap ----------

export interface GapRow extends Tally {
  label: string;
  key: 'lower' | 'even' | 'higher';
}

export function ratingGap(records: GameRecord[], band = 50): GapRow[] {
  const groups: Record<GapRow['key'], GameRecord[]> = { lower: [], even: [], higher: [] };
  for (const r of records) {
    const gap = r.oppRating - r.myRating;
    groups[gap < -band ? 'lower' : gap > band ? 'higher' : 'even'].push(r);
  }
  return [
    { key: 'lower', label: `Lower rated (${band}+ below)`, ...tally(groups.lower) },
    { key: 'even', label: `Within ${band} points`, ...tally(groups.even) },
    { key: 'higher', label: `Higher rated (${band}+ above)`, ...tally(groups.higher) },
  ];
}
