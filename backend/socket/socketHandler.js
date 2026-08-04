import Room from "../models/Room.js";
import { canControl } from "./permision.js";
import {
    addUser,
    removeUser,
    getUser,
    updateRole
} from "./roomManger.js";

export default function registerSocketHandlers(io) {
    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        socket.on("join_room", async ({ roomCode, username }) => {
            const room = await Room.findOne({ roomCode });

            if (!room) {
                socket.emit("error_message", {
                    message: "Room not found"
                });
                return;
            }

            socket.join(roomCode);

            let participant = room.participants.find(
                (p) => p.username === username
            );

            if (!participant) {
                participant = {
                    username,
                    socketId: socket.id,
                    role: "participant"
                };
                room.participants.push(participant);
            } else {
                participant.socketId = socket.id;
            }

            await room.save();

            addUser(socket.id, {
                roomCode,
                username,
                role: participant.role
            });

            socket.on("typing", ({ roomCode, username }) => {

          socket.to(roomCode).emit("typing", {
          username,
         });

        });

            socket.on("send_message" , ({roomCode , username , text}) => {

                io.to(roomCode).emit("chat_message" , {
                 username,
                 text,
                 time:Date.now() ,

                });
            });

            socket.emit("sync_state", {
                videoId: room.videoId,
                currentTime: room.currentTime,
                isPlaying: room.isPlaying,
                role: participant.role,
                participants: room.participants
            });

            io.to(roomCode).emit("user_joined", {
                username,
                participants: room.participants
            });
        });

        socket.on("disconnect", async () => {
            const user = getUser(socket.id);

            if (user) {
                const room = await Room.findOne({ roomCode: user.roomCode });

                io.to(user.roomCode).emit("user_left", {
                    username: user.username,
                    participants: room?.participants || []
                });

                removeUser(socket.id);
            }

            console.log("Disconnected:", socket.id);
        });

        socket.on("play", async ({ roomCode }) => {
            const user = getUser(socket.id);

            if (!user || !canControl(user.role)) {
                socket.emit("permission_denied");
                return;
            }

            const room = await Room.findOne({ roomCode });
            if (!room) return;

            room.isPlaying = true;
            await room.save();

            socket.to(roomCode).emit("play");
        });

        socket.on("pause", async ({ roomCode }) => {
            const user = getUser(socket.id);

            if (!user || !canControl(user.role)) {
                socket.emit("permission_denied");
                return;
            }

            const room = await Room.findOne({ roomCode });
            if (!room) return;

            room.isPlaying = false;
            await room.save();

            socket.to(roomCode).emit("pause");
        });

        socket.on("seek", async ({ roomCode, currentTime }) => {
            const room = await Room.findOne({ roomCode });
            if (!room) return;

            room.currentTime = currentTime;
            await room.save();

            socket.to(roomCode).emit("seek", {
                currentTime
            });
        });

        socket.on("change_video", async ({ roomCode, videoId }) => {
            const room = await Room.findOne({ roomCode });
            if (!room) return;

            room.videoId = videoId;
            room.currentTime = 0;
            room.isPlaying = false;
            await room.save();

            io.to(roomCode).emit("change_video", {
                videoId
            });
        });

        socket.on("assign_role", async ({ roomCode, username, role }) => {
            const sender = getUser(socket.id);
            if (!sender || sender.role !== "host") {
                socket.emit("permission_denied");
                return;
            }

            const room = await Room.findOne({ roomCode });
            if (!room) return;

            const participant = room.participants.find(
                (p) => p.username === username
            );
            if (!participant) return;

            participant.role = role;
            await room.save();

            if (participant.socketId) {
                updateRole(participant.socketId, role);
            }

            io.to(roomCode).emit("role_assigned", {
                username,
                role,
                participants: room.participants
            });
        });

        socket.on("remove_participant", async ({ roomCode, username }) => {
            const sender = getUser(socket.id);
            if (!sender || sender.role !== "host") {
                socket.emit("permission_denied");
                return;
            }

            const room = await Room.findOne({ roomCode });
            if (!room) return;

            const participant = room.participants.find(
                (p) => p.username === username
            );
            if (!participant) return;

            room.participants = room.participants.filter(
                (p) => p.username !== username
            );
            await room.save();

            if (participant.socketId) {
                io.to(participant.socketId).emit("removed_from_room");
            }

            io.to(roomCode).emit("participant_removed", {
                username,
                participants: room.participants
            });
        });
    });
}
