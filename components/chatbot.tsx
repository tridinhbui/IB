"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getChatResponse, ChatMessage } from "@/lib/chatbot";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm your IB interview prep assistant. Ask me about DCF, LBO, M&A, valuation, accounting, or any technical concept. I'll help you nail your interview!",
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getChatResponse(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 400 + Math.random() * 600);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-finstep-brown/10 bg-card/95 backdrop-blur-md shadow-2xl shadow-finstep-orange/10 overflow-hidden font-nunito"
          >
            <div className="bg-finstep-orange px-4 py-3 flex items-center justify-between border-b border-finstep-brown/10">
              <div className="flex items-center gap-2 text-white">
                <Bot className="w-5 h-5" />
                <div>
                  <p className="text-sm font-varela font-bold">IB Prep Assistant</p>
                  <p className="text-[10px] font-semibold opacity-90">
                    Ask any IB technical question
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 hover:text-white h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="h-[350px]" ref={scrollRef}>
              <div className="p-4 space-y-3">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-2",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-finstep-lightbrown flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed max-w-[260px] whitespace-pre-wrap",
                        msg.role === "user"
                          ? "bg-finstep-orange text-white rounded-br-sm shadow-md shadow-finstep-orange/10"
                          : "bg-finstep-beige/50 text-finstep-brown border border-finstep-brown/10 rounded-bl-sm"
                      )}
                    >
                      {msg.content.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j}>{part}</strong>
                        ) : (
                          <span key={j}>{part}</span>
                        )
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-finstep-beige border border-finstep-brown/10 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-finstep-brown" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-finstep-lightbrown flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-finstep-beige/50 border border-finstep-brown/10 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-finstep-brown/40 rounded-full animate-bounce" />
                        <span
                          className="w-1.5 h-1.5 bg-finstep-brown/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.15s" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-finstep-brown/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-finstep-brown/10 bg-card/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about DCF, LBO, M&A..."
                  className="text-xs shadow-sm font-semibold border-finstep-brown/20 focus-visible:ring-finstep-orange text-finstep-brown"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="bg-finstep-orange hover:bg-finstep-brown text-white shrink-0 shadow-md shadow-finstep-orange/20 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-finstep-orange hover:bg-finstep-brown text-white shadow-xl shadow-finstep-orange/30 flex items-center justify-center transition-all",
          isOpen && "rotate-0"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
