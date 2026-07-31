import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    if (!ref.current) return;
    const value = ref.current.value.trim();
    if (!value || disabled) return;
    onSend(value);
    ref.current.value = "";
    ref.current.style.height = "auto";
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resize = () => {
      element.style.height = "auto";
      element.style.height = `${Math.min(element.scrollHeight, 144)}px`;
    };
    element.addEventListener("input", resize);
    return () => element.removeEventListener("input", resize);
  }, []);

  return (
    <div className="border-t p-3">
      <div className="flex items-end gap-2 rounded-2xl border bg-slate-50 p-2 dark:bg-slate-950">
        <textarea
          ref={ref}
          rows={1}
          maxLength={500}
          disabled={disabled}
          placeholder="Ask about properties or how to use this website..."
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
        />
        <button
          onClick={submit}
          disabled={disabled}
          aria-label="Send message"
          className="rounded-xl bg-brand p-3 text-white disabled:opacity-50"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
