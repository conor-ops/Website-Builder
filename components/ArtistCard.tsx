/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { ServiceItem } from '../types';
import { ArrowUpRight, ShieldCheck, Terminal, Layers } from 'lucide-react';

interface ArtistCardProps {
  artist: ServiceItem;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  const isDev = artist.division === 'developer';
  const isHybrid = artist.division === 'hybrid';

  return (
    <motion.div
      className={`group relative h-[420px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-slate-800/80 bg-[#070e17] cursor-pointer transition-colors duration-500 ${
        isDev 
          ? 'hover:border-[#00ff66]/40' 
          : 'hover:border-[#38bdf8]/40'
      }`}
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Image Background with Subtle Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={artist.image} 
          alt={artist.name} 
          className="h-full w-full object-cover grayscale will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.55, filter: 'grayscale(100%)' },
            hover: { scale: 1.06, opacity: 0.85, filter: isDev ? 'grayscale(30%) hue-rotate(90deg)' : 'grayscale(0%)' }
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        <div 
          className={`absolute inset-0 transition-colors duration-500 ${
            isDev 
              ? 'bg-black/60 group-hover:bg-[#002b12]/40' 
              : 'bg-black/50 group-hover:bg-[#0f2942]/40'
          }`} 
        />
      </div>

      {/* Developer Matrix scanline effect on hover */}
      {isDev && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.06)_1px,transparent_1px)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span 
              className={`text-xs font-mono font-semibold px-3 py-1 rounded-full backdrop-blur-md border uppercase tracking-wider flex items-center gap-1.5 ${
                isDev 
                  ? 'bg-black/70 text-[#00ff66] border-[#00ff66]/40 shadow-[0_0_10px_rgba(0,255,102,0.2)]' 
                  : isHybrid 
                    ? 'bg-[#0f233a]/80 text-[#38bdf8] border-[#38bdf8]/40'
                    : 'bg-[#0b1b2d]/80 text-slate-200 border-slate-700/60'
              }`}
            >
              {isDev ? <Terminal className="w-3 h-3 text-[#00ff66]" /> : isHybrid ? <Layers className="w-3 h-3 text-[#38bdf8]" /> : <ShieldCheck className="w-3 h-3 text-slate-300" />}
              {artist.day}
            </span>
          </div>

          <motion.div
            variants={{
              rest: { opacity: 0, x: 15, y: -15 },
              hover: { opacity: 1, x: 0, y: 0 }
            }}
            className={`rounded-full p-2.5 will-change-transform shadow-lg ${
              isDev 
                ? 'bg-[#00ff66] text-black shadow-[#00ff66]/40' 
                : 'bg-white text-slate-900 shadow-slate-900/50'
            }`}
          >
            <ArrowUpRight className="w-5 h-5 font-bold" />
          </motion.div>
        </div>

        <div>
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white tracking-tight will-change-transform drop-shadow-md"
              variants={{
                rest: { y: 0 },
                hover: { y: -4 }
              }}
              transition={{ duration: 0.4 }}
            >
              {artist.name}
            </motion.h3>
          </div>

          <motion.p 
            className={`text-xs md:text-sm font-semibold uppercase tracking-widest mt-2 will-change-transform ${
              isDev 
                ? 'text-[#00ff66] font-mono' 
                : 'text-[#93c5fd]'
            }`}
            variants={{
              rest: { opacity: 0.8, y: 0 },
              hover: { opacity: 1, y: -2 }
            }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            {artist.genre}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtistCard;