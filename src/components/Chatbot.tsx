"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Mail,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  showEmailCTA?: boolean;
}

/* ─── Knowledge base: keyword → response mapping ─── */
interface Response {
  message: string;
  suggestions: string[];
  showEmailCTA?: boolean;
}

const RESPONSES: Record<string, Response> = {
  greeting: {
    message:
      "Bonjour ! Je suis l'assistant DEV4COM. Je peux vous renseigner sur nos services : création de site web, e-commerce, SEO ou design. Que recherchez-vous ?",
    suggestions: [
      "Créer un site web",
      "Créer une boutique en ligne",
      "Améliorer mon SEO",
    ],
  },
  site_web: {
    message:
      "Nous créons des sites web modernes et performants (vitrine, corporate, portfolio) avec une maquette gratuite avant engagement. Délai moyen : 4-6 semaines. Maintenance 1 an incluse ! Souhaitez-vous un devis personnalisé ?",
    suggestions: [
      "Demander un devis",
      "Voir les réalisations",
      "En savoir plus sur les tarifs",
    ],
    showEmailCTA: true,
  },
  ecommerce: {
    message:
      "Nous développons des boutiques en ligne sécurisées et optimisées pour la conversion : Shopify, WooCommerce ou sur mesure. Paiement en ligne, gestion de stock, et design adapté à votre marque. Intéressé par un devis ?",
    suggestions: [
      "Demander un devis",
      "Voir les réalisations",
      "Quelles technologies ?",
    ],
    showEmailCTA: true,
  },
  seo: {
    message:
      "Nos services SEO incluent : audit technique, optimisation on-page, stratégie de mots-clés, et suivi de positionnement. Nous ciblons les marchés Suisse romande, Annecy et Haute-Savoie. Envie d'un audit gratuit ?",
    suggestions: [
      "Demander un audit SEO",
      "Demander un devis",
      "En savoir plus",
    ],
    showEmailCTA: true,
  },
  design: {
    message:
      "Notre équipe crée des identités visuelles complètes : logo, charte graphique, UI/UX design et supports de communication. Chaque projet est unique et conçu sur mesure.",
    suggestions: [
      "Demander un devis",
      "Voir les réalisations",
      "Créer un site web",
    ],
    showEmailCTA: true,
  },
  tarifs: {
    message:
      "Nos tarifs dépendent de la complexité du projet. Site vitrine à partir de 1'500 CHF, e-commerce à partir de 3'000 CHF. Chaque devis est personnalisé et gratuit. Contactez-nous pour en discuter !",
    suggestions: [
      "Demander un devis",
      "Créer un site web",
      "Créer une boutique en ligne",
    ],
    showEmailCTA: true,
  },
  portfolio: {
    message:
      "Vous pouvez consulter nos réalisations directement sur notre page projets. Nous avons accompagné des entreprises en Suisse romande et en France dans leur transformation digitale.",
    suggestions: [
      "Voir les projets",
      "Demander un devis",
      "Créer un site web",
    ],
  },
  contact: {
    message:
      "Vous pouvez nous contacter par email à contact@dev4com.com ou via notre formulaire de contact. Nous répondons sous 24h !",
    suggestions: [
      "Créer un site web",
      "Voir les réalisations",
      "En savoir plus sur les tarifs",
    ],
    showEmailCTA: true,
  },
  maintenance: {
    message:
      "Nous offrons 1 an de maintenance gratuite avec chaque projet. Ensuite, nous proposons des forfaits de maintenance et d'hébergement adaptés à vos besoins. Support technique inclus.",
    suggestions: [
      "Demander un devis",
      "Créer un site web",
      "En savoir plus sur les tarifs",
    ],
  },
  techno: {
    message:
      "Nous travaillons avec les technologies les plus modernes : React, Next.js, TypeScript, Tailwind CSS, Node.js, Shopify, WordPress. Chaque projet utilise la stack la plus adaptée à vos besoins.",
    suggestions: [
      "Créer un site web",
      "Demander un devis",
      "Voir les réalisations",
    ],
  },
  delai: {
    message:
      "Nos délais moyens : site vitrine 4-6 semaines, e-commerce 6-10 semaines, application web sur mesure 8-16 semaines. Chaque projet démarre par une maquette gratuite validée avec vous.",
    suggestions: [
      "Demander un devis",
      "Créer un site web",
      "Créer une boutique en ligne",
    ],
  },
  merci: {
    message:
      "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Nous sommes là pour vous accompagner dans votre projet digital.",
    suggestions: [
      "Demander un devis",
      "Créer un site web",
      "Voir les réalisations",
    ],
  },
  fallback: {
    message:
      "Je ne suis pas sûr de pouvoir répondre précisément à cette question. Pour une réponse détaillée et personnalisée, je vous invite à nous contacter directement.",
    suggestions: [
      "Créer un site web",
      "Demander un devis",
      "Améliorer mon SEO",
    ],
    showEmailCTA: true,
  },
};

