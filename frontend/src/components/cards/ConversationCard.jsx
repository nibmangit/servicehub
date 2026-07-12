export default function ConversationCard({ conversation }) {
    return (
        <div
            className="
                p-4
                border-b
                cursor-pointer
                hover:bg-slate-50
            "
        >
            <div className="flex justify-between">

                <div>

                    <h3 className="font-semibold">
                        {conversation.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {conversation.lastMessage}
                    </p>

                </div>

                {conversation.unread > 0 && (
                    <span
                        className="
                            bg-blue-600
                            text-white
                            rounded-full
                            w-6
                            h-6
                            flex
                            items-center
                            justify-center
                            text-xs
                        "
                    >
                        {conversation.unread}
                    </span>
                )}

            </div>
        </div>
    );
}