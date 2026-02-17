"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ─── Bezier curve definitions ─── */
const CURVES = [
  // Primary sweeping curves — wide, graceful S-curves
  {
    d: "M -200,540 C 200,100 600,980 960,540 C 1320,100 1720,980 2120,540",
    width: 1.5,
    duration: 8,
    delay: 0,
    opacity: 0.5,
    gradient: "bzGrad1",
    glow: true,
  },
  {
    d: "M -200,200 C 200,650 550,50 960,400 C 1370,750 1720,100 2120,550",
    width: 1.2,
    duration: 10,
    delay: 0.4,
    opacity: 0.35,
    gradient: "bzGrad2",
    glow: true,
    reverse: true,
  },
  {
    d: "M -200,800 C 150,450 550,950 960,600 C 1370,250 1770,850 2120,500",
    width: 1.3,
    duration: 9,
    delay: 0.8,
    opacity: 0.4,
    gradient: "bzGrad1",
    glow: true,
  },
  // Secondary tighter multi-wave curves
  {
    d: "M -100,350 C 200,600 450,100 750,400 C 1050,700 1350,200 1650,500 C 1950,800 2050,400 2150,450",
    width: 0.8,
    duration: 12,
    delay: 0.2,
    opacity: 0.2,
    gradient: "bzGrad2",
    reverse: true,
  },
  {
    d: "M -100,700 C 200,450 450,850 750,600 C 1050,350 1250,750 1550,500 C 1850,250 2050,600 2150,400",
    width: 0.8,
    duration: 11,
    delay: 0.6,
    opacity: 0.2,
    gradient: "bzGrad3",
  },
  // Accent curves — subtle background detail
  {
    d: "M -100,100 C 300,300 700,50 1100,250 C 1500,450 1900,100 2150,300",
    width: 0.5,
    duration: 14,
    delay: 1.2,
    opacity: 0.12,
    gradient: "bzGrad3",
    reverse: true,
  },
  {
    d: "M -100,950 C 300,700 700,980 1100,750 C 1500,520 1900,880 2150,650",
    width: 0.5,
    duration: 13,
    delay: 1.5,
    opacity: 0.12,
    gradient: "bzGrad1",
  },
];