/* ─── Keyword matching patterns ─── */
const PATTERNS: Array<{ keywords: RegExp; responseKey: string }> = [
  {
    keywords:
      /\b(bonjour|salut|hello|bonsoir|hey|coucou|hi)\b/i,
    responseKey: "greeting",
  },
  {
    keywords:
      /\b(site\s*web|site\s*internet|site\s*vitrine|créer\s*(un\s*)?site|refonte|landing\s*page|page\s*web)\b/i,
    responseKey: "site_web",
  },
  {
    keywords:
      /\b(e[\s-]?commerce|boutique\s*(en\s*)?ligne|shop|magasin|vente\s*en\s*ligne|shopify|woocommerce)\b/i,
    responseKey: "ecommerce",
  },
  {
    keywords:
      /\b(seo|référencement|google|visibilit|positionnement|audit\s*seo|mots[\s-]?clés)\b/i,
    responseKey: "seo",
  },
  {
    keywords:
      /\b(design|logo|identité\s*visuelle|charte\s*graphique|ui|ux|graphi|maquette)\b/i,
    responseKey: "design",
  },
  {
    keywords:
      /\b(prix|tarif|coût|combien|budget|devis|estimat|facturer)\b/i,
    responseKey: "tarifs",
  },
  {
    keywords:
      /\b(portfolio|réalisat|projet|exemple|référence|travaux)\b/i,
    responseKey: "portfolio",
  },
  {
    keywords:
      /\b(contact|email|mail|appel|téléphone|joindre|écrire)\b/i,
    responseKey: "contact",
  },
  {
    keywords:
      /\b(maintenance|hébergement|support|mise\s*à\s*jour|sécurité|serveur)\b/i,
    responseKey: "maintenance",
  },
  {
    keywords:
      /\b(technologi|react|next|wordpress|node|stack|framework|langage)\b/i,
    responseKey: "techno",
  },
  {
    keywords:
      /\b(délai|temps|durée|combien\s*de\s*temps|livraison|deadline|semaine)\b/i,
    responseKey: "delai",
  },
  {
    keywords: /\b(merci|super|parfait|génial|top|excellent|cool)\b/i,
    responseKey: "merci",
  },
];

function detectIntent(message: string): string {
  const normalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (const pattern of PATTERNS) {
    if (pattern.keywords.test(message) || pattern.keywords.test(normalized)) {
      return pattern.responseKey;
    }
  }

  return "fallback";
}

/* ─── Quick reply suggestions ─── */
const quickReplies = [
  "Créer un site web",
  "Créer une boutique en ligne",
  "Améliorer mon SEO",
  "Demander un devis",
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [fallbackCount, setFallbackCount] = useState(0);
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

  // Welcome message when chat opens
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

  const processMessage = (text: string) => {
    const intent = detectIntent(text);
    const response = RESPONSES[intent];

    // Track consecutive fallbacks
    if (intent === "fallback") {
      setFallbackCount((prev) => prev + 1);
    } else {
      setFallbackCount(0);
    }

    // Force email CTA after 2+ fallbacks
    const forceEmailCTA = intent === "fallback" && fallbackCount >= 1;

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: forceEmailCTA
        ? "Il semble que je ne puisse pas répondre à votre demande. Pour un échange plus approfondi, contactez-nous directement par email — nous répondons sous 24h !"
        : response.message,
      timestamp: new Date(),
      suggestions: response.suggestions,
      showEmailCTA: forceEmailCTA || response.showEmailCTA,
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate a small delay for natural feel
    setTimeout(() => {
      processMessage(currentInput);
    }, 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  };

  const handleQuickReply = (text: string) => {
    setInput(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <div className="relative w-full h-full">
        {/* Open button */}
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors pointer-events-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </motion.button>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden pointer-events-auto"
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
              <div className="h-96 overflow-y-auto p-4 space-y-4">
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
                          message.type === "user"
                            ? "bg-blue-500"
                            : "bg-gray-700"
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

                    {/* Email CTA button */}
                    {message.type === "bot" &&
                      message.showEmailCTA &&
                      index === messages.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="mt-3 ml-10"
                        >
                          <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-500 transition-all"
                          >
                            <Mail className="w-4 h-4" />
                            Nous contacter par email
                          </Link>
                        </motion.div>
                      )}

                    {/* Suggestions */}
                    {message.type === "bot" &&
                      message.suggestions &&
                      message.suggestions.length > 0 &&
                      index === messages.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="flex flex-wrap gap-2 mt-3 ml-10"
                        >
                          {message.suggestions.map((suggestion, idx) => {
                            // "Voir les projets" / "Voir les réalisations" link to /projets
                            if (
                              suggestion.toLowerCase().includes("voir les projet") ||
                              suggestion.toLowerCase().includes("voir les réalisation")
                            ) {
                              return (
                                <Link
                                  key={`${message.id}-suggestion-${idx}`}
                                  href="/projets"
                                  className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors"
                                >
                                  {suggestion}
                                </Link>
                              );
                            }
                            // "Demander un devis" / "Demander un audit" link to /contact
                            if (
                              suggestion.toLowerCase().includes("demander un devis") ||
                              suggestion.toLowerCase().includes("demander un audit")
                            ) {
                              return (
                                <Link
                                  key={`${message.id}-suggestion-${idx}`}
                                  href="/contact"
                                  className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors"
                                >
                                  {suggestion}
                                </Link>
                              );
                            }
                            return (
                              <button
                                key={`${message.id}-suggestion-${idx}`}
                                onClick={() => handleQuickReply(suggestion)}
                                className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20 transition-colors"
                              >
                                {suggestion}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                  </div>
                ))}
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
                    disabled={!input.trim()}
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
