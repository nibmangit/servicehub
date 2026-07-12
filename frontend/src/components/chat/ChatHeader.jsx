export default function ChatHeader({ conversation }) {
    return (
        <div
            className="
                border-b
                px-6
                py-4
                flex
                items-center
                justify-between
                bg-white
            "
        >
            <div>

                <h2 className="text-xl font-semibold">
                    {conversation.name}
                </h2>

                <p
                    className={`
                        text-sm
                        ${
                            conversation.online
                                ? "text-green-600"
                                : "text-slate-500"
                        }
                    `}
                >
                    {conversation.online ? "Online" : "Offline"}
                </p>

            </div>

        </div>
    );
}