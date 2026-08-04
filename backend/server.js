import dotenv from "dotenv";

dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import registerSocketHandlers from "./socket/socketHandler.js";

connectDB();

const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL?.trim() || "http://localhost:5173";

const io = new Server(server, {
   cors: {
    origin: clientUrl,
    credentials: true
   }
});

registerSocketHandlers(io);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(` Server is running at http://localhost:${PORT}`);
});