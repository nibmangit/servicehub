import { useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ChatInput() {

    const [message, setMessage] = useState("");

    const handleSend = () => {

        if (!message.trim()) return;

        console.log(message);

        setMessage("");

    };

    return (

        <div
            className="
                border-t
                p-4
                flex
                gap-4
                bg-white
            "
        >

            <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
            />

            <Button onClick={handleSend}>
                Send
            </Button>

        </div>

    );

}