import ConversationCard from "../cards/ConversationCard";
import { conversations } from "../../mocks/chats";

export default function ConversationList() {
    return (
        <div className="bg-white rounded-2xl border overflow-hidden">

            {conversations.map(conversation => (

                <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                />

            ))}

        </div>
    );
}