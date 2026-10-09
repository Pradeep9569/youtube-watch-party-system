
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import registerSocketHandlers from "./socket/socketHandler.js";
import authRoutes from "./routes/authRoutes.js";

app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "YouTube Watch Party Backend is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

const server = http.createServer(app);

const clientUrl =
  process.env.CLIENT_URL?.trim() || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    credentials: true,
  },
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 4001;

async function startServer() {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();