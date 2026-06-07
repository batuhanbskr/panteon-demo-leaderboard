import { useState, useEffect, useRef } from "react";

type Trend = "up" | "down" | null;

export function useRankTrend(currentRank?: number): Trend {
  const [trend, setTrend] = useState<Trend>(null);
  const prevRankRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentRank === undefined) return;

    if (prevRankRef.current !== null) {
      if (currentRank < prevRankRef.current) {
        setTrend("up");
      } else if (currentRank > prevRankRef.current) {
        setTrend("down");
      }

      const timer = setTimeout(() => setTrend(null), 3500);

      return () => clearTimeout(timer);
    }

    prevRankRef.current = currentRank;
  }, [currentRank]);

  return trend;
}
