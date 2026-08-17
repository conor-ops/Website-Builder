/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FluidBackgroundProps {
  mode?: 'all' | 'contractor' | 'developer';
}

const StarField: React.FC<{ isMatrix?: boolean }> = ({ isMatrix }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 3,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.6 + 0.2
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full will-change-[opacity,transform] ${
            isMatrix ? 'bg-[#00ff66]' : 'bg-slate-200'
          }`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: p.opacity, scale: 1 }}
          animate={{
            opacity: [p.opacity, 0.9, p.opacity],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC<FluidBackgroundProps> = ({ mode = 'all' }) => {
  const isMatrix = mode === 'developer';
  const isContractor = mode === 'contractor';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#060e18] via-[#0b1b2d] to-[#040810] transition-colors duration-1000">
      <StarField isMatrix={isMatrix} />

      {/* Grid Pattern Overlay for Contractor Blueprint / Developer Matrix Wireframe */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isMatrix 
            ? 'opacity-[0.12] bg-[linear-gradient(to_right,#00ff6615_1px,transparent_1px),linear-gradient(to_bottom,#00ff6615_1px,transparent_1px)] bg-[size:40px_40px]' 
            : 'opacity-[0.06] bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:48px_48px]'
        }`} 
      />

      {/* Blob 1: Deep Navy / Steel Grey or Matrix Emerald */}
      <motion.div
        className={`absolute top-[-15%] left-[-10%] w-[85vw] h-[85vw] rounded-full mix-blend-screen filter blur-[60px] will-change-transform transition-colors duration-1000 ${
          isMatrix 
            ? 'bg-[#00ff66] opacity-15' 
            : isContractor 
              ? 'bg-[#1e3a8a] opacity-35' 
              : 'bg-[#1d4ed8] opacity-25'
        }`}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 2: Slate Grey / Silver or Cyber Cyan */}
      <motion.div
        className={`absolute top-[25%] right-[-15%] w-[90vw] h-[75vw] rounded-full mix-blend-screen filter blur-[60px] will-change-transform transition-colors duration-1000 ${
          isMatrix 
            ? 'bg-[#00f0ff] opacity-15' 
            : isContractor 
              ? 'bg-[#64748b] opacity-20' 
              : 'bg-[#38bdf8] opacity-15'
        }`}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 3: Deep Midnight Indigo / Carbon Charcoal */}
      <motion.div
        className={`absolute bottom-[-20%] left-[15%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[60px] will-change-transform transition-colors duration-1000 ${
          isMatrix 
            ? 'bg-[#059669] opacity-20' 
            : isContractor 
              ? 'bg-[#334155] opacity-25' 
              : 'bg-[#1e40af] opacity-20'
        }`}
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Subtle Digital Rain / Laser scanline accent when in developer mode */}
      {isMatrix && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_50%,rgba(0,0,0,0.4)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40 animate-pulse" />
      )}

      {/* Static Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;
