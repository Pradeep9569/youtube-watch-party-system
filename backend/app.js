
import express from "express";
import cors from "cors";

import roomRoutes from "./routes/room.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://youtube-watch-party-system-weld.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/rooms", roomRoutes);

export default app;
