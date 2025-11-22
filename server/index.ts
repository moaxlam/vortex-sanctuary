import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleWeather } from "./routes/weather";
import { handleClimate } from "./routes/climate";
import { handleGemini } from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/weather", handleWeather);
  app.get("/api/climate", handleClimate);
  app.post("/api/chat/gemini", handleGemini);

  return app;
}
