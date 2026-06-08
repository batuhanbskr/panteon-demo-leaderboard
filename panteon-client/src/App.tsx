import { useState, useEffect } from "react";
import { leaderboardApi } from "./services/api";
import type { LeaderboardResponse } from "./types";
import { Header } from "./components/Header";
import { LeaderboardTable } from "./components/LeaderboardTable";
import { StickyRankBar } from "./components/StickyRankBar";

export default function App() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("player_3665");
  const top100 = data?.top100 ?? [];

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        if (!document.hidden) {
          const result = await leaderboardApi.getLeaderboard(currentUserId);
          if (mounted) {
            setData(result);
            setHasError(false);
          }
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        if (mounted) setHasError(true);
      } finally {
        if (mounted) setInitialLoad(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [currentUserId]);

  if (initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-sm tracking-widest uppercase animate-pulse">
          Yükleniyor...
        </p>
      </div>
    );
  }

  const errorMessage = hasError && (
    <div className="fixed top-4 right-4 bg-red-500/80 text-white px-3 py-1 rounded text-xs z-50">
      Bağlantı sorunu...
    </div>
  );

  const isInTop100 = top100.some((p) => p.userId === currentUserId) ?? false;
  const topPlayerId = top100[0]?.userId;
  const lastPlayerId = top100?.[top100.length - 1]?.userId;
  const aiComment = data?.commentary;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#0f172a]">
      {errorMessage}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-4 sm:pt-8 pb-20 w-full flex flex-col flex-1 min-h-0 relative z-10">
        <div className="shrink-0">
          <Header
            prizePool={data?.prizePool ?? 0}
            isLive
            currentUserId={currentUserId}
            onUserChange={setCurrentUserId}
            topPlayerId={topPlayerId}
            lastPlayerId={lastPlayerId}
            commentary={aiComment}
          />
        </div>
        <div className="flex-1 min-h-0 flex flex-col pb-4">
          <LeaderboardTable
            players={data?.top100 ?? []}
            prizePool={data?.prizePool ?? 0}
            currentUserId={currentUserId}
          />
        </div>
      </div>

      {!isInTop100 &&
        data?.currentUser &&
        data.surroundingPlayers.length > 0 && (
          <StickyRankBar
            currentUser={data.currentUser}
            surroundingPlayers={data.surroundingPlayers}
            currentUserId={currentUserId}
          />
        )}
    </div>
  );
}
