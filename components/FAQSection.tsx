/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ShieldCheck, 
  Wrench, 
  Terminal, 
  HelpCircle, 
  FileCheck, 
  Mail, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'warranties' | 'maintenance' | 'software';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FAQItem[] = [
  // Residential Fence Warranties
  {
    id: 'warranty-craftsmanship',
    category: 'warranties',
    categoryLabel: 'Fence Warranty',
    question: 'What does the 208 Fence and Gate residential craftsmanship warranty cover?',
    answer: 'We provide a comprehensive 5-to-10 Year Craftsmanship Guarantee on all residential fence installations. This covers structural framing alignment, gate hinge squareness, post setting depth integrity, and fastener retention. If a gate sags or structural post shifts due to installation factors during the warranty period, we inspect and adjust it at zero cost.',
    highlights: ['5 to 10-Year Craftsmanship Guarantee', 'Zero-cost adjustments for installation defects', 'Annual structural checkup availability']
  },
  {
    id: 'warranty-materials',
    category: 'warranties',
    categoryLabel: 'Fence Warranty',
    question: 'How do material warranties compare between Western Red Cedar, Vinyl, and Ornamental Iron?',
    answer: 'Each material features tailored manufacturer protection. Grade #1 Western Red Cedar pickets are backed by natural rot resistance and our rot-board isolation system; PostMaster steel posts feature a 15-year corrosion warranty; premium virgin vinyl carries a transferable Lifetime Manufacturer Warranty against chipping, cracking, or UV yellowing; and our powder-coated ornamental iron is electro-coated with a 20-year finish guarantee.',
    highlights: ['Lifetime Non-Fade Vinyl Warranty', '20-Year Ornamental Iron E-Coat Finish', '15-Year Steel PostMaster Anti-Corrosion']
  },
  {
    id: 'warranty-wind-snow',
    category: 'warranties',
    categoryLabel: 'Fence Warranty',
    question: 'Are 208 fences warrantied against Idaho high winds and winter snow loads?',
    answer: 'Yes. All fence lines in the Treasure Valley and higher-elevation areas are engineered with post footings set 36 inches or deeper into native soil using high-PSI concrete. Our PostMaster steel systems and 3-rail pressure-treated horizontal framing are rated for wind gusts up to 85+ MPH, drastically outperforming standard wood-post construction.',
    highlights: ['85+ MPH Wind Rating', '36"+ Deep Concrete Footings below frost line', 'Engineered for heavy winter snow accumulation']
  },

  // Automated Gate Maintenance
  {
    id: 'gate-winter-maintenance',
    category: 'maintenance',
    categoryLabel: 'Gate Maintenance',
    question: 'How should I prepare and maintain my automated driveway gate for freezing Idaho winters?',
    answer: 'Cold weather requires two critical checks: 1) Battery health on solar or DC backup operators (we install low-temperature AGM or LiFePO4 batteries with trickle charge regulators), and 2) Lubrication of pivot joints and actuator screw drives with silicone or lithium-based low-temp grease. We recommend keeping ground tracks clear of packed ice and testing safety reverse photo-eyes monthly.',
    highlights: ['Low-temp silicone lubrication on pivots', 'Winterized AGM/LiFePO4 battery management', 'Monthly photo-eye alignment checks']
  },
  {
    id: 'gate-service-intervals',
    category: 'maintenance',
    categoryLabel: 'Gate Maintenance',
    question: 'What is the recommended maintenance schedule for motorized gate systems?',
    answer: 'We recommend bi-annual preventive maintenance for residential gates (Spring & Fall). Our service technicians lubricate roller bearings, verify drive-chain tension or hydraulic pressure, test UL 325 safety reverse sensors, inspect loop detectors, and update operator control board firmware to prevent unexpected lockouts.',
    highlights: ['Bi-annual Spring/Fall inspections', 'UL 325 safety obstacle verification', 'Chain/Arm tension calibration & board diagnostics']
  },
  {
    id: 'gate-emergency-manual',
    category: 'maintenance',
    categoryLabel: 'Gate Maintenance',
    question: 'What happens if there is a power outage or operator failure?',
    answer: 'Every automated system installed by 208 Fence & Gate includes an emergency manual release key and built-in battery backup that provides 20-50 full open/close cycles during power interruptions. Solar configurations remain self-sustaining off-grid.',
    highlights: ['Emergency keyed manual disconnect', '20-50 cycle battery backup reserve', 'Off-grid solar charging redundancy']
  },

  // Software Support Packages
  {
    id: 'software-fencequote-support',
    category: 'software',
    categoryLabel: 'Software Lab',
    question: 'What support and SLA are included with FenceQuote OS contractor licenses?',
    answer: 'FenceQuote OS includes 99.9% cloud uptime SLA, real-time dynamic material price catalog synchronization, GIS parcel layer updates, and dedicated technical support via ticket and live screen-share. Enterprise plans include custom domain white-labeling, automated CRM webhook syncing, and QuickBooks integration onboarding.',
    highlights: ['99.9% Cloud Uptime Guarantee', 'Live GIS parcel boundary database updates', 'Dedicated contractor technical support']
  },
  {
    id: 'software-smartgate-iot',
    category: 'software',
    categoryLabel: 'Software Lab',
    question: 'How do firmware updates and cloud telemetry work for SmartGate IoT controllers?',
    answer: 'SmartGate IoT controllers connect over dual Wi-Fi/Cellular LTE with AES-256 encrypted MQTT pipelines. Security patches and feature upgrades are delivered Over-The-Air (OTA) automatically. Homeowners and property managers receive instant smartphone push alerts for gate-ajar status, forced entry detection, and battery voltage degradation.',
    highlights: ['Over-The-Air (OTA) secure firmware updates', 'AES-256 encrypted telemetry pipelines', 'Push notifications for gate status & faults']
  },
  {
    id: 'software-custom-integrations',
    category: 'software',
    categoryLabel: 'Software Lab',
    question: 'Can 208 develop custom access control APIs or contractor tooling for my business?',
    answer: 'Yes! Our software development lab specializes in building customized REST/GraphQL APIs, contractor estimating portals, automatic license plate recognition (ALPR) camera integrations, and mobile access apps tailored to your HOA, commercial facility, or fencing enterprise.',
    highlights: ['Custom REST/GraphQL APIs', 'ALPR & RFID automated vehicle entry', 'Tailored HOA & contractor web applications']
  }
];

interface FAQSectionProps {
  onOpenAssistant?: () => void;
  onNavigateToEstimate?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenAssistant,
  onNavigateToEstimate
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'warranties' | 'maintenance' | 'software'>('all');
  const [openId, setOpenId] = useState<string | null>('warranty-craftsmanship');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = FAQ_DATA.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq-section" className="relative z-10 py-16 md:py-24 px-4 md:px-6 bg-[#050c17] border-t border-slate-800/90">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-widest mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Client Knowledge Base & FAQs</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">
              FREQUENTLY ASKED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] via-[#38bdf8] to-[#00ff66]">
                QUESTIONS & POLICIES
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Clear answers regarding our Idaho fence craftsmanship warranties, automated gate preventative service schedules, and developer software SLA packages.
            </p>
          </div>

          {/* Quick Search & Category Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              {[
                { label: 'All FAQs', value: 'all', icon: HelpCircle },
                { label: 'Warranties', value: 'warranties', icon: ShieldCheck },
                { label: 'Gate Maintenance', value: 'maintenance', icon: Wrench },
                { label: 'Software Lab', value: 'software', icon: Terminal },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activeCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    id={`faq-tab-${tab.value}`}
                    onClick={() => setActiveCategory(tab.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? tab.value === 'software'
                          ? 'bg-black text-[#00ff66] border border-[#00ff66]/50 shadow-[0_0_8px_rgba(0,255,102,0.25)]'
                          : 'bg-[#1e40af] text-white border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                    data-hover="true"
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-400 font-mono">No matching questions found.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="mt-3 text-xs text-[#38bdf8] font-mono hover:underline"
              >
                Reset FAQ Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              const isSoftware = faq.category === 'software';
              const isMaintenance = faq.category === 'maintenance';

              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className={`rounded-xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                    isOpen
                      ? isSoftware
                        ? 'bg-black/90 border-[#00ff66]/40 shadow-lg shadow-emerald-950/20'
                        : isMaintenance
                          ? 'bg-[#08192d]/90 border-[#38bdf8]/50 shadow-lg shadow-sky-950/20'
                          : 'bg-[#0a1829]/90 border-slate-600/80 shadow-lg shadow-slate-950/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4.5 md:px-6 md:py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                    data-hover="true"
                  >
                    <div className="flex items-center gap-3.5 flex-1 pr-2">
                      <div className={`p-2 rounded-lg shrink-0 border ${
                        isSoftware 
                          ? 'bg-black border-[#00ff66]/30 text-[#00ff66]' 
                          : isMaintenance 
                            ? 'bg-[#0f2942] border-[#38bdf8]/30 text-[#38bdf8]' 
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        {isSoftware ? (
                          <Terminal className="w-4 h-4" />
                        ) : isMaintenance ? (
                          <Wrench className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                            isSoftware 
                              ? 'bg-black/80 text-[#00ff66] border-[#00ff66]/40' 
                              : isMaintenance 
                                ? 'bg-[#0c2238] text-[#38bdf8] border-[#38bdf8]/40' 
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {faq.categoryLabel}
                          </span>
                        </div>
                        <h3 className="text-sm md:text-base font-heading font-bold text-white tracking-tight">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div className={`p-2 rounded-full border transition-transform duration-300 shrink-0 ${
                      isOpen
                        ? isSoftware 
                          ? 'bg-[#00ff66] text-black border-[#00ff66] rotate-180' 
                          : 'bg-[#1e40af] text-white border-[#38bdf8] rotate-180'
                        : 'bg-slate-800 text-slate-400 border-slate-700 rotate-0'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 md:px-6 md:pb-6 pt-1 border-t border-slate-800/80">
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                            {faq.answer}
                          </p>

                          {faq.highlights && faq.highlights.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap gap-2">
                              {faq.highlights.map((highlight, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-black/40 border border-slate-700 text-slate-300 flex items-center gap-1.5"
                                >
                                  <FileCheck className={`w-3 h-3 ${isSoftware ? 'text-[#00ff66]' : 'text-[#38bdf8]'}`} />
                                  <span>{highlight}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Banner in Footer Area */}
        <div className="mt-10 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#071322] via-[#0a1e36] to-[#05111f] border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1e40af]/30 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shrink-0">
              <Sparkles className="w-6 h-6 text-[#38bdf8]" />
            </div>
            <div>
              <h4 className="text-base font-heading font-bold text-white">
                Have a specific site layout or custom software question?
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Our virtual AI estimator is available 24/7, or reach our Idaho contractor desk directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="mailto:admin@208fenceandgate.com"
              id="faq-email-direct-btn"
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-mono font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
              data-hover="true"
            >
              <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Email Support</span>
            </a>
            <button
              id="faq-get-quote-cta"
              onClick={onNavigateToEstimate}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              data-hover="true"
            >
              <span>Get 208 Bid</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
