import { 
  ChessPlayerProfile, 
  ChessPlayerStats, 
  ArchivesResponse, 
  GamesResponse,
  ChessGame 
} from '../types';

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