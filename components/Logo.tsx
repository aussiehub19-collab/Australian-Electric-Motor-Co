import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'footer';
  className?: string;
}

export function Logo({ variant = 'full', className = '' }: LogoProps) {
  // Primary brand colour: #8C4A2F (Outback Ochre / Terracotta)
  // Secondary: #C87D55 (Copper Rust), Accent: #F59E0B (Golden Amber), Dark: #17191C
  const icon = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
      aria-label="Australian Electric Motor Co Badge"
    >
      <defs>
        {/* Ochre Terracotta Gradient */}
        <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A85838" />
          <stop offset="60%" stopColor="#8C4A2F" />
          <stop offset="100%" stopColor="#632F1B" />
        </linearGradient>

        {/* Copper Metal Accent */}
        <linearGradient id="copperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E29267" />
          <stop offset="100%" stopColor="#A85838" />
        </linearGradient>

        {/* Voltage Gold Gradient */}
        <linearGradient id="voltageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Outer Knobby Tyre Tread Perimeter (12 rugged lugs) */}
      <g stroke="#C87D55" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
        <path d="M50 4 V10" />
        <path d="M73 10 L69 15" />
        <path d="M90 27 L84 31" />
        <path d="M96 50 H90" />
        <path d="M90 73 L84 69" />
        <path d="M73 90 L69 85" />
        <path d="M50 96 V90" />
        <path d="M27 90 L31 85" />
        <path d="M10 73 L16 69" />
        <path d="M4 50 H10" />
        <path d="M10 27 L16 31" />
        <path d="M27 10 L31 15" />
      </g>

      {/* Rugged Stamped Hexagonal Moto Shield */}
      <polygon
        points="50,11 84,25 84,65 50,89 16,65 16,25"
        fill="url(#terracottaGrad)"
        stroke="url(#copperGrad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        filter="url(#logoShadow)"
      />

      {/* Inner Inset Rim */}
      <polygon
        points="50,16 79,28 79,62 50,83 21,62 21,28"
        fill="#14171A"
        stroke="#8C4A2F"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Outback Red Dirt Ground Ribs */}
      <path
        d="M26 60 L74 60 M30 68 L70 68"
        stroke="#8C4A2F"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Dynamic Twin-Stroke Electric Bolt */}
      <path
        d="M54 22 L33 51 H49 L43 78 L69 44 H51 L59 22 Z"
        fill="url(#voltageGrad)"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinejoin="miter"
      />

      {/* Aussie Star / Southern Cross Spark Accent */}
      <polygon
        points="68,24 70,29 75,30 71,33 72,38 68,35 64,38 65,33 61,30 66,29"
        fill="#FDE047"
        opacity="0.9"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`w-10 h-10 flex-shrink-0 ${className}`}>
        {icon}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3.5 group ${className}`}>
        <div className="w-11 h-11 flex-shrink-0">
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl sm:text-2xl tracking-tighter text-white uppercase font-sans">
              AUSTRALIAN ELECTRIC MOTOR CO
            </span>
            <span className="text-[10px] bg-[#8C4A2F] text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
              AUS
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-stone-400 uppercase font-mono">
            High-Performance Electric Dirt Bikes Australia
          </span>
        </div>
      </div>
    );
  }

  // Default 'full' variant (Nav header)
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-lg sm:text-xl md:text-2xl tracking-tight text-white uppercase font-sans leading-none">
            AUSTRALIAN ELECTRIC MOTOR CO
          </span>
          <span className="text-[10px] bg-[#8C4A2F]/40 border border-[#C87D55]/50 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider leading-none">
            AU
          </span>
        </div>
        <span className="text-[10px] tracking-widest text-stone-400 uppercase font-mono hidden sm:inline mt-0.5">
          Electric Dirt Bikes &amp; High-Voltage Moto Engineering
        </span>
      </div>
    </div>
  );
}
