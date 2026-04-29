import React from "react";

export const AuraLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Efek Glow Belakang */}
    <path
      d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z"
      fill="url(#emerald-gradient)"
      fillOpacity="0.15"
      stroke="#34d399"
      strokeWidth="1.5"
    />
    {/* Pilar Grafik / Huruf A */}
    <path
      d="M30 70 L50 25 L70 70"
      stroke="#10b981"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M40 55 L60 55"
      stroke="#34d399"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Titik Puncak (Titik Keuntungan) */}
    <circle cx="50" cy="25" r="5" fill="#a7f3d0" />

    <defs>
      <linearGradient
        id="emerald-gradient"
        x1="0"
        y1="0"
        x2="100"
        y2="100"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#10b981" />
        <stop offset="1" stopColor="#064e3b" />
      </linearGradient>
    </defs>
  </svg>
);
