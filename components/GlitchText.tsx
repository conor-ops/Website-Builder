/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'navy' | 'matrix' | 'silver' | 'default';
}

const GradientText: React.FC<GradientTextProps> = ({ 
  text, 
  as: Component = 'span', 
  className = '',
  variant = 'default' 
}) => {
  const getGradients = () => {
    switch(variant) {
      case 'matrix':
        return {
          main: 'from-white via-[#00ff66] via-[#10b981] via-[#00f0ff] to-white',
          glow: 'from-[#00ff66] via-[#10b981] to-[#00f0ff]',
          glowOpacity: 'opacity-45'
        };
      case 'navy':
        return {
          main: 'from-white via-[#93c5fd] via-[#60a5fa] via-[#cbd5e1] to-white',
          glow: 'from-[#3b82f6] via-[#1d4ed8] to-[#94a3b8]',
          glowOpacity: 'opacity-35'
        };
      case 'silver':
        return {
          main: 'from-white via-[#f1f5f9] via-[#94a3b8] via-[#e2e8f0] to-white',
          glow: 'from-[#ffffff] via-[#cbd5e1] to-[#64748b]',
          glowOpacity: 'opacity-25'
        };
      default:
        return {
          main: 'from-white via-[#60a5fa] via-[#38bdf8] via-[#00ff66] to-white',
          glow: 'from-[#3b82f6] via-[#00ff66] to-[#0ea5e9]',
          glowOpacity: 'opacity-35'
        };
    }
  };

  const { main, glow, glowOpacity } = getGradients();

  return (
    <Component className={`relative inline-block font-black tracking-tighter isolate ${className}`}>
      {/* Main Gradient Text */}
      <motion.span
        className={`absolute inset-0 z-10 block bg-gradient-to-r ${main} bg-[length:200%_auto] bg-clip-text text-transparent will-change-[background-position]`}
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {text}
      </motion.span>
      
      {/* Base layer for solid white fallback */}
      <span 
        className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 opacity-60"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' 
        }}
      >
        {text}
      </span>
      
      {/* Blur Glow Effect */}
      <span
        className={`absolute inset-0 -z-10 block bg-gradient-to-r ${glow} bg-[length:200%_auto] bg-clip-text text-transparent blur-xl md:blur-2xl ${glowOpacity}`}
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)' 
        }}
      >
        {text}
      </span>
    </Component>
  );
};

export default GradientText;

