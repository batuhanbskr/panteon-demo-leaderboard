import cron from "node-cron";
import redisClient from "../config/redis";
import pool from "../config/postgres";

const LEADERBOARD_KEY = "leaderboard:week:current";
const PRIZE_POOL_KEY = "prizepool:week:current";

//4-100 arasi siralamalara gore dagitim
const calculateRemainingDistribution = (
  poolAmount: number,
  playerList: any[],
) => {
  const remainingPool = poolAmount * 0.55;
  const playerCount = playerList.length;

  if (playerCount === 0) return [];

  //n * (n + 1) / 2
  const totalWeight = (playerCount * (playerCount + 1)) / 2;

  const remainingDistribution = playerList.map((player, index) => {
    //Listedeki ilk kisi en yuksek agirligi alir
    const weight = playerCount - index;
    const reward = (remainingPool * weight) / totalWeight;

    return {
      userId: player.value,
      reward: parseFloat(reward.toFixed(2)), //Kusurat yuvarlama
    };
  });

  return remainingDistribution;
};

export const startWeeklyRewardCron = () => {
  //testten prod a gecerken 59 23 * * 0 (pazar 23.59) testte * * * * *
  cron.schedule("59 23 * * 0", async () => {
    console.log("Haftalık ödül dağıtımı başladı...");

    try {
      const prizePoolStr = await redisClient.get(PRIZE_POOL_KEY);
      const prizePool = prizePoolStr ? parseFloat(prizePoolStr) : 0;
      const top3Percentages = [0.2, 0.15, 0.1];

      if (prizePool === 0) {
        console.log("Ödül havuzu boş, dağıtım atlandı.");
        return;
      }

      const top100 = await redisClient.zRangeWithScores(
        LEADERBOARD_KEY,
        0,
        99,
        { REV: true },
      );

      if (top100.length === 0) return;

      const rewardsToDistribute = [];

      const topCount = Math.min(3, top100.length);

      for (let i = 0; i < topCount; i++) {
        rewardsToDistribute.push({
          userId: top100[i]!.value,
          reward: prizePool * top3Percentages[i]!,
        });
      }

      if (top100.length > 3) {
        const remainingPlayers = top100.slice(3);
        const remainingRewards = calculateRemainingDistribution(
          prizePool,
          remainingPlayers,
        );

        rewardsToDistribute.push(...remainingRewards);
      }

      //SOLID i eziyor olabilir ayri bir kisimda dbye kayit islemi yapilabilir
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const userIds = rewardsToDistribute.map((r) => r.userId);
        const rewards = rewardsToDistribute.map((r) => r.reward);

        //sorgu ai ile optimize edilmistir
        await client.query(
          `
            UPDATE users AS u
            SET wallet_balance = u.wallet_balance + data.reward
            FROM (
                SELECT 
                    UNNEST($1::varchar[]) AS username, 
                    UNNEST($2::numeric[])  AS reward
            ) AS data
            WHERE u.username = data.username
         `,
          [userIds, rewards],
        );

        await client.query("COMMIT");
      } catch (dbError) {
        await client.query("ROLLBACK");
        console.error(
          "Veritabanı işlemi başarısız, değişiklikler geri alındı:",
          dbError,
        );

        throw dbError;
      } finally {
        client.release();
      }

      //Tabloyu ve havuzu sifirlama
      await redisClient.del(LEADERBOARD_KEY);
      await redisClient.del(PRIZE_POOL_KEY);

      console.log("Leaderboard ve ödül havuzu yeni hafta için sıfırlandı!");
    } catch (error) {
      console.error("Haftalık Cron Job hatası:", error);
    }
  });
};
