import { MessageCircle, Sparkles, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

import { useChatStore } from "@/store/chatStore";
import { usePropertyStore } from "@/store/propertyStore";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatWidget() {
  const {
    messages,
    isOpen,
    isLoading,
    toggle,
    close,
    clearMessages,
    sendMessage,
  } = useChatStore();
  const properties = usePropertyStore((state) => state.properties);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const welcome = useMemo(() => messages.length === 0, [messages.length]);

  return (
    <div className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-[1300] max-w-[calc(100vw-2rem)] lg:bottom-6 lg:right-6">
      <button
        onClick={toggle}
        className="mb-3 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-xl"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">AI Assistant</span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="flex h-[min(600px,calc(100vh-9rem))] w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl dark:bg-slate-950"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-brand" /> EstateAI Assistant
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearMessages}
                  aria-label="Clear messages"
                  className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={close}
                  aria-label="Minimize chat"
                  className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {welcome ? (
                <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900">
                  Ask about neighborhoods, pricing, or tell me your budget and
                  I’ll suggest matches.
                </div>
              ) : null}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading ? (
                <div className="flex gap-2 px-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                </div>
              ) : null}
            </div>
            <ChatInput
              onSend={(message) => sendMessage(message, properties)}
              disabled={isLoading}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
