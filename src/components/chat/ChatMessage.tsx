import { Bot } from "lucide-react";
import { format } from "date-fns";

import type { ChatMessage as ChatMessageType } from "@/types/chat";
import PropertySuggestion from "./PropertySuggestion";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
          <Bot className="h-4 w-4" />
        </div>
      ) : null}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${isUser ? "bg-brand text-white" : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"}`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className="mt-2 text-[11px] opacity-70">
          {format(message.timestamp, "p")}
        </p>
        {!isUser && message.propertyIds?.length ? (
          <div>
            {message.propertyIds.map((id) => (
              <PropertySuggestion key={id} propertyId={id} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
