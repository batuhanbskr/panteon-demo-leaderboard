import { useState } from "react";
import { PlayerRow } from "./PlayerRow";
import type { Player } from "../types";

export interface StickyRankBarProps {
  currentUser: Player;
  surroundingPlayers: Player[];
  currentUserId: string;
}

export function StickyRankBar({
  currentUser,
  surroundingPlayers,
  currentUserId,
}: StickyRankBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#080c18]/96 backdrop-blur-xl border-t border-slate-700/60">
      <div className="max-w-3xl mx-auto">
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="divide-y divide-slate-800/80 border-b border-slate-700/40">
              {surroundingPlayers.map((p) => (
                <PlayerRow
                  key={p.userId}
                  player={p}
                  isCurrentUser={p.userId === currentUserId}
                  compact
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
        >
          <span className="hidden sm:inline-block text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 shrink-0">
            Senin sıran
          </span>
          <span className="font-mono text-xs text-slate-300 truncate flex-1">
            {currentUser.userId}
          </span>
          <span className="font-mono text-sm font-bold text-violet-400 tabular-nums shrink-0 glow-violet">
            #{currentUser.rank}
          </span>
          <span className="font-mono text-xs text-emerald-400 tabular-nums shrink-0">
            {currentUser.score.toLocaleString("tr-TR")}
          </span>
          <span
            className={`text-slate-500 text-[10px] shrink-0 select-none transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ▲
          </span>
        </button>
      </div>
    </div>
  );
}
