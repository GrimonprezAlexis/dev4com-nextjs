"use client";

import Image from "next/image";

/* ─── Lightweight Bezier curves (3 curves, CSS-only animation) ─── */
const CURVES = [
  {
    d: "M -200,540 C 200,100 600,980 960,540 C 1320,100 1720,980 2120,540",
    width: 2,
    duration: 4.5,
    opacity: 0.4,
    gradient: "loadGrad1",
  },
  {
    d: "M -200,200 C 200,650 550,50 960,400 C 1370,750 1720,100 2120,550",
    width: 1.5,
    duration: 6,
    opacity: 0.25,
    gradient: "loadGrad2",
    reverse: true,
  },
  {
    d: "M -200,800 C 150,450 550,950 960,600 C 1370,250 1770,850 2120,500",
    width: 1.8,
    duration: 5,
    opacity: 0.3,
    gradient: "loadGrad1",
  },
];

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #070c1a 0%, #020408 60%, #000000 100%)",
      }}
    >
      {/* Bezier curves background */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="loadGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="15%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="85%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="loadGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="15%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="85%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {CURVES.map((curve, i) => (
          <path
            key={i}
            d={curve.d}
            fill="none"
            stroke={`url(#${curve.gradient})`}
            strokeWidth={curve.width}
            strokeLinecap="round"
            strokeDasharray="800 400"
            opacity={curve.opacity}
            className={curve.reverse ? "bezier-flow-reverse" : "bezier-flow"}
            style={{ animationDuration: `${curve.duration}s` }}
          />
        ))}
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/logo.png"
          alt="Dev4Com"
          width={100}
          height={100}
          className="object-contain animate-pulse"
          priority
        />
      </div>
    </div>
  );
}
