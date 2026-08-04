import {randomUUID} from "crypto";
import Room from "../models/Room.js";

export const createRoom = async(req , res) => {

    try {
        const {username} = req.body;

        if(!username) {
            return res.status(400).json({
                message: "Username is required"
            });
        }

        const roomCode = randomUUID().slice(0 , 6).toUpperCase();

        const room = await Room.create({
            roomCode,
            host: username ,
         
            participants: [
                {
                    username,
                    role:"host"
                }
            ]

        });

        res.status(201).json(room);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }

};

export const joinRoom = async (req , res) => {
    try {
        const {roomCode , username } = req.body;

        const room = await Room.findOne({roomCode});

        if(!room) {
            return res.status(404).json({
                message:"Room not found"
            });
        }

        room.participants.push({
            username,
            role:"participant"
        });

        await room.save();

        res.json(room);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}