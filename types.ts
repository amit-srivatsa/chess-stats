export interface ChessPlayerProfile {
  avatar?: string;
  player_id: number;
  id: string; // URL id
  url: string;
  name?: string;
  username: string;
  followers: number;
  country: string;
  last_online: number;
  joined: number;
  status: string;
  is_streamer: boolean;
  title?: string;
  location?: string;
}

export interface RatingStat {
  rating: number;
  date: number;
  rd?: number;
  best?: {
    rating: number;
    date: number;
    game: string;
  };
  record?: {
    win: number;
    loss: number;
    draw: number;
  };
}

export interface ChessPlayerStats {
  chess_daily?: {
    last: RatingStat;
    best: RatingStat;
    record: RatingStat['record'];
  };
  chess_rapid?: {
    last: RatingStat;
    best: RatingStat;
    record: RatingStat['record'];
  };
  chess_bullet?: {
    last: RatingStat;
    best: RatingStat;
    record: RatingStat['record'];
  };
  chess_blitz?: {
    last: RatingStat;
    best: RatingStat;
    record: RatingStat['record'];
  };
  fide?: number;
  tactics?: {
    highest: { rating: number; date: number };
    lowest: { rating: number; date: number };
  };
  puzzle_rush?: {
    best: { total_attempts: number; score: number };
  };
}

export interface ChessGamePlayer {
  rating: number;
  result: string;
  username: string;
  id: string;
  uuid: string;
}

export interface ChessGame {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  tcn: string;
  uuid: string;
  initial_setup: string;
  fen: string;
  time_class: string;
  rules: string;
  white: ChessGamePlayer;
  black: ChessGamePlayer;
}

export interface ArchivesResponse {
  archives: string[];
}

export interface GamesResponse {
  games: ChessGame[];
}

export type GameMode = 'chess_rapid' | 'chess_blitz' | 'chess_bullet' | 'chess_daily';

export interface DashboardData {
  profile: ChessPlayerProfile | null;
  stats: ChessPlayerStats | null;
  games: ChessGame[];
}