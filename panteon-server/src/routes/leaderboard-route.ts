import { Router } from "express";
import redisClient from "../config/redis";
import pool from "../config/postgres";

const router = Router();

const LEADERBOARD_KEY = "leaderboard:week:current";
const PRIZE_POOL_KEY = "prizepool:week:current";

//Score ve havuzun güncellenmesi
router.post("/score", async (req, res) => {
  try {
    const { userId, earnedMoney } = req.body;

    if (!userId || !earnedMoney) {
      return res
        .status(400)
        .json({ error: "userId ve earnedMoney zorunludur!" });
    }

    // Skoru güncellenmesi
    await redisClient.zIncrBy(LEADERBOARD_KEY, earnedMoney, String(userId));

    // Havuzun güncellenmesi
    const poolContribution = earnedMoney * 0.02;
    await redisClient.incrByFloat(PRIZE_POOL_KEY, poolContribution);

    res.json({ message: "Puan eklendi ve havuz güncellendi" });
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//Liderlik tablosunu getirme
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const prizePoolStr = await redisClient.get(PRIZE_POOL_KEY);
    const prizePool = prizePoolStr ? parseFloat(prizePoolStr) : 0;

    const top100Row = await redisClient.zRangeWithScores(
      LEADERBOARD_KEY,
      0,
      99,
      {
        REV: true,
      },
    );

    const top100 = top100Row.map((item, index) => ({
      rank: index + 1,
      userId: item.value,
      score: item.score,
    }));

    const isUserInTop100 = top100.some((u) => u.userId === String(userId));
    let currentUserData = null;
    let surroundingPlayers: any[] = [];

    if (!isUserInTop100) {
      const userRankIndex = await redisClient.zRevRank(
        LEADERBOARD_KEY,
        String(userId),
      );

      if (userRankIndex !== null) {
        const userScore = await redisClient.zScore(
          LEADERBOARD_KEY,
          String(userId),
        );

        currentUserData = {
          rank: userRankIndex + 1,
          userId: String(userId),
          score: userScore ?? 0,
        };

        // 3 üst ve 2 alt oyuncuyu getirmek için başlangıç pozisyonunu hesaplıyoruz.
        const startPlayer = Math.max(100, userRankIndex - 3);
        const endPlayer = userRankIndex + 2;

        const surroundingRaw = await redisClient.zRangeWithScores(
          LEADERBOARD_KEY,
          startPlayer,
          endPlayer,
          {
            REV: true,
          },
        );

        surroundingPlayers = surroundingRaw.map((item, index) => ({
          rank: startPlayer + index + 1,
          userId: item.value,
          score: item.score,
        }));
      }
    }

    const commentary = await redisClient.get("leaderboard:commentary");

    res.json({
      prizePool,
      top100,
      currentUser: currentUserData,
      surroundingPlayers,
      commentary,
    });
  } catch (error) {
    console.error("Leaderboard getirme hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//Mock Data olusturma
router.post("/seed", async (req, res) => {
  try {
    const { count = 10000 } = (req.body ?? {}) as { count?: number }; // Body gelmezse default değerle devam et

    await redisClient.del(LEADERBOARD_KEY);
    await redisClient.del(PRIZE_POOL_KEY);

    let totalPrize = 0;

    // İşlemleri hızlı yapmak için Redis pipeline (çoklu komut) kullanıyoruz
    const multi = redisClient.multi();

    for (let i = 1; i <= count; i++) {
      const userId = `player_${i}`;
      // 100 ile 50.000 arası rastgele skor
      const score = Math.floor(Math.random() * 50000) + 100;

      totalPrize += score * 0.02;

      multi.zAdd(LEADERBOARD_KEY, { score, value: userId });
    }

    multi.set(PRIZE_POOL_KEY, totalPrize.toString());

    await multi.exec();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`
        INSERT INTO users (username, wallet_balance)
        SELECT 'player_' || i, 0 FROM generate_series(1, 10000) i
        ON CONFLICT (username) DO NOTHING;
      `);
      await client.query(
        `INSERT INTO users (username, wallet_balance) VALUES ('player_150', 0) ON CONFLICT DO NOTHING;`,
      );
      await client.query("COMMIT");
    } catch (dbErr) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }

    res.json({
      message: `Başarıyla ${count} adet rastgele oyuncu oluşturuldu!`,
    });
  } catch (error) {
    console.error("Seed hatası:", error);
    res.status(500).json({ error: "Örnek veri oluşturulamadı." });
  }
});

export default router;
