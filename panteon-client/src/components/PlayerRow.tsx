import { memo } from "react";
import type { Player } from "../types";
import { useRankTrend } from "../hooks/useRankTrend";

export interface PlayerRowProps {
  player: Player;
  isCurrentUser: boolean;
  prize?: number;
  compact?: boolean;
}

export const PlayerRow = memo(function PlayerRow({
  player,
  isCurrentUser,
  prize,
  compact = false,
}: PlayerRowProps) {
  const rank = player.rank;
  const trend = useRankTrend(player.rank);

  const rowBg = isCurrentUser
    ? "row-me"
    : rank === 1
      ? "row-top1"
      : rank === 2
        ? "row-top2"
        : rank === 3
          ? "row-top3"
          : "hover:bg-white/[0.03] transition-colors";

  const rowBase = compact
    ? "grid grid-cols-[2.5rem_1fr_5.5rem] py-2 px-4"
    : "grid grid-cols-[3.5rem_1fr_6rem] sm:grid-cols-[3.5rem_1fr_7.5rem_9rem] py-2.5 px-4";

  const rankCell = () => {
    if (rank === 1)
      return <span className="text-2xl leading-none glow-gold">🥇</span>;
    if (rank === 2)
      return <span className="text-2xl leading-none glow-silver">🥈</span>;
    if (rank === 3)
      return <span className="text-2xl leading-none glow-bronze">🥉</span>;
    return (
      <span
        className={`text-xs font-mono tabular-nums font-semibold ${isCurrentUser ? "text-violet-400" : "text-slate-500"}`}
      >
        #{rank}
      </span>
    );
  };

  const nameColor = isCurrentUser
    ? "text-white font-semibold"
    : rank <= 3
      ? "text-white font-semibold"
      : "text-slate-200";

  const scoreColor = isCurrentUser
    ? "text-violet-300 glow-violet"
    : rank === 1
      ? "text-amber-300 glow-gold"
      : rank === 2
        ? "text-slate-300 glow-silver"
        : rank === 3
          ? "text-orange-300 glow-bronze"
          : "text-emerald-400";

  return (
    <div
      className={`${rowBase} items-center transition-all duration-700 overflow-hidden ${
        trend === "up"
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          : trend === "down"
            ? "bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            : rowBg
      }`}
    >
      <div className="flex items-center min-w-[40px]">
        {rankCell()}
        {trend === "up" && (
          <span className="text-emerald-400 text-[12px] font-black animate-bounce ml-1.5">
            ▲
          </span>
        )}
        {trend === "down" && (
          <span className="text-red-400 text-[12px] font-black animate-bounce ml-1.5">
            ▼
          </span>
        )}
      </div>

      <div
        className={`text-sm truncate px-2 transition-colors duration-700 ${
          trend === "up"
            ? "text-emerald-400 font-bold"
            : trend === "down"
              ? "text-red-400 font-bold"
              : nameColor
        }`}
      >
        {isCurrentUser && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-violet-400 mr-2 glow-violet">
            ▶ SEN
          </span>
        )}
        {player.userId}
      </div>

      <div
        className={`text-right text-sm font-mono tabular-nums font-semibold ${scoreColor}`}
      >
        {player.score.toLocaleString("tr-TR")}
      </div>

      {!compact && (
        <div className="text-right text-xs font-mono tabular-nums text-amber-400 hidden sm:block">
          {prize !== undefined && prize > 0
            ? `≈ ${prize.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺`
            : ""}
        </div>
      )}
    </div>
  );
});
