import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import leaderboardRoutes from "./routes/leaderboard-route";
import { startWeeklyRewardCron } from "./jobs/weeklyReward";
import { startChaosBot } from "./jobs/simulationBot";
import { startAiCommentator } from "./jobs/aiCommentador";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("Panteon Leaderboard API");
});

app.listen(PORT, async () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);

  //CRON u cagirdik
  startWeeklyRewardCron();
  startChaosBot();
  startAiCommentator();
});
