import { GoogleGenerativeAI } from "@google/generative-ai";
import redisClient from "../config/redis";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const LEADERBOARD_KEY = "leaderboard:week:current";
const COMMENTARY_KEY = "leaderboard:commentary";

export function startAiCommentator() {
  const runCommentator = async () => {
    try {
      const top3 = await redisClient.zRangeWithScores(LEADERBOARD_KEY, 0, 2, {
        REV: true,
      });
      
      if (top3.length < 2) return;

      const prompt = `Sen Türkiye'nin en coşkulu, doğal konuşan ve profesyonel e-spor spikerisin. 
      Şu anki Liderlik Tablosu:
      1. ${top3[0]?.value} (${top3[0]?.score} Puan)
      2. ${top3[1]?.value} (${top3[1]?.score} Puan)
      3. ${top3[2]?.value || "Bilinmiyor"} (${top3[2]?.score || 0} Puan)
      
      KURAL 1: Tablodaki duruma bakarak aralarındaki rekabeti SADECE 1 CÜMLE ile özetle.
      KURAL 2: Kesinlikle devrik cümle kurma! Türkçe dil bilgin kusursuz olsun.
      KURAL 3: Sadece spikerin ağzından çıkan sözü yaz. Tırnak işareti, giriş veya ekstra açıklama kullanma.
      
      Örnek tarz: ${top3[0]?.value} zirveyi domine ederken, hemen arkasındaki ${top3[1]?.value} farkı kapatmak için nefes aldırmıyor!`;

      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let commentary = response.text().trim();

      commentary = commentary.replace(/^"|"$/g, "");

      await redisClient.setEx(COMMENTARY_KEY, 60, commentary);
    } catch (error) {
      console.error("Gemini AI Spiker Hatası:", error);
    }
  };

  runCommentator();
  setInterval(runCommentator, 30000);
}
