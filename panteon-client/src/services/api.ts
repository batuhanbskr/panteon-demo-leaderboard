import type { LeaderboardResponse, AddScoreResponse } from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5001/api';

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  return response.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

export const leaderboardApi = {
  getLeaderboard: (userId: string) =>
    get<LeaderboardResponse>(`/leaderboard/${userId}`),

  addScore: (userId: string, earnedMoney: number) =>
    post<AddScoreResponse>('/leaderboard/score', { userId, earnedMoney }),
};