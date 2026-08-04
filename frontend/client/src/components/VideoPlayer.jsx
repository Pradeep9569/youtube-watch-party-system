import YouTube from "react-youtube";
import { useRef } from "react";

function VideoPlayer({ videoId, onReady, onError }) {
    const playerRef = useRef(null);

    const handleReady = (event) => {
        console.log("YouTube Player Ready");

        playerRef.current = event.target;

        if (onReady) {
            onReady(event.target);
        }
    };

    const handleError = (event) => {
        console.error("YouTube Player Error:", event.data);

        let message = "An error occurred while loading the YouTube video.";

        switch (event.data) {
            case 2:
                message = "The request contained an invalid parameter. Please verify the video ID.";
                break;
            case 5:
                message = "The requested content cannot be played in an embedded player. Try a different video.";
                break;
            case 100:
                message = "The video requested was not found. It may have been removed or marked as private.";
                break;
            case 101:
            case 150:
                message = "The owner of the requested video does not allow it to be played here.";
                break;
        }

        if (onError) {
            onError(message, event.data);
            return;
        }

        alert(message);
    };

    const options = {
        width: "100%",
        height: "500",
        playerVars: {
            autoplay: 0,
            rel: 0,
            origin: window.location.origin,
        },
    };

    console.log("Current Video ID:" , videoId);

    return (
        <YouTube
            videoId={videoId}
            opts={options}
            onReady={handleReady}
            onError={handleError}
            iframeClassName="youtube-player"
        />
    );
}

export default VideoPlayer;