import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { chatAboutDesign } from "@/src/services/geminiService";
import { cn, truncateText } from "@/src/lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
}

interface ChatInterfaceProps {
  currentImage?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentImage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I'm your AI Interior Design Consultant. Upload a photo and pick a style to get started, or ask me anything about your space!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await chatAboutDesign(userMessage, history, currentImage);
      const modelText = response.text || "I'm sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: "model", text: modelText }]);
    } catch (error) {
      console.error("Chat error:", error);
      const message = error instanceof Error ? error.message : String(error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: truncateText(message || "Something went wrong. Please try again.", 120) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-125 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-bottom border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Design Assistant</h2>
          <p className="text-[10px] text-neutral-500">Online • Expert Consultant</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full shrink-0 flex items-center justify-center",
                  msg.role === "user" ? "bg-neutral-100" : "bg-black"
                )}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-neutral-600" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-neutral-100 text-neutral-800 rounded-tr-none"
                    : "bg-white border border-neutral-100 text-neutral-800 rounded-tl-none shadow-sm"
                )}
              >
                <div className="markdown-body prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              <span className="text-xs text-neutral-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-neutral-50/50 border-t border-neutral-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your design..."
            className="w-full pl-4 pr-12 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-black text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-neutral-800"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
