import React from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  variant?: 'full' | 'badge' | 'horizontal' | 'mark' | 'emblem';
  theme?: 'original' | 'dark' | 'light' | 'cyan';
  className?: string;
  showPhone?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'original',
  className = '',
  showPhone = true,
  onClick
}) => {
  // Size mapping
  const sizeStyles = {
    xs: 'w-16 h-auto',
    sm: 'w-24 h-auto',
    md: 'w-36 h-auto',
    lg: 'w-48 h-auto',
    xl: 'w-64 h-auto',
    '2xl': 'w-80 h-auto',
    custom: ''
  };

  // Color schemes
  const strokeColor = theme === 'cyan' ? '#38bdf8' : theme === 'dark' ? '#f8fafc' : '#161e48';
  const skyFill = theme === 'cyan' ? 'rgba(56, 189, 248, 0.15)' : theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e9f2fb';
  const houseFill = theme === 'cyan' ? '#071526' : theme === 'dark' ? '#0f172a' : '#f8fafc';
  const titleColor = theme === 'cyan' ? '#38bdf8' : theme === 'dark' ? '#ffffff' : '#161e48';
  const phoneBg = theme === 'cyan' ? '#0284c7' : '#161e48';

  if (variant === 'horizontal') {
    return (
      <div 
        onClick={onClick}
        className={`flex items-center gap-3 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {/* Emblem Mark */}
        <div className="relative w-11 h-11 md:w-12 md:h-12 flex-shrink-0 rounded-2xl bg-white/95 p-1 border border-slate-700/80 group-hover:border-[#38bdf8] transition-all duration-300 shadow-md flex items-center justify-center overflow-hidden">
          <img 
            src="/208logo.svg" 
            alt="208 Fence and Gate Logo" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col">
          <div className="font-heading text-base md:text-lg font-bold tracking-tight text-white group-hover:text-[#38bdf8] transition-colors leading-none">
            208 FENCE & GATE
          </div>
          <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase flex items-center gap-1.5 mt-1">
            <span className="text-[#38bdf8] font-bold">(208) 358-9077</span>
            <span className="w-1 h-1 rounded-full bg-[#00ff66]" />
            <span>ID Contractor</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex items-center justify-center p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-300/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ${sizeStyles[size]} ${className}`}
      >
        <img 
          src="/208logo.svg" 
          alt="208 Fence & Gate" 
          className="w-full h-auto object-contain drop-shadow-sm" 
        />
      </div>
    );
  }

  // Full SVG Graphic with precise vector rendering
  return (
    <div 
      onClick={onClick} 
      className={`relative inline-block ${sizeStyles[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <svg 
        viewBox="0 0 400 230" 
        width="100%" 
        height="100%" 
        className="w-full h-auto drop-shadow-md select-none transition-transform duration-300 hover:scale-[1.02]"
      >
        <defs>
          <linearGradient id="emblemGradientSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skyFill} stopOpacity="1" />
            <stop offset="100%" stopColor={skyFill} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <g id="two-zero-eight-logo-graphic">
          {/* Sky background inside upper oval */}
          <path d="M 22,118 C 22,58 102,12 200,12 C 298,12 378,58 378,118 Z" fill="url(#emblemGradientSky)" />

          {/* Left Fence */}
          <g stroke={strokeColor} strokeWidth="4" fill={strokeColor} strokeLinecap="round" strokeLinejoin="round">
            <line x1="28" y1="92" x2="118" y2="105" strokeWidth="5" />
            <line x1="38" y1="112" x2="118" y2="116" strokeWidth="4" />
            <line x1="38" y1="78" x2="38" y2="118" strokeWidth="6" />
            <circle cx="38" cy="74" r="5" fill={strokeColor} />
            <line x1="56" y1="84" x2="56" y2="118" strokeWidth="5" />
            <line x1="75" y1="82" x2="75" y2="118" strokeWidth="6" />
            <circle cx="75" cy="78" r="5" fill={strokeColor} />
            <line x1="93" y1="88" x2="93" y2="118" strokeWidth="5" />
            <line x1="108" y1="92" x2="108" y2="118" strokeWidth="5" />
          </g>

          {/* Right Fence */}
          <g stroke={strokeColor} strokeWidth="4" fill={strokeColor} strokeLinecap="round" strokeLinejoin="round">
            <line x1="282" y1="105" x2="372" y2="92" strokeWidth="5" />
            <line x1="282" y1="116" x2="362" y2="112" strokeWidth="4" />
            <line x1="292" y1="92" x2="292" y2="118" strokeWidth="5" />
            <line x1="307" y1="88" x2="307" y2="118" strokeWidth="5" />
            <line x1="325" y1="82" x2="325" y2="118" strokeWidth="6" />
            <circle cx="325" cy="78" r="5" fill={strokeColor} />
            <line x1="344" y1="84" x2="344" y2="118" strokeWidth="5" />
            <line x1="362" y1="78" x2="362" y2="118" strokeWidth="6" />
            <circle cx="362" cy="74" r="5" fill={strokeColor} />
          </g>

          {/* House Base Fill */}
          <polygon points="122,86 150,30 252,30 298,86 280,118 122,118" fill={houseFill} />
          
          {/* Chimney */}
          <rect x="126" y="26" width="16" height="32" fill={strokeColor} />

          {/* House Structure Outline & Main Peak Roof */}
          <g stroke={strokeColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1="100" y1="86" x2="148" y2="18" strokeWidth="7" />
            <line x1="148" y1="18" x2="198" y2="86" strokeWidth="7" />
            <line x1="122" y1="86" x2="122" y2="118" />
            <line x1="100" y1="86" x2="122" y2="86" />
            <line x1="148" y1="18" x2="278" y2="34" strokeWidth="7" />
            <line x1="278" y1="34" x2="304" y2="86" strokeWidth="7" />
            <line x1="180" y1="32" x2="265" y2="44" strokeWidth="5" />
          </g>

          {/* Slanted Roof Rafters (7 Slats) */}
          <g stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round">
            <line x1="188" y1="34" x2="208" y2="76" />
            <line x1="200" y1="36" x2="220" y2="76" />
            <line x1="212" y1="37" x2="232" y2="76" />
            <line x1="224" y1="39" x2="244" y2="76" />
            <line x1="236" y1="40" x2="256" y2="76" />
            <line x1="248" y1="42" x2="268" y2="76" />
            <line x1="260" y1="43" x2="280" y2="76" />
            <line x1="192" y1="76" x2="288" y2="76" strokeWidth="5.5" />
          </g>

          {/* Windows & Doors */}
          <g fill={strokeColor}>
            <rect x="145" y="90" width="10" height="10" rx="1" />
            <rect x="158" y="90" width="10" height="10" rx="1" />
            <rect x="145" y="103" width="10" height="10" rx="1" />
            <rect x="158" y="103" width="10" height="10" rx="1" />
            <rect x="238" y="92" width="18" height="26" rx="1" />
            <rect x="196" y="94" width="6" height="24" />
            <rect x="196" y="104" width="34" height="6" />
            <rect x="264" y="104" width="22" height="6" />
            <rect x="282" y="94" width="6" height="24" />
          </g>

          {/* Ground Baseline */}
          <line x1="18" y1="120" x2="382" y2="120" stroke={strokeColor} strokeWidth="6" strokeLinecap="square" />

          {/* Outer Frame Oval Border Stroke */}
          <ellipse cx="200" cy="115" rx="182" ry="103" fill="none" stroke={strokeColor} strokeWidth="11" />

          {/* 208 FENCE AND GATE Slab Serif Title */}
          <text 
            x="200" 
            y="152" 
            textAnchor="middle" 
            fill={titleColor} 
            fontFamily="'Space Grotesk', 'Rockwell', 'Impact', sans-serif" 
            fontWeight="900" 
            fontSize="23.5" 
            letterSpacing="4.5"
          >
            208 FENCE AND GATE
          </text>

          {/* Bottom Crescent Phone Badge */}
          {showPhone && (
            <g id="bottom-phone-badge-group">
              <path 
                d="M 54,168 Q 200,186 346,168 C 322,204 266,216 200,216 C 134,216 78,204 54,168 Z" 
                fill={phoneBg} 
              />
              <text 
                x="200" 
                y="196" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontFamily="'JetBrains Mono', monospace" 
                fontWeight="800" 
                fontSize="16.5" 
                letterSpacing="5"
              >
                [208] 358-9077
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
