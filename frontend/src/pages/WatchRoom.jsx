import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { SocketContext } from "../components/context/SocketContext";

import VideoPlayer from "../components/VideoPlayer";
import VideoControls from "../components/VideoControls";
import ParticipantList from "../components/ParticipantList";

import ChatBox from "../components/ChatBox";

function WatchRoom() {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();
    const { roomCode } = useParams();
    const location = useLocation();

    const currentUsername = location.state?.username || "Guest";

    const [videoId, setVideoId] = useState("M7lc1UVf-VE");
    const [player, setPlayer] = useState(null);

    const [role, setRole] = useState("host");
    const [participants, setParticipants] = useState([]);

    const [message , setMessages] = useState([]);

    const[typingUser , setTypingUser] = useState("");

    useEffect(() => {
        const handleChatMessage = (message) => {
            setMessages((prev) => [...prev , message]);
        };

        socket.on("chat_message" , handleChatMessage);

        return () => {
            socket.off("chat_message" , handleChatMessage);
        };
    } , [socket]);

    useEffect(() => {
        socket.on("typing" , ({username}) => {
            if(username === currentUsername) return;

            setTypingUser(username);

            setTimeout(() => {
                setTypingUser("");
            } , 1000);
        });

        return () => {
            socket.off("typing");
        };
    } , [socket]);

    useEffect(() => {
        socket.emit("join_room", {
            roomCode,
            username: currentUsername,
        });

        const handleError = ({ message }) => {
            alert(message);
            navigate("/");
        };

        socket.on("error_message", handleError);

        return () => {
            socket.off("error_message", handleError);
        };
    }, [socket, roomCode, currentUsername, navigate]);

    useEffect(() => {
        if (!player) return;

        const handlePlay = () => {
            player.playVideo();
        };

        const handlePause = () => {
            player.pauseVideo();
        };

        const handleSeek = ({ currentTime }) => {
            player.seekTo(currentTime, true);
        };

        const handleChangeVideo = ({ videoId }) => {
            setVideoId(videoId);
        };

        const handleSyncState = ({
            videoId,
            currentTime,
            isPlaying,
            role,
            participants,
        }) => {
            setVideoId(videoId);

            if (role) setRole(role);

            if (participants) {
                setParticipants(participants);
            }

            setTimeout(() => {
                if (!player) return;

                player.seekTo(currentTime, true);

                if (isPlaying) {
                    player.playVideo();
                } else {
                    player.pauseVideo();
                }
            }, 800);
        };

        const handleRoleAssigned = ({
            username,
            role,
            participants,
        }) => {
            if (username === currentUsername) {
                setRole(role);
            }

            if (participants) {
                setParticipants(participants);
            }
        };

        socket.on("play", handlePlay);
        socket.on("pause", handlePause);
        socket.on("seek", handleSeek);
        socket.on("change_video", handleChangeVideo);
        socket.on("sync_state", handleSyncState);
        socket.on("role_assigned", handleRoleAssigned);

        return () => {
            socket.off("play", handlePlay);
            socket.off("pause", handlePause);
            socket.off("seek", handleSeek);
            socket.off("change_video", handleChangeVideo);
            socket.off("sync_state", handleSyncState);
            socket.off("role_assigned", handleRoleAssigned);
        };
    }, [player, socket, currentUsername]);

    useEffect(() => {
        const handleJoined = ({ participants }) => {
            setParticipants(participants);
        };

        const handleLeft = ({ participants }) => {
            setParticipants(participants);
        };

        const handleRemoved = ({ participants }) => {
            setParticipants(participants);
        };

        const handleRemovedRoom = () => {
            alert("You were removed from the room.");
            navigate("/");
        };

        socket.on("user_joined", handleJoined);
        socket.on("user_left", handleLeft);
        socket.on("participant_removed", handleRemoved);
        socket.on("removed_from_room", handleRemovedRoom);

        return () => {
            socket.off("user_joined", handleJoined);
            socket.off("user_left", handleLeft);
            socket.off("participant_removed", handleRemoved);
            socket.off("removed_from_room", handleRemovedRoom);
        };
    }, [socket, navigate]);

    const assignRole = (username, role) => {
        socket.emit("assign_role", {
            roomCode,
            username,
            role,
        });
    };

    const removeParticipant = (username) => {
        socket.emit("remove_participant", {
            roomCode,
            username,
        });
    };

    const sendMessage = (text) => {
        socket.emit("send_message" , {
           roomCode ,
           username: currentUsername,
           text,
        });
    };

    const handleTyping = () => {
        socket.emit("typing" , {
           roomCode,
           username: currentUsername, 
        });
    };

    const inviteLink = `${window.location.origin}/room/${roomCode}`;

    return (
        <div style={{ maxWidth: "1100px", margin: "20px auto" }}>
            <h2>YouTube Watch Party</h2>

            <h4>Room Code: {roomCode}</h4>

            <VideoPlayer
                videoId={videoId}
                onReady={setPlayer}
            />

            <VideoControls
                player={player}
                roomCode={roomCode}
                role={role}
            />

            <ParticipantList
                participants={participants}
                currentRole={role}
                onAssignRole={assignRole}
                onRemoveParticipant={removeParticipant}
            />

            <ChatBox
            messages={message}
            onSend ={sendMessage}
            onTyping={handleTyping}
            typingUser={typingUser}
             />

            <button
                onClick={() => {
                    navigator.clipboard.writeText(roomCode);
                    alert("Room Code Copied!");
                }}
            >
                Copy Room Code
            </button>

            <button
                style={{ marginLeft: 10 }}
                onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    alert("Invite Link Copied!");
                }}
            >
                Copy Invite Link
            </button>
        </div>
    );
}

export default WatchRoom;