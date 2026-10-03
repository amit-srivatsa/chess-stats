import { 
  ChessPlayerProfile, 
  ChessPlayerStats, 
  ArchivesResponse, 
  GamesResponse,
  ChessGame 
} from '../types';
import { cacheGet, cacheSet } from '../lib/cache';

const BASE_URL = 'https://api.chess.com/pub';

export async function getProfile(username: string): Promise<ChessPlayerProfile> {
  const response = await fetch(`${BASE_URL}/player/${username}`);
  if (!response.ok) {
    throw new Error('Player not found');
  }
  return response.json();
}

export async function getStats(username: string): Promise<ChessPlayerStats> {
  const response = await fetch(`${BASE_URL}/player/${username}/stats`);
  if (!response.ok) {
    throw new Error('Stats not found');
  }
  return response.json();
}

export async function getRecentGames(username: string): Promise<ChessGame[]> {
  // 1. Get list of archives (monthly buckets)
  const archivesRes = await fetch(`${BASE_URL}/player/${username}/games/archives`);
  if (!archivesRes.ok) {
    // If no archives, return empty or throw depending on strategy. Return empty for safety.
    return [];
  }
  const archivesData: ArchivesResponse = await archivesRes.json();
  
  if (archivesData.archives.length === 0) {
    return [];
  }

  // 2. Fetch the most recent archive
  // The API returns them in chronological order, so the last one is the latest.
  const latestArchiveUrl = archivesData.archives[archivesData.archives.length - 1];
  
  const gamesRes = await fetch(latestArchiveUrl);
  if (!gamesRes.ok) {
    return [];
  }
  
  const gamesData: GamesResponse = await gamesRes.json();
  
  // Return games reversed (newest first)
  return gamesData.games.reverse();
}
export interface LoadProgress {
  months: number;
  games: number;
  fromCache: number;
}

const MAX_MONTHS_BACK = 36;

/**
 * Walk the monthly archives backward, one request at a time, until `target`
 * standard chess games are loaded. Past months are cached in IndexedDB for
 * good; the current month is always refetched.
 */
export async function getGamesBackwards(
  username: string,
  target: number,
  onProgress?: (p: LoadProgress) => void,
): Promise<ChessGame[]> {
  const user = username.toLowerCase();
  const archivesRes = await fetch(`${BASE_URL}/player/${user}/games/archives`);
  if (!archivesRes.ok) throw new Error('Archives not found');
  const { archives }: ArchivesResponse = await archivesRes.json();

  const now = new Date();
  const currentKey = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  const collected: ChessGame[] = [];
  const progress: LoadProgress = { months: 0, games: 0, fromCache: 0 };

  for (let i = archives.length - 1; i >= 0 && progress.months < MAX_MONTHS_BACK; i--) {
    const url = archives[i];
    const monthKey = url.split('/games/')[1]; // "yyyy/mm"
    const cacheKey = `${user}/${monthKey}`;
    const isCurrent = monthKey === currentKey;

    let games = isCurrent ? undefined : await cacheGet<ChessGame[]>(cacheKey);
    if (games) {
      progress.fromCache++;
    } else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Could not load ${monthKey} (HTTP ${res.status})`);
      games = ((await res.json()) as GamesResponse).games;
      await cacheSet(cacheKey, games);
    }

    // Newest first, standard chess only.
    collected.push(...games.filter((g) => g.rules === 'chess').reverse());
    progress.months++;
    progress.games = collected.length;
    onProgress?.({ ...progress });
    if (collected.length >= target) break;
  }

  return collected.slice(0, target);
}
