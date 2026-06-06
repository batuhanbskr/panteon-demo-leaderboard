import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL as string,
  socket: {
    tls: true, // Upstash için güvenli bağlantıyı zorunlu kılıyoruz
    rejectUnauthorized: false, // Yerel geliştirme ortamında sertifika hatalarını aşmak için
  },
});

redisClient.on("error", (err) => console.log("Redis Client Hatası", err));
redisClient.on("connect", () => console.log("Redis bağlantısı başarılı."));

redisClient.connect();

export default redisClient;
