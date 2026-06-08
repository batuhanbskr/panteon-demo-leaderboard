export interface Player {
  rank: number;
  userId: string;
  score: number;
}

export interface LeaderboardResponse {
  prizePool: number;
  top100: Player[];
  currentUser: Player | null;
  surroundingPlayers: Player[];
  commentary?: string;
}

export interface AddScoreResponse {
  message: string;
}
