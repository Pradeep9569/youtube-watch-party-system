function ChatMessage({ message }) {
    return (
        <div
            style={{
                padding: "8px",
                marginBottom: "8px",
                borderBottom: "1px solid #ddd"
            }}
        >
            <strong>{message.username}</strong>

            <p>{message.text}</p>

            <small>
                {new Date(message.time).toLocaleTimeString()}
            </small>
        </div>
    );
}

export default ChatMessage;