import { GameRecord } from './games';
import {
  tally, howLossesEnd, openingLeaks, clockTrouble, byTimeOfDay, tilt, ratingGap,
  MIN_GAMES_FOR_VERDICT,
} from './stats';

export interface Finding {
  key: string;
  headline: string; // one sentence for the top of the page and the card
  detail: string; // the numbers behind it
  score: number; // how far from normal, in points; highest wins
}

const r0 = (n: number) => Math.round(n);

/**
 * Rules-based verdict. Each rule proposes at most one finding with a score
 * (roughly: points of win rate or share above normal). No model, no guessing.
 */
export function findings(records: GameRecord[]): Finding[] {
  const out: Finding[] = [];
  const overall = tally(records);

  // Clock: share of losses on time, per time control.
  for (const row of howLossesEnd(records)) {
    const onTime = row.byReason.timeout ?? 0;
    const share = (onTime / row.losses) * 100;
    if (row.losses >= 8 && share >= 20) {
      out.push({
        key: `clock-${row.timeClass}`,
        headline: `${r0(share)}% of your ${row.timeClass} losses are on time.`,
        detail: `${onTime} of ${row.losses} ${row.timeClass} losses ended with your flag falling.`,
        score: share * Math.min(1, row.losses / 20), // small samples count for less
      });
    }
  }

  // Resigning or mated: if most losses are resignations, the game was gone well before the end.
  const losses = records.filter((r) => r.outcome === 'loss');
  const resigned = losses.filter((r) => r.endReason === 'resigned').length;
  if (losses.length >= 10 && resigned / losses.length >= 0.6) {
    const share = (resigned / losses.length) * 100;
    out.push({
      key: 'resign',
      headline: `${r0(share)}% of your losses end in resignation, not on the clock.`,
      detail: `${resigned} of ${losses.length} losses. The clock is not the problem; the position is lost well before the end.`,
      score: share - 50,
    });
  }

  // Openings: the worst line with enough games.
  const worst = openingLeaks(records)[0];
  if (worst && worst.leak) {
    out.push({
      key: `opening-${worst.colour}-${worst.opening}`,
      headline: `As ${worst.colour === 'white' ? 'White' : 'Black'}, the ${worst.opening} costs you ${r0(-worst.delta)} points of win rate.`,
      detail: `${r0(worst.winRate)}% over ${worst.games} games, against ${r0(overall.winRate)}% overall.`,
      score: -worst.delta,
    });
  }

  // Tilt: the game after a loss.
  const t = tilt(records);
  const tiltGap = t.afterWin.winRate - t.afterLoss.winRate;
  if (t.afterLoss.games >= 10 && tiltGap >= 8) {
    out.push({
      key: 'tilt',
      headline: `After a loss, your next game drops to ${r0(t.afterLoss.winRate)}% wins.`,
      detail: `${r0(t.afterWin.winRate)}% after a win, ${r0(t.afterLoss.winRate)}% after a loss (${t.afterLoss.games} games).`,
      score: tiltGap,
    });
  }

  // Time of day: worst block with enough games.
  const blocks = byTimeOfDay(records).filter((b) => b.games >= 10);
  const worstBlock = [...blocks].sort((a, b) => a.winRate - b.winRate)[0];
  if (worstBlock && overall.winRate - worstBlock.winRate >= 8) {
    out.push({
      key: 'hour',
      headline: `From ${worstBlock.label}, your win rate falls to ${r0(worstBlock.winRate)}%.`,
      detail: `${worstBlock.games} games in that window, against ${r0(overall.winRate)}% overall.`,
      score: overall.winRate - worstBlock.winRate,
    });
  }

  // Rating gap: losing to lower rated players.
  const lower = ratingGap(records).find((g) => g.key === 'lower');
  if (lower && lower.games >= 10 && lower.winRate < 60) {
    out.push({
      key: 'gap',
      headline: `Against lower rated players you win only ${r0(lower.winRate)}% of games.`,
      detail: `${lower.losses} losses in ${lower.games} games against players 50+ points below you.`,
      score: 60 - lower.winRate,
    });
  }

  // Clock at move 30 compared with wins.
  const c = clockTrouble(records);
  if (c.clockAt30Loss !== null && c.clockAt30Win !== null && c.clockAt30Win - c.clockAt30Loss >= 15) {
    out.push({
      key: 'clock30',
      headline: `In losses you reach move 30 with ${r0(c.clockAt30Loss)} seconds left; in wins, ${r0(c.clockAt30Win)}.`,
      detail: 'Median clock after your 30th move, games that got that far.',
      score: (c.clockAt30Win - c.clockAt30Loss) / 3,
    });
  }

  return out.sort((a, b) => b.score - a.score);
}

export interface Verdict {
  enough: boolean;
  main: Finding | null;
  others: Finding[];
}

export function verdict(records: GameRecord[]): Verdict {
  if (records.length < MIN_GAMES_FOR_VERDICT) return { enough: false, main: null, others: [] };
  const all = findings(records);
  return { enough: true, main: all[0] ?? null, others: all.slice(1, 4) };
}
