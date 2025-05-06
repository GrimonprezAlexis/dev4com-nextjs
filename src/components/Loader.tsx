import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { useNavigate } from "react-router-dom";

const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("LOADING_SYSTEM");
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const englishText = "Crafting Digital Excellence";
  const frenchText = "Créer l'excellence numérique";

  const typeText = async (text: string, delay: number = 50) => {
    setIsTyping(true);
    setDisplayText("");

    for (let i = 0; i <= text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      setDisplayText(text.substring(0, i));
    }

    setIsTyping(false);
  };

  const eraseText = async (delay: number = 30) => {
    for (let i = displayText.length; i >= 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      setDisplayText(displayText.substring(0, i));
    }
  };

  useEffect(() => {
    if (showButton) {
      const animateText = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Initial delay
        await eraseText();
        await new Promise((resolve) => setTimeout(resolve, 500)); // Pause between texts
        await typeText(frenchText);
      };
      animateText();
    }
  }, [showButton]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const texts = [
          "LOADING_SYSTEM",
          "INITIALIZING",
          "CONNECTING_DB",
          "LOADING_ASSETS",
          "FINALIZING",
        ];
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 1500);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => {
          const increment = Math.random() * 23;
          const newProgress = prev + increment;
          setLoadingPercent(Math.min(Math.round(newProgress), 100));
          return newProgress >= 99 ? 100 : newProgress;
        });
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setShowButton(true);
        }, 800);
      }
    }, 180);

    return () => clearInterval(timer);
  }, [progress, onComplete]);

  useEffect(() => {
    // Initial text animation
    typeText(englishText);
  }, []);

  const handleEnter = () => {
    setShowButton(false);
    setTimeout(() => {
      onComplete();
      navigate("/");
    }, 500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 z-0"
        options={{
          background: { color: "#000000" },
          particles: {
            color: { value: "#ffffff" },
            links: {
              enable: true,
              color: "#ffffff",
              opacity: 0.1,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              random: true,
              straight: false,
              outModes: "out",
            },
            number: { value: 100 },
            opacity: { value: 0.1 },
            size: { value: 1 },
          },
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-48 h-48 object-contain"
          />
        </motion.div>

        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent tracking-tight">
            Dev4Com
          </h1>
          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-4" />
          <div className="relative h-8">
            <p className="text-xl md:text-2xl text-gray-400 font-light italic tracking-wide">
              {displayText}
              {isTyping && (
                <span className="inline-block w-[2px] h-[1.2em] bg-blue-400 ml-1 animate-[blink_1s_infinite]" />
              )}
            </p>
          </div>
        </motion.div>

        {/* Loading Status */}
        <AnimatePresence mode="popLayout">
          {!showButton && (
            <motion.div
              className="w-full max-w-md mt-16 space-y-4"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>{loadingText}</span>
                <span>{loadingPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-[2px] bg-gray-800 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-blue-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Loading Lines */}
              <div className="space-y-2 text-[10px] font-mono text-gray-600">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 + i * 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {"> "}
                    {Array.from({ length: 32 })
                      .map(() => String.fromCharCode(65 + Math.random() * 26))
                      .join("")}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enter Button */}
          {showButton && (
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 1,
                duration: 0.8,
              }}
              onClick={handleEnter}
              className="mt-24 relative group"
            >
              {/* Gradient border background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />

              {/* Button content */}
              <div className="relative px-8 py-3 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 text-white font-medium">
                ENTER
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20" />
      </div>
    </motion.div>
  );
};

export default Loader;
