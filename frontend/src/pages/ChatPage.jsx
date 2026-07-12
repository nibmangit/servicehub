import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatPage() {

    return (

        <div
            className="
                h-[85vh]
                max-w-7xl
                mx-auto
                px-6
                py-8
                grid
                lg:grid-cols-[350px_1fr]
                gap-6
            "
        >

            <ConversationList />

            <ChatWindow />

        </div>

    );

}