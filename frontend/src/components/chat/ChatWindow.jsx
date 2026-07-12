import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

import {
    conversations,
    messages,
} from "../../mocks/chats";

export default function ChatWindow() {

    const conversation = conversations[0];

    return (

        <div
            className="
                flex
                flex-col
                h-full
                bg-white
                rounded-2xl
                border
            "
        >

            <ChatHeader conversation={conversation} />

            <div
                className="
                    flex-1
                    p-6
                    space-y-4
                    overflow-y-auto
                "
            >

                {messages.map((message) => (

                    <MessageBubble
                        key={message.id}
                        message={message}
                    />

                ))}

            </div>

            <ChatInput />

        </div>

    );

}