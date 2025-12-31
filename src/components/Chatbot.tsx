"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "bot",
        content:
          "Bonjour ! 👋 Je peux vous aider avec un site web, e-commerce, SEO ou design. Quel est votre projet ?",
        timestamp: new Date(),
        suggestions: quickReplies,
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: conversationHistory.slice(-6), // Last 6 messages for context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to get response");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.message,
        timestamp: new Date(),
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);

      let errorText = "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.";

      // Show more specific error messages
      if (error?.message?.includes('API')) {
        errorText = "Le service de chat n'est pas disponible. Veuillez vérifier la configuration de l'API.";
      } else if (error?.message?.includes('Configuration')) {
        errorText = "Le chatbot n'est pas encore configuré. Contactez l'administrateur.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: errorText,
        timestamp: new Date(),
        suggestions: ["Créer un site web", "Demander un devis", "Contacter l'équipe"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  };

  const handleQuickReply = (text: string) => {
    setInput(text);
    // Auto-focus on input after selecting quick reply
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const quickReplies = [
    "Créer un site web",
    "Créer une boutique en ligne",
    "Améliorer mon SEO",
    "Design et identité visuelle",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <div className="relative w-full h-full">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors pointer-events-auto"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-400">
                <div className="flex items-center space-x-3">
                  <Bot className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-medium text-white">
                      Assistant DEV4COM
                    </h3>
                    <p className="text-xs text-white/80">En ligne</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {messages.map((message, index) => (
                  <div key={message.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start space-x-2 ${
                        message.type === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "user" ? "bg-blue-500" : "bg-gray-700"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.type === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <span className="text-xs opacity-50 mt-1 block">
                          {message.timestamp.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </motion.div>

                    {/* Show suggestions after bot messages */}
                    {message.type === "bot" &&
                     message.suggestions &&
                     message.suggestions.length > 0 &&
                     !isTyping &&
                     index === messages.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 mt-3 ml-10"
                      >
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={`${message.id}-suggestion-${idx}`}
                            onClick={() => handleQuickReply(suggestion)}
                            className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl px-4 py-2">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-white/10"
              >
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="w-full bg-gray-800 rounded-lg pl-4 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={1}
                    style={{ minHeight: "44px" }}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatBot;
