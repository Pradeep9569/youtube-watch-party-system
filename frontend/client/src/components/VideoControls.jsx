import { useContext, useState } from "react";
import { SocketContext } from "./context/SocketContext";

function getYouTubeVideoId(input) {
    if (!input) return null;
    const trimmed = input.trim();

    // Raw ID
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }

    try {
        const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
        const hostname = url.hostname.replace("www.", "");

        if (hostname === "youtu.be") {
            return url.pathname.slice(1);
        }

        if (hostname === "youtube.com" || hostname === "m.youtube.com") {
            const videoId = url.searchParams.get("v");
            if (videoId) return videoId;
            const pathParts = url.pathname.split("/").filter(Boolean);
            if (pathParts.length && pathParts[0] === "embed") {
                return pathParts[1];
            }
        }
    } catch (error) {
        return null;
    }

    return null;
}

function VideoControls({ player, roomCode, role }) {

    const socket = useContext(SocketContext);

    const [newVideoId, setNewVideoId] = useState("");

    const disabled =
        role !== "host" &&
        role !== "moderator";

    const play = () => {

        if (!player) return;

        player.playVideo();

        socket.emit("play", {
            roomCode
        });

    };

    const pause = () => {

        if (!player) return;

        player.pauseVideo();

        socket.emit("pause", {
            roomCode
        });

    };

    const seekForward = () => {

        if (!player) return;

        const time = player.getCurrentTime() + 10;

        player.seekTo(time, true);

        socket.emit("seek", {
            roomCode,
            currentTime: time
        });

    };

    const changeVideo = () => {
        if (!newVideoId.trim()) return;

        const id = getYouTubeVideoId(newVideoId);
        if (!id) {
            alert("Please enter a valid YouTube video ID or URL.");
            return;
        }

        socket.emit("change_video", {
            roomCode,
            videoId: id
        });

        setNewVideoId("");
    };

    return (
        <div>

            <button
                disabled={disabled}
                onClick={play}
            >
                Play
            </button>

            <button
                disabled={disabled}
                onClick={pause}
            >
                Pause
            </button>

            <button
                disabled={disabled}
                onClick={seekForward}
            >
                +10 Seconds
            </button>

            <input
                type="text"
                placeholder="YouTube Video ID"
                value={newVideoId}
                onChange={(e) => setNewVideoId(e.target.value)}
            />

            <button
                disabled={disabled}
                onClick={changeVideo}
            >
                Change Video
            </button>

        </div>
    );
}

export default VideoControls;