const RING_RADIUS = 108;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [loadingText, setLoadingText] = useState("INITIALIZING");
  const [showButton, setShowButton] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const displayTextRef = useRef("");
  const router = useRouter();

  const englishText = "Crafting Digital Excellence";
  const frenchText = "Créer l'excellence numérique";

  /* ─── Typing animation ─── */
  const typeText = async (text: string, delay: number = 50) => {
    setIsTyping(true);
    setDisplayText("");
    displayTextRef.current = "";

    for (let i = 0; i <= text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const partial = text.substring(0, i);
      setDisplayText(partial);
      displayTextRef.current = partial;
    }
    setIsTyping(false);
  };

  const eraseText = async (delay: number = 30) => {
    const currentText = displayTextRef.current;
    for (let i = currentText.length; i >= 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const partial = currentText.substring(0, i);
      setDisplayText(partial);
      displayTextRef.current = partial;
    }
  };

  /* Text swap: English → French after button appears */
  useEffect(() => {
    if (showButton) {
      const animateText = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await eraseText();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await typeText(frenchText);
      };
      animateText();
    }
  }, [showButton]);

  /* Rotating status text */
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        const texts = ["INITIALIZING", "CONNECTING", "LOADING_ASSETS", "FINALIZING"];
        return texts[(texts.indexOf(prev) + 1) % texts.length];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  /* Progress timer */
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => setShowButton(true), 300);
      return () => clearTimeout(timeout);
    }

    const timer = setTimeout(() => {
      setProgress((prev) => {
        const increment = Math.random() * 50;
        return Math.min(prev + increment, 100);
      });
    }, 180);

    return () => clearTimeout(timer);
  }, [progress]);

  /* Initial typing */
  useEffect(() => {
    typeText(englishText);
  }, []);

  /* ─── Enter handler with exit animation ─── */
  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
      router.push("/");
    }, 800);
  };

  const loadingPercent = Math.round(progress);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #070c1a 0%, #020408 60%, #000000 100%)",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: isExiting ? 0.8 : 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* ── Grain texture ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── SVG Bezier Curves ── */}
      <motion.svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: isExiting ? 0.5 : 2, ease: "easeOut" }}
      >
        <defs>
          {/* Gradient strokes */}
          <linearGradient id="bzGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="15%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="85%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bzGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="15%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="85%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bzGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="15%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="85%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>

          {/* Glow filters */}
          <filter
            id="curveGlow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="curveGlowHeavy"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="14"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {CURVES.map((curve, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: curve.delay, ease: "easeOut" }}
          >
            {/* Glow layer (blurred, wider copy) */}
            {curve.glow && (
              <path
                d={curve.d}
                fill="none"
                stroke={`url(#${curve.gradient})`}
                strokeWidth={curve.width * 4}
                strokeLinecap="round"
                opacity={curve.opacity * 0.3}
                strokeDasharray="800 400"
                filter="url(#curveGlowHeavy)"
                className={
                  curve.reverse ? "bezier-flow-reverse" : "bezier-flow"
                }
                style={{ animationDuration: `${curve.duration}s` }}
              />
            )}
            {/* Main curve */}
            <path
              d={curve.d}
              fill="none"
              stroke={`url(#${curve.gradient})`}
              strokeWidth={curve.width}
              strokeLinecap="round"
              opacity={curve.opacity}
              strokeDasharray="800 400"
              filter={curve.glow ? "url(#curveGlow)" : undefined}
              className={
                curve.reverse ? "bezier-flow-reverse" : "bezier-flow"
              }
              style={{ animationDuration: `${curve.duration}s` }}
            />
          </motion.g>
        ))}
      </motion.svg>

      {/* ── Scan line sweep ── */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-[120px]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.025) 50%, transparent 100%)",
            animation: "scanLine 6s linear infinite",
          }}
        />
      </div>

      {/* ── Vignette overlay ── */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* ══════════ CONTENT ══════════ */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Logo + Progress Ring */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            scale: isExiting ? 1.08 : 1,
            opacity: isExiting ? 0 : 1,
          }}
          transition={{
            duration: isExiting ? 0.6 : 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="relative w-[240px] h-[240px] flex items-center justify-center">
            {/* Progress ring */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 240 240"
            >
              <defs>
                <linearGradient
                  id="ringGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="ringGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Track ring */}
              <circle
                cx="120"
                cy="120"
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />

              {/* Progress arc */}
              <g transform="rotate(-90 120 120)">
                <motion.circle
                  cx="120"
                  cy="120"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  animate={{
                    strokeDashoffset:
                      RING_CIRCUMFERENCE * (1 - progress / 100),
                    opacity: showButton ? 0.25 : 0.8,
                  }}
                  transition={{
                    strokeDashoffset: {
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    },
                    opacity: { duration: 0.6 },
                  }}
                  filter="url(#ringGlow)"
                />
              </g>
            </svg>

            {/* Logo */}
            <Image
              src="/images/logo.png"
              alt="Dev4Com"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isExiting ? 0 : 1,
            y: isExiting ? -10 : 0,
          }}
          transition={{
            delay: isExiting ? 0 : 0.4,
            duration: isExiting ? 0.5 : 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
            Dev4Com
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-4" />
          <div className="relative h-8">
            <p className="text-lg md:text-xl text-white/40 font-light tracking-wider">
              {displayText}
              {isTyping && (
                <span className="inline-block w-[2px] h-[1em] bg-blue-400/80 ml-1 animate-[blink_1s_infinite] align-text-bottom" />
              )}
            </p>
          </div>
        </motion.div>

        {/* Loading Status / Enter Button */}
        <AnimatePresence mode="popLayout">
          {!showButton && (
            <motion.div
              key="loading-status"
              className="mt-10 flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.25em] text-white/20 uppercase">
                <span>{loadingText}</span>
                <span className="text-blue-400/30">{loadingPercent}%</span>
              </div>
            </motion.div>
          )}

          {showButton && !isExiting && (
            <motion.button
              key="enter-button"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8,
              }}
              onClick={handleEnter}
              className="mt-10 relative group cursor-pointer"
            >
              {/* Hover glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Button */}
              <div className="relative px-10 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm text-white/70 text-sm font-medium tracking-[0.3em] uppercase transition-all duration-300 group-hover:border-blue-500/30 group-hover:text-white/90 group-hover:bg-white/[0.05]">
                ENTER
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Screen border accents ── */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      </div>
    </motion.div>
  );
};

export default Loader;
