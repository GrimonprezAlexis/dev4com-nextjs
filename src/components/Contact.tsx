"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import Link from "next/link";

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-fill form with default values
  useEffect(() => {
    const defaultValues = {
      name: "",
      email: "",
      subject: "Demande de devis pour un site web",
      message:
        "Bonjour,\n\nJe souhaite obtenir un devis pour la création d'un site web professionnel.\n\nCordialement,\n",
    };

    setFormState(defaultValues);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setStatus("idle");
      }, 10_000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email",
      value: "contact@dev4com.com",
      delay: 0.2,
      href: "/contact",
    },
    {
      icon: <MapPin size={24} />,
      title: "Adresse",
      value: "Lausanne, Suisse",
      delay: 0.3,
    },
  ];

  return (
    <motion.div
      className="min-h-screen pt-24 pb-16 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Contactez-nous
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Une idée de projet ? Une question ? N'hésitez pas à nous contacter.
            Notre équipe est là pour vous accompagner dans votre transformation
            digitale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div variants={containerVariants}>
            <div className="grid gap-8">
              {contactInfo.map((info) => {
                const content = (
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-400">{info.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {info.title}
                      </h3>
                      <p className={`text-gray-400${info.href ? " group-hover:text-blue-400 transition-colors" : ""}`}>
                        {info.value}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <motion.div
                    key={info.title}
                    className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl group"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: info.delay }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    {info.href ? (
                      <Link href={info.href} className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  variants={itemVariants}
                  className="relative"
                  whileHover={{ y: -2 }}
                >
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    required
                  />
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="relative"
                  whileHover={{ y: -2 }}
                >
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ y: -2 }}
              >
                <input
                  type="text"
                  placeholder="Sujet"
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                  required
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="relative"
                whileHover={{ y: -2 }}
              >
                <textarea
                  placeholder="Votre message"
                  rows={5}
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  required
                />
              </motion.div>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3"
                >
                  {errorMessage}
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg p-3"
                >
                  Message envoyé avec succès ! Vous recevrez bientôt un email de
                  confirmation.
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer</span>
                    <Send size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Google Map Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Notre Localisation
            </h2>
            <p className="text-gray-400">
              Venez nous rendre visite à notre bureau parisien
            </p>
          </div>

          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            {/* Gradient overlay on borders */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none z-10" />

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43890.0!2d6.6000!3d46.5200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c2e8b4e8d0d3b%3A0x8c7f0e9c3b5e7d2a!2sLausanne%2C%20Suisse!5e0!3m2!1sfr!2sch!4v1234567890123!5m2!1sfr!2sch"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map - Lausanne, Suisse"
              className="relative z-0"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
