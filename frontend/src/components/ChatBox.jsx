import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

function ChatBox({ messages, onSend , onTyping , typingUser}) {

    return (
        <div
            style={{
                width: "350px",
                border: "1px solid #ddd",
                padding: "15px",
                marginTop: "20px"
            }}
        >
            <h3>Room Chat</h3>

            <div
                style={{
                    height: "300px",
                    overflowY: "auto",
                    marginBottom: "10px"
                }}
            >
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                    />
                ))}

                {typingUser && (
                    <p>
                        {typingUser} is typing...
                    </p>
                )}
            </div>

            <ChatInput
                onSend={onSend}
                onTyping={onTyping}
            />
        </div>
    );
}

export default ChatBox;

