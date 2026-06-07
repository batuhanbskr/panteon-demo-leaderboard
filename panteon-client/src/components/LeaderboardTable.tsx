import { PlayerRow } from "./PlayerRow";
import type { Player } from "../types";

function calcPrize(rank: number, pool: number, totalCount: number): number {
  if (pool === 0) return 0;
  if (rank === 1) return pool * 0.2;
  if (rank === 2) return pool * 0.15;
  if (rank === 3) return pool * 0.1;
  const n = totalCount - 3;
  if (n <= 0) return 0;
  const totalWeight = (n * (n + 1)) / 2;
  const w = n - (rank - 4);
  return w > 0 ? (pool * 0.55 * w) / totalWeight : 0;
}

export interface LeaderboardTableProps {
  players: Player[];
  prizePool: number;
  currentUserId: string;
}

export function LeaderboardTable({
  players,
  prizePool,
  currentUserId,
}: LeaderboardTableProps) {
  return (
    <div className="border border-slate-700/40 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="shrink-0 grid grid-cols-[3.5rem_1fr_6rem] sm:grid-cols-[3.5rem_1fr_7.5rem_9rem] px-4 py-2.5 bg-slate-900/80 border-b border-slate-700/60 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500 items-center">
        <div>Sıra</div>
        <div className="px-2">Oyuncu</div>
        <div className="text-right">Skor</div>
        <div className="text-right hidden sm:block">Ödül</div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
        {players.length === 0 ? (
          <div className="py-20 text-center font-mono text-slate-600 text-sm">
            — veri yok —
          </div>
        ) : (
          players.map((p) => (
            <PlayerRow
              key={p.userId}
              player={p}
              isCurrentUser={p.userId === currentUserId}
              prize={calcPrize(p.rank, prizePool, players.length)}
            />
          ))
        )}
      </div>
    </div>
  );
}
