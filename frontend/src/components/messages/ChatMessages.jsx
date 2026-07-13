import TypingIndicator from "./TypingIndicator";

export default function ChatMessages({ active }) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
      <div className="text-center text-[11px] text-muted-foreground">
        Today
      </div>

      {active.messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${
            m._from === "me" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-soft ${
              m._from === "me"
                ? "rounded-br-md bg-primary text-primary-foreground"
                : "rounded-bl-md border border-border bg-card"
            }`}
          >
            <p className="leading-relaxed">{m.content}</p>

            <div
              className={`mt-1 text-[10px] ${
                m._from === "me"
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {m._time}
              {m._from === "me" && m.is_read ? " · Read" : ""}
            </div>
          </div>
        </div>
      ))}

      {active._typing && <TypingIndicator />}
    </div>
  );
}