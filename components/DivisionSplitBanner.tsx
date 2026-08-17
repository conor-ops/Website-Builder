/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Hammer, 
  Terminal, 
  Shield, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Code, 
  Share2, 
  GitBranch, 
  MapPin, 
  Sparkles,
  Layers
} from 'lucide-react';
import { DivisionType } from '../types';

interface DivisionSplitBannerProps {
  activeDivision: DivisionType;
  onSelectDivision: (division: DivisionType) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const DivisionSplitBanner: React.FC<DivisionSplitBannerProps> = ({
  activeDivision,
  onSelectDivision,
  onNavigateSection
}) => {
  return (
    <section className="relative z-10 py-10 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300 mb-3 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>DUAL DIVISION ENTERPRISE ARCHITECTURE</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white uppercase tracking-tight">
          Two Specialized Divisions. One High Standard.
        </h2>
        <p className="text-xs md:text-sm text-slate-400 font-mono max-w-2xl mx-auto mt-1">
          Select a division below to customize your experience, explore live social feeds, or review engineering repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DIVISION 1: CONTRACTOR & PHYSICAL FENCING */}
        <div 
          onClick={() => onSelectDivision('contractor')}
          className={`relative rounded-3xl p-7 md:p-9 border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group ${
            activeDivision === 'contractor'
              ? 'bg-gradient-to-br from-[#0c223d] via-[#09182b] to-[#040c17] border-[#38bdf8] shadow-2xl shadow-blue-950/60 ring-2 ring-[#38bdf8]/50'
              : 'bg-[#071322]/80 border-slate-800 hover:border-slate-700'
          }`}
          id="division-card-contractor"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hammer className="w-40 h-40 text-[#38bdf8]" />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-3 rounded-2xl bg-[#1e40af]/30 border border-[#38bdf8]/40 text-[#38bdf8]">
                  <Hammer className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#38bdf8] uppercase">
                    Physical Construction
                  </span>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                    Fence & Gate Contracting
                  </h3>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                activeDivision === 'contractor'
                  ? 'bg-[#38bdf8] text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {activeDivision === 'contractor' ? 'Active Focus' : 'Select'}
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              Master residential fence installation in Western Red Cedar, high-impact virgin vinyl, and ornamental welded iron. Engineered with PostMaster steel hidden posts, 811 utility locates, and full 5-Year Craftsmanship Guarantee.
            </p>

            {/* Division Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>Cedar & Vinyl Privacy</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>PostMaster Steel Posts</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>Automated Solar Gates</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>5-Year Craft Warranty</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateSection('facebook-hub');
              }}
              className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Facebook Job Feed & Reviews</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateSection('estimate');
              }}
              className="text-xs font-mono font-bold text-[#38bdf8] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Instant Bid Calculator →</span>
            </button>
          </div>
        </div>

        {/* DIVISION 2: SOFTWARE & IOT DEVELOPMENT LAB */}
        <div 
          onClick={() => onSelectDivision('developer')}
          className={`relative rounded-3xl p-7 md:p-9 border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group ${
            activeDivision === 'developer'
              ? 'bg-gradient-to-br from-[#02140a] via-[#010a05] to-black border-[#00ff66] shadow-2xl shadow-emerald-950/60 ring-2 ring-[#00ff66]/50'
              : 'bg-[#040c07]/80 border-slate-800 hover:border-slate-700'
          }`}
          id="division-card-developer"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Terminal className="w-4 h-4 text-[#00ff66]" />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-3 rounded-2xl bg-black border border-[#00ff66]/50 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.2)]">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#00ff66] uppercase">
                    Software & Hardware Lab
                  </span>
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white">
                    Contractor Tech & IoT Lab
                  </h3>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                activeDivision === 'developer'
                  ? 'bg-[#00ff66] text-black shadow-md'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {activeDivision === 'developer' ? 'Active Focus' : 'Select'}
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              Software engineering, ESP32 microcontrollers, GIS parcel boundary estimators, and RESTful cloud APIs. We write the firmware, build the algorithms, and automate access control hardware from the ground up.
            </p>

            {/* Division Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/70 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>ESP32 SmartGate Firmware</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/70 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>FenceQuote GIS Engine</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/70 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>REST APIs & Webhooks</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/70 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />
                <span>ALPR & LoRa Telemetry</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateSection('github-hub');
              }}
              className="px-4 py-2 rounded-xl bg-black hover:bg-slate-900 text-[#00ff66] border border-[#00ff66]/50 text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,255,102,0.2)]"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub Repositories & SDKs</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateSection('github-hub');
              }}
              className="text-xs font-mono font-bold text-[#00ff66] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>API Sandbox Console →</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DivisionSplitBanner;
