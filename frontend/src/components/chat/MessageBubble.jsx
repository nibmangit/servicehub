export default function MessageBubble({ message }) {
    const mine = message.sender === "customer";

    return (
        <div
            className={`flex ${
                mine ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`
                    max-w-xs
                    rounded-2xl
                    px-4
                    py-3
                    ${
                        mine
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200"
                    }
                `}
            >
                <p>{message.text}</p>

                <p className="text-xs mt-2 opacity-70">
                    {message.time}
                </p>
            </div>
        </div>
    );
}