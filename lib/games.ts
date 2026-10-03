import { Chess } from 'chess.js';
import { ChessGame } from '../types';

export type Outcome = 'win' | 'loss' | 'draw';
export type Colour = 'white' | 'black';

/** One flat record per game, from the player's point of view. */
export interface GameRecord {
  id: string;
  url: string;
  endTime: number; // unix seconds
  startDate: Date; // local time of the browser
  hour: number; // 0 to 23, local
  timeClass: string; // bullet, blitz, rapid, daily
  baseSeconds: number | null; // starting clock, null for daily
  colour: Colour;
  outcome: Outcome;
  endReason: string; // checkmated, resigned, timeout, abandoned, agreed, repetition...
  opening: string; // family, e.g. "Sicilian Defense"
  openingFull: string; // full Chess.com name
  myRating: number;
  oppRating: number;
  oppName: string;
  moveCount: number; // full moves
  myClocks: number[]; // seconds left after each of my moves
  pgn: string;
}

const DRAW_CODES = new Set([
  'agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient',
]);

const FAMILY_ENDINGS = ['Defense', 'Opening', 'Game', 'Gambit', 'Attack', 'System'];

/** "Sicilian-Defense-Najdorf-Variation-6.Be3" -> "Sicilian Defense" */
export function openingFamily(ecoUrl?: string): { family: string; full: string } {
  if (!ecoUrl) return { family: 'Unknown', full: 'Unknown' };
  const slug = decodeURIComponent(ecoUrl.split('/openings/')[1] ?? '');
  const words = slug.split('-').filter((w) => w && !/\d/.test(w) && !w.includes('...'));
  const full = words.join(' ') || 'Unknown';
  const end = words.findIndex((w) => FAMILY_ENDINGS.includes(w));
  const family = end >= 0 ? words.slice(0, end + 1).join(' ') : words.slice(0, 2).join(' ');
  return { family: family || 'Unknown', full };
}

function header(pgn: string, name: string): string | undefined {
  const m = pgn.match(new RegExp(`\\[${name} "([^"]*)"\\]`));
  return m?.[1];
}

function parseClock(s: string): number {
  const parts = s.split(':').map(Number);
  return parts.reduce((acc, v) => acc * 60 + v, 0);
}

/** Starting clock in seconds from "180+2"; daily games ("1/86400") return null. */
export function baseSecondsOf(timeControl: string): number | null {
  if (timeControl.includes('/')) return null;
  const base = Number(timeControl.split('+')[0]);
  return Number.isFinite(base) ? base : null;
}

export function toRecord(game: ChessGame, username: string): GameRecord | null {
  if (game.rules !== 'chess' || !game.pgn) return null;
  const user = username.toLowerCase();
  const colour: Colour = game.white.username.toLowerCase() === user ? 'white' : 'black';
  const me = game[colour];
  const opp = colour === 'white' ? game.black : game.white;

  const outcome: Outcome =
    me.result === 'win' ? 'win' : DRAW_CODES.has(me.result) ? 'draw' : 'loss';
  const endReason = outcome === 'loss' ? me.result : outcome === 'win' ? opp.result : me.result;

  // Start time: UTCDate + UTCTime headers, else fall back to end_time.
  const utcDate = header(game.pgn, 'UTCDate');
  const utcTime = header(game.pgn, 'UTCTime') ?? header(game.pgn, 'StartTime');
  const startDate =
    utcDate && utcTime
      ? new Date(`${utcDate.replace(/\./g, '-')}T${utcTime}Z`)
      : new Date(game.end_time * 1000);

  // Clocks: every {[%clk h:mm:ss]} in move order; mine are even (white) or odd (black).
  const clocks = [...game.pgn.matchAll(/\[%clk ([\d:.]+)\]/g)].map((m) => parseClock(m[1]));
  const myClocks = clocks.filter((_, i) => (i % 2 === 0) === (colour === 'white'));

  const { family, full } = openingFamily(game.eco);

  return {
    id: game.uuid || game.url,
    url: game.url,
    endTime: game.end_time,
    startDate,
    hour: startDate.getHours(),
    timeClass: game.time_class,
    baseSeconds: baseSecondsOf(game.time_control),
    colour,
    outcome,
    endReason,
    opening: family,
    openingFull: full,
    myRating: me.rating,
    oppRating: opp.rating,
    oppName: opp.username,
    moveCount: Math.ceil(clocks.length / 2),
    myClocks,
    pgn: game.pgn,
  };
}

export function toRecords(games: ChessGame[], username: string): GameRecord[] {
  return games
    .map((g) => toRecord(g, username))
    .filter((r): r is GameRecord => r !== null)
    .sort((a, b) => b.endTime - a.endTime); // newest first
}

export interface PlyInfo {
  san: string;
  fenBefore: string;
  fenAfter: string;
  ply: number; // 1-based half-move number
}

/** Full move list with positions, parsed with chess.js. Used by the engine view. */
export function plies(pgn: string): PlyInfo[] {
  const chess = new Chess();
  chess.loadPgn(pgn);
  return chess.history({ verbose: true }).map((m, i) => ({
    san: m.san,
    fenBefore: m.before,
    fenAfter: m.after,
    ply: i + 1,
  }));
}
