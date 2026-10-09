import { useState } from "react";

function ChatInput({ onSend , onTyping}) {

    const [text, setText] = useState("");

    const handleChange = (e) => {
        setText(e.target.value);

        onTyping();
    };

    const send = () => {

        if (!text.trim()) return;

        onSend(text);

        setText("");
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                placeholder="Type message..."
                
                onChange={handleChange}
            />

            <button onClick={send}>
                Send
            </button>
        </div>
    );
}

export default ChatInput;