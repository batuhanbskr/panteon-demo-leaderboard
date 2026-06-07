import redisClient from "../config/redis";

const LEADERBOARD_KEY = "leaderboard:week:current";
const PRIZE_POOL_KEY = "prizepool:week:current";

export function startChaosBot() {
  console.log("Simülasyon Botu Devrede! Yüksek hacimli veri basılıyor...");

  setInterval(async () => {
    try {
      const pipeline = redisClient.multi();
      let totalPoolContribution = 0;

      for (let i = 0; i < 100; i++) {
        const randomPlayerId = `player_${Math.floor(Math.random() * 10000)}`;

        const earnedMoney = Math.floor(Math.random() * 5000) + 100;

        pipeline.zIncrBy(LEADERBOARD_KEY, earnedMoney, randomPlayerId);

        totalPoolContribution += earnedMoney * 0.02;
      }

      pipeline.incrByFloat(PRIZE_POOL_KEY, totalPoolContribution);

      await pipeline.exec();
    } catch (error) {
      console.error("Bot hatası:", error);
    }
  }, 5000);
}
