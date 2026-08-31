/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  Layers, 
  Hammer, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Sliders, 
  Sparkles, 
  Calculator, 
  Zap, 
  Check 
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import AIChat from './components/AIChat';
import FAQSection from './components/FAQSection';
import ServiceAreaMap from './components/ServiceAreaMap';
import GoogleWorkspaceHub from './components/GoogleWorkspaceHub';
import FacebookFenceHub from './components/FacebookFenceHub';
import GitHubSoftwareHub from './components/GitHubSoftwareHub';
import VertexOrchestratorHub from './components/VertexOrchestratorHub';
import DivisionSplitBanner from './components/DivisionSplitBanner';
import FenceEstimateTool from './components/FenceEstimateTool';
import TestimonialCarousel from './components/TestimonialCarousel';
import ProjectGallery from './components/ProjectGallery';
import { Logo } from './components/Logo';
import { ToastProvider, useToast } from './components/ToastContext';
import ToastContainer from './components/ToastContainer';
import { saveQuoteToFirestore } from './services/firebase';
import { ServiceItem, DivisionType } from './types';

const SERVICES_DATA: ServiceItem[] = [
  { 
    id: '1', 
    name: 'Western Red Cedar Privacy', 
    genre: 'Residential Contracting', 
    day: 'CONTRACTOR', 
    division: 'contractor',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    description: 'Precision-crafted Pacific Northwest Western Red Cedar privacy fencing. Engineered with steel-reinforced post systems, rot-board base protection, and weather-resistant structural framing built to withstand Idaho wind and snow loads.',
    features: [
      'Grade #1 Clear Western Red Cedar Pickets',
      'Heavy-duty PostMaster steel hidden posts',
      'Pressure-treated 2x4 framing with ring-shank nails',
      '10-Year Craftsmanship Warranty'
    ],
    pricingEstimate: 'From $34 / linear foot installed',
    metrics: [
      { label: 'Wind Rating', value: '85+ MPH' },
      { label: 'Lifespan', value: '25+ Yrs' }
    ]
  },
  { 
    id: '2', 
    name: 'Smart Automated Driveway Gates', 
    genre: 'Contractor + Smart Automation', 
    day: 'HYBRID', 
    division: 'hybrid',
    image: 'https://images.unsplash.com/photo-1584463699026-646700c25a07?q=80&w=1200&auto=format&fit=crop',
    description: 'Custom fabricated architectural driveway gates powered by solar or hardwired DC motors, optical obstruction detection, and smartphone-controlled perimeter telemetry for seamless estate entry.',
    features: [
      'Heavy-wall steel and aluminum custom fabrication',
      'LiftMaster & Ghost Controls commercial grade actuators',
      'Solar array charging with battery backup',
      'Smartphone app, keypads, and RFID vehicle tags'
    ],
    pricingEstimate: 'Custom systems from $3,450',
    metrics: [
      { label: 'Cycle Rating', value: '100k+ Cycles' },
      { label: 'Power Options', value: '12V Solar / 110V' }
    ]
  },
  { 
    id: '3', 
    name: 'Architectural Ornamental Iron', 
    genre: 'Residential Contracting', 
    day: 'CONTRACTOR', 
    division: 'contractor',
    image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1200&auto=format&fit=crop',
    description: 'Timeless welded steel and aluminum estate fencing featuring multi-stage electro-coat powder protection. Delivers maximum curb appeal, perimeter security, and swimming pool safety compliance.',
    features: [
      'Multi-stage electrostatic powder coating',
      'Self-closing magnetic MagnaLatch child-safe hinges',
      'Custom spear, flat-top, and puppy-picket options',
      'Zero-corrosion manufacturer guarantee'
    ],
    pricingEstimate: 'From $42 / linear foot installed',
    metrics: [
      { label: 'Coating', value: 'Industrial E-Coat' },
      { label: 'Pool Code', value: '100% Compliant' }
    ]
  },
  { 
    id: '4', 
    name: 'Maintenance-Free Vinyl & Composite', 
    genre: 'Residential Contracting', 
    day: 'CONTRACTOR', 
    division: 'contractor',
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1200&auto=format&fit=crop',
    description: 'High-impact virgin vinyl and composite perimeters engineered with internal aluminum reinforcement. Impervious to moisture, rot, fading, and peeling without requiring staining.',
    features: [
      'UV-stabilized virgin vinyl formulation',
      'Aluminum bottom-rail anti-sag channel',
      'Full privacy, lattice accent, and semi-privacy styles',
      'Lifetime non-fade manufacturer warranty'
    ],
    pricingEstimate: 'From $38 / linear foot installed',
    metrics: [
      { label: 'Maintenance', value: 'Zero Paint/Stain' },
      { label: 'UV Resistance', value: 'Class 1 Rating' }
    ]
  },
  { 
    id: '5', 
    name: 'FenceQuote OS & Estimating Platform', 
    genre: 'Software Development Lab', 
    day: 'DEVELOPER', 
    division: 'developer',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    description: 'Next-generation cloud estimating engine and GIS property parcel mapper built specifically for fence contractors. Automatically calculates linear footage, bill-of-materials, concrete yardage, and client proposals in seconds.',
    features: [
      'Satellite aerial GIS parcel boundary tracing',
      'Live dynamic supplier material cost calculations',
      'Instant interactive quote generation with e-signatures',
      'REST APIs & QuickBooks / CRM webhook sync'
    ],
    pricingEstimate: 'SaaS licensing from $199/mo',
    metrics: [
      { label: 'Estimate Speed', value: '< 2 Minutes' },
      { label: 'BOM Accuracy', value: '99.8%' }
    ]
  },
  { 
    id: '6', 
    name: 'SmartGate IoT Access & Controller API', 
    genre: 'Software Development Lab', 
    day: 'DEVELOPER', 
    division: 'developer',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    description: 'Microcontroller hardware firmware, LoRaWAN / cellular telemetry units, and secure cloud API for automated gate diagnostics, visitor guest passes, and automated license plate entry.',
    features: [
      'End-to-end encrypted MQTT & WebSockets telemetry',
      'Automatic license plate reader (ALPR) camera integration',
      'HomeKit, Google Home & custom Alexa integration skill',
      'Live gate status, battery voltage & fault alerts'
    ],
    pricingEstimate: 'Hardware + Cloud API Integration',
    metrics: [
      { label: 'Latency', value: '< 180ms' },
      { label: 'Encryption', value: 'AES-256' }
    ]
  },
];

const AppContent: React.FC = () => {
  const { showQuoteSuccessToast, showToast } = useToast();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeDivision, setActiveDivision] = useState<DivisionType>('all');
  
  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);

  // Quick Estimate Calculator State
  const [calcFeet, setCalcFeet] = useState<number>(150);
  const [calcMaterial, setCalcMaterial] = useState<'cedar' | 'vinyl' | 'iron' | 'gate'>('cedar');
  const [calcGates, setCalcGates] = useState<number>(1);

  // Handle keyboard navigation for service modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedService) return;
      if (e.key === 'ArrowLeft') navigateService('prev');
      if (e.key === 'ArrowRight') navigateService('next');
      if (e.key === 'Escape') setSelectedService(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedService]);

  const handlePurchase = async (index: number) => {
    setPurchasingIndex(index);
    const packageNames = [
      'Residential Fence Installation (Cedar/Vinyl)',
      'Automated Gate & Access Entry',
      'Contractor Software & IoT Lab'
    ];
    const generatedId = `208-BID-${Math.floor(100000 + Math.random() * 900000)}`;
    const packageName = packageNames[index] || 'Custom Residential Project';

    try {
      await saveQuoteToFirestore({
        customerName: 'Quote Package Request',
        email: 'admin@208fenceandgate.com',
        quoteId: generatedId,
        fenceType: packageName,
        linearFeet: calcFeet,
        estimatedCost: estimatedCost.low,
        status: 'pending',
        notes: `Selected package tier: ${packageName} with ${calcFeet} LF estimate`
      });

      showQuoteSuccessToast({
        quoteId: generatedId,
        email: 'admin@208fenceandgate.com',
        customerName: 'Package Lead',
        linearFeet: calcFeet,
        material: packageName,
        totalCost: estimatedCost.low,
        isEmailDispatched: true
      });
    } catch (e) {
      console.warn('Firestore save warning:', e);
      showQuoteSuccessToast({
        quoteId: generatedId,
        email: 'admin@208fenceandgate.com',
        customerName: 'Package Lead',
        linearFeet: calcFeet,
        material: packageName,
        totalCost: estimatedCost.low,
        isEmailDispatched: true
      });
    }
    setTimeout(() => {
      setPurchasingIndex(null);
      setPurchasedIndex(index);
    }, 1200);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredServices = SERVICES_DATA.filter(item => {
    if (activeDivision === 'all') return true;
    if (activeDivision === 'contractor') return item.division === 'contractor' || item.division === 'hybrid';
    if (activeDivision === 'developer') return item.division === 'developer' || item.division === 'hybrid';
    return true;
  });

  const navigateService = (direction: 'next' | 'prev') => {
    if (!selectedService) return;
    const currentIndex = SERVICES_DATA.findIndex(a => a.id === selectedService.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % SERVICES_DATA.length;
    } else {
      nextIndex = (currentIndex - 1 + SERVICES_DATA.length) % SERVICES_DATA.length;
    }
    setSelectedService(SERVICES_DATA[nextIndex]);
  };

  // Calculator price calculation
  const getEstimatedCost = () => {
    const ratePerFt = {
      cedar: 36,
      vinyl: 40,
      iron: 48,
      gate: 38
    }[calcMaterial];
    
    const gatePrice = calcMaterial === 'gate' ? 3450 : calcGates * 380;
    const baseTotal = calcFeet * ratePerFt + gatePrice;
    return {
      low: Math.round(baseTotal * 0.95),
      high: Math.round(baseTotal * 1.1)
    };
  };

  const estimatedCost = getEstimatedCost();
  const isMatrixMode = activeDivision === 'developer';

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-[#38bdf8] selection:text-slate-950 cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground mode={activeDivision} />
      <AIChat />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-4 bg-[#060e18]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {/* Official 208 Logo Emblem Badge */}
          <div className="relative w-12 h-10 md:w-14 md:h-11 rounded-xl bg-white/95 p-1 border border-slate-700/80 group-hover:border-[#38bdf8] group-hover:shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all duration-300 flex items-center justify-center overflow-hidden shadow-md">
            <img 
              src="/208logo.svg" 
              alt="208 Fence and Gate Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-heading text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[#38bdf8] transition-colors leading-none">
              208 FENCE & GATE
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase flex items-center gap-1.5 mt-1">
              <span className="text-[#38bdf8] font-bold">(208) 358-9077</span>
              <span className="w-1 h-1 rounded-full bg-[#00ff66]" />
              <span>Contractor & Lab</span>
            </div>
          </div>
        </div>
        
        {/* Desktop Menu & Division Switcher */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Division Focus Switcher */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-full border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveDivision('all')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeDivision === 'all' 
                  ? 'bg-slate-700 text-white font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveDivision('contractor')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                activeDivision === 'contractor' 
                  ? 'bg-[#1e40af] text-white font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hammer className="w-3 h-3" /> Contractor
            </button>
            <button
              onClick={() => setActiveDivision('developer')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                activeDivision === 'developer' 
                  ? 'bg-black text-[#00ff66] border border-[#00ff66]/50 font-bold shadow-[0_0_8px_rgba(0,255,102,0.3)]' 
                  : 'text-slate-400 hover:text-[#00ff66]'
              }`}
            >
              <Terminal className="w-3 h-3 text-[#00ff66]" /> Developer
            </button>
          </div>

          <div className="flex gap-4 xl:gap-6 text-xs font-bold tracking-widest uppercase text-slate-300">
            {[
              { label: 'Divisions', id: 'division-portal' },
              { label: 'Services', id: 'services' },
              { label: 'Gallery', id: 'project-gallery-section' },
              { label: 'Facebook (Fences)', id: 'facebook-hub' },
              { label: 'GitHub (Software)', id: 'github-hub' },
              { label: 'Vertex Orchestrator', id: 'vertex-orchestrator' },
              { label: 'Estimates', id: 'estimate' },
              { label: 'Reviews', id: 'testimonials-section' },
              { label: 'Service Map', id: 'service-map' },
              { label: 'Workspace Hub', id: 'workspace-hub' },
              { label: 'FAQ', id: 'faq-section' }
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => scrollToSection(item.id)}
                className={`transition-colors cursor-pointer bg-transparent border-none py-1 whitespace-nowrap ${
                  item.id === 'facebook-hub' 
                    ? 'text-[#1877F2] hover:text-white' 
                    : item.id === 'github-hub' 
                      ? 'text-[#00ff66] hover:text-white' 
                      : item.id === 'vertex-orchestrator'
                        ? 'text-[#00F2FE] hover:text-white'
                        : item.id === 'testimonials-section'
                        ? 'text-emerald-400 hover:text-white'
                        : item.id === 'project-gallery-section'
                          ? 'text-[#38bdf8] hover:text-white'
                          : 'hover:text-white'
                }`}
                data-hover="true"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => scrollToSection('estimate')}
            className="border border-slate-700 hover:border-[#38bdf8] bg-slate-900/60 hover:bg-[#1e3a8a] text-white px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer"
            data-hover="true"
          >
            Get Estimate
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#060e18]/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-4 lg:hidden px-6 overflow-y-auto py-12"
          >
            {/* Official Logo on Mobile Menu Header */}
            <div className="w-28 h-auto p-2 bg-white/95 rounded-2xl shadow-xl border border-slate-700/50 mb-1">
              <img 
                src="/208logo.svg" 
                alt="208 Fence & Gate Logo" 
                className="w-full h-auto object-contain" 
              />
            </div>
            <div className="text-xl font-heading font-bold text-center text-white">208 FENCE & GATE LLC</div>
            <p className="text-xs text-[#38bdf8] font-mono text-center max-w-xs font-semibold mb-1">
              (208) 358-9077 • Licensed Idaho Contractor
            </p>

            {/* Division Switcher on Mobile */}
            <div className="flex p-1 bg-slate-900 rounded-full border border-slate-800 text-xs font-mono mb-2">
              <button
                onClick={() => { setActiveDivision('all'); }}
                className={`px-4 py-1.5 rounded-full ${activeDivision === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => { setActiveDivision('contractor'); }}
                className={`px-4 py-1.5 rounded-full ${activeDivision === 'contractor' ? 'bg-[#1e40af] text-white font-bold' : 'text-slate-400'}`}
              >
                Contractor
              </button>
              <button
                onClick={() => { setActiveDivision('developer'); }}
                className={`px-4 py-1.5 rounded-full ${activeDivision === 'developer' ? 'bg-black text-[#00ff66] border border-[#00ff66]/60 font-bold' : 'text-slate-400'}`}
              >
                Developer
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 max-h-[45vh] overflow-y-auto w-full">
              {[
                { label: 'Divisions', id: 'division-portal' },
                { label: 'Services', id: 'services' },
                { label: 'Gallery Showcase', id: 'project-gallery-section' },
                { label: 'Facebook (Fences)', id: 'facebook-hub' },
                { label: 'GitHub (Software)', id: 'github-hub' },
                { label: 'Vertex Orchestrator', id: 'vertex-orchestrator' },
                { label: 'Estimate', id: 'estimate' },
                { label: 'Client Reviews', id: 'testimonials-section' },
                { label: 'Service Map', id: 'service-map' },
                { label: 'Workspace Hub', id: 'workspace-hub' },
                { label: 'FAQ', id: 'faq-section' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-lg font-heading font-bold transition-colors uppercase bg-transparent border-none py-1 ${
                    item.id === 'facebook-hub'
                      ? 'text-[#1877F2]'
                      : item.id === 'github-hub'
                        ? 'text-[#00ff66]'
                        : item.id === 'vertex-orchestrator'
                          ? 'text-[#00F2FE]'
                          : item.id === 'testimonials-section'
                          ? 'text-emerald-400'
                          : item.id === 'project-gallery-section'
                            ? 'text-[#38bdf8]'
                            : 'text-white hover:text-[#38bdf8]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button 
              onClick={() => scrollToSection('estimate')}
              className="mt-4 border border-slate-600 px-8 py-3.5 text-xs font-bold tracking-widest uppercase bg-[#1e40af] text-white rounded-lg w-full max-w-xs shadow-lg"
            >
              Request Bid / Calculate
            </button>
            
            <div className="mt-6 flex flex-col items-center gap-1 text-xs text-slate-400 font-mono">
              <span>admin@208fenceandgate.com</span>
              <span>Boise & Treasure Valley, Idaho</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl"
        >
          {/* Official Emblem & License Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 flex flex-col items-center"
          >
            <div className="w-32 md:w-44 p-2 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/60 hover:scale-105 transition-all duration-300 group cursor-pointer mb-4">
              <img 
                src="/208logo.svg" 
                alt="208 Fence and Gate" 
                className="w-full h-auto object-contain drop-shadow-md"
              />
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-mono text-slate-300 tracking-wider uppercase bg-[#0c1e33]/80 border border-slate-700/80 px-5 py-2 rounded-full backdrop-blur-md shadow-lg">
              <span className="text-[#38bdf8] font-bold">208 AREA CODE</span>
              <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full animate-ping"/>
              <span className="text-slate-400">RESIDENTIAL CONTRACTOR & SOFTWARE LAB</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text="208 FENCE & GATE" 
              as="h1" 
              variant={isMatrixMode ? 'matrix' : 'navy'}
              className="text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.95] font-black tracking-tight text-center" 
            />
            {/* Ambient Background Glow */}
            <motion.div 
               className={`absolute -z-20 w-[55vw] h-[55vw] rounded-full blur-[70px] pointer-events-none will-change-transform ${
                 isMatrixMode ? 'bg-[#00ff66]/10' : 'bg-[#1e40af]/15'
               }`}
               animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 7, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
             className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mt-6 mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-xl font-normal max-w-3xl mx-auto text-slate-300 leading-relaxed px-4"
          >
            Master craftsmanship in Western Red Cedar, maintenance-free vinyl, and automated driveway security gates — powered by custom contractor software, smart access control, and GIS estimation technology.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 px-4"
          >
            <button
              onClick={() => scrollToSection('estimate')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#0f2942] hover:from-[#2563eb] hover:to-[#1e3a8a] text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 border border-slate-600 shadow-xl shadow-blue-950/50 flex items-center gap-2.5 cursor-pointer"
              data-hover="true"
            >
              <Calculator className="w-4 h-4 text-[#38bdf8]" />
              <span>Instant Bid Calculator</span>
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 border border-slate-700/80 flex items-center gap-2 cursor-pointer"
              data-hover="true"
            >
              <span>Explore Builds & Code</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>
        </motion.div>

        {/* MARQUEE */}
        <div className="w-full mt-14 py-4 bg-[#081524] text-slate-200 overflow-hidden border-y border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-xl md:text-3xl font-heading font-extrabold px-8 flex items-center gap-4 text-slate-200">
                    208 FENCE & GATE LLC <span className="text-[#38bdf8] text-lg md:text-xl">●</span> 
                    WESTERN RED CEDAR PRIVACY <span className="text-slate-500 text-lg md:text-xl">●</span> 
                    AUTOMATED SOLAR DRIVEWAY GATES <span className="text-[#00ff66] text-lg md:text-xl">●</span> 
                    FENCEQUOTE OS SOFTWARE <span className="text-[#38bdf8] text-lg md:text-xl">●</span> 
                    POWDER-COATED ORNAMENTAL IRON <span className="text-slate-500 text-lg md:text-xl">●</span> 
                    BUILT IDAHO STRONG <span className="text-[#00ff66] text-lg md:text-xl">●</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* QUICK ESTIMATE CALCULATOR WIDGET */}
      <section className="relative z-10 py-10 px-4 md:px-6 max-w-5xl mx-auto -mt-6">
        <div className="bg-[#0c1c2e]/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#1e40af]/20 border border-[#38bdf8]/30">
                <Calculator className="w-6 h-6 text-[#38bdf8]" />
              </div>
              <div>
                <h3 className="font-heading text-lg md:text-xl font-bold text-white">Residential Fence & Gate Estimator</h3>
                <p className="text-xs text-slate-400 font-mono">Real-time linear foot & automation projection engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                Live 208 Rates
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Material Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">1. Select Discipline</label>
              <select
                value={calcMaterial}
                onChange={(e) => setCalcMaterial(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="cedar">Western Red Cedar ($36/ft)</option>
                <option value="vinyl">Maintenance-Free Vinyl ($40/ft)</option>
                <option value="iron">Ornamental Iron ($48/ft)</option>
                <option value="gate">Custom Automated Gate ($3,450+)</option>
              </select>
            </div>

            {/* Linear Footage Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                <span>2. Linear Footage</span>
                <span className="text-white font-bold">{calcFeet} LF</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={calcFeet}
                onChange={(e) => setCalcFeet(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>50 ft</span>
                <span>250 ft</span>
                <span>500 ft</span>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Estimated Budget Range</div>
              <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight my-1">
                ${estimatedCost.low.toLocaleString()} - ${estimatedCost.high.toLocaleString()}
              </div>
              <button
                onClick={() => scrollToSection('estimate')}
                className="text-xs font-bold text-[#38bdf8] hover:text-white transition-colors flex items-center gap-1 mt-1 font-mono uppercase"
              >
                <span>Lock In Estimate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL DIVISION ARCHITECTURE & SEPARATION PORTAL */}
      <div id="division-portal">
        <DivisionSplitBanner 
          activeDivision={activeDivision} 
          onSelectDivision={setActiveDivision} 
          onNavigateSection={scrollToSection} 
        />
      </div>

      {/* SERVICES / BUILDS SECTION */}
      <section id="services" className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 px-4 gap-6">
            <div>
              <div className="text-xs font-mono text-[#38bdf8] tracking-widest uppercase mb-2">
                Disciplines & Offerings
              </div>
              <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase leading-[0.95] text-white">
                BUILDS & <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] via-[#38bdf8] to-[#00ff66]">
                  SOFTWARE LAB
                </span>
              </h2>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All Offerings', value: 'all' },
                { label: 'Contractor (Fences & Gates)', value: 'contractor' },
                { label: 'Developer (Software & IoT)', value: 'developer' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveDivision(tab.value as DivisionType)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                    activeDivision === tab.value
                      ? tab.value === 'developer'
                        ? 'bg-black text-[#00ff66] border border-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                        : 'bg-[#1e40af] text-white border border-[#38bdf8]/40 shadow-lg'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                  data-hover="true"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-800/80 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
            {filteredServices.map((service) => (
              <ArtistCard 
                key={service.id} 
                artist={service} 
                onClick={() => setSelectedService(service)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE / ENGINEERING CAPABILITIES SECTION */}
      <section id="experience" className="relative z-10 py-20 md:py-32 bg-[#06101c]/90 backdrop-blur-md border-t border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="text-xs font-mono text-[#00ff66] tracking-widest uppercase mb-3">
                Contractor Rigor + Developer Innovation
              </div>
              <h2 className="text-3xl md:text-6xl font-heading font-bold mb-6 leading-tight text-white">
                PRECISION <br/> 
                <GradientText text="CRAFTSMANSHIP" variant="navy" className="text-4xl md:text-7xl" />
              </h2>
              <p className="text-base md:text-lg text-slate-300 mb-8 font-normal leading-relaxed">
                208 Fence and Gate LLC unites physical construction craftsmanship with software-grade precision. Every post, latch, motor actuator, and firmware endpoint is engineered for Idaho longevity.
              </p>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: Shield, 
                    title: 'Structural Perimeter Integrity', 
                    desc: 'Post holes set 36"+ deep with high-strength concrete footings and PostMaster structural steel reinforcements designed for 85+ MPH wind loads.',
                    accent: 'border-slate-700 bg-slate-900/60'
                  },
                  { 
                    icon: Cpu, 
                    title: 'Intelligent Gate Automation', 
                    desc: 'Linear and articulated arm gate openers with dual safety photo-eyes, solar charging options, and smartphone-enabled real-time access logs.',
                    accent: 'border-[#38bdf8]/30 bg-[#0f2942]/40'
                  },
                  { 
                    icon: Terminal, 
                    title: 'Proprietary Contractor Software', 
                    desc: 'We build the tools we use: GIS-powered estimation, automated bill-of-materials generators, and real-time client status dashboards.',
                    accent: 'border-[#00ff66]/30 bg-black/60'
                  },
                ].map((feature, i) => (
                  <div
                    key={i} 
                    className={`flex items-start gap-5 p-4 md:p-5 rounded-2xl border ${feature.accent} backdrop-blur-sm transition-transform hover:translate-x-1`}
                  >
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white shrink-0">
                      <feature.icon className="w-5 h-5 text-[#38bdf8]" />
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold mb-1 font-heading text-white">{feature.title}</h4>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative h-[420px] md:h-[620px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-[#00ff66] rounded-3xl rotate-2 opacity-20 blur-2xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-slate-700/80 group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1200&auto=format&fit=crop" 
                  alt="Craftsmanship & Engineering" 
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 will-change-transform grayscale group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e18] via-black/40 to-transparent opacity-90" />
                
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6">
                  <div className="text-4xl md:text-6xl font-heading font-bold text-white/90">
                    208 PRO
                  </div>
                  <div className="text-xs md:text-sm font-mono font-bold tracking-widest uppercase mt-1 text-[#38bdf8]">
                    Licensed • Insured • Software-Backed
                  </div>
                  <div className="mt-3 flex gap-3 flex-wrap">
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-black/60 border border-slate-600 text-slate-200">
                      Treasure Valley Service
                    </span>
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-black/60 border border-[#00ff66]/40 text-[#00ff66]">
                      Custom Code & CAD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTIMATE & PRICING PACKAGES SECTION */}
      <section id="estimate" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-[#040912] border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          
          {/* INTERACTIVE FENCE ESTIMATE ENGINE (CAD + BOM + PRICING) */}
          <FenceEstimateTool onQuoteSubmitted={(id) => console.log('Quote logged:', id)} />

          <div className="text-center mb-12 md:mb-16 mt-16 pt-16 border-t border-slate-800/80">
             <h2 className="text-4xl md:text-8xl font-heading font-extrabold text-slate-800 select-none uppercase tracking-tight">
               PACKAGES
             </h2>
             <p className="text-[#38bdf8] font-mono uppercase tracking-widest -mt-4 md:-mt-8 relative z-10 text-xs md:text-sm">
               Standard Turn-Key Contracting & Tech Service Tiers
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                name: 'Residential Fence Installation', 
                badge: 'CONTRACTOR DIVISION',
                price: '$34+', 
                unit: 'per linear foot',
                color: 'slate', 
                accent: 'bg-slate-900/70 border-slate-700/80',
                features: [
                  'Full on-site boundary survey & line locates',
                  'Choice of Western Red Cedar or Premium Vinyl',
                  'Post holes dug 36"+ deep with high-PSI concrete',
                  'Heavy-duty gate with self-closing hardware',
                  'Complete site cleanup & old fence haul-away',
                  '5-Year Full Craftsmanship Guarantee'
                ],
                ctaText: 'Request On-Site Bid'
              },
              { 
                name: 'Automated Gate & Access Entry', 
                badge: 'FLAGSHIP HYBRID',
                price: '$3,450+', 
                unit: 'complete installation',
                color: 'navy', 
                accent: 'bg-[#0b1f38]/80 border-[#38bdf8]/50 shadow-xl shadow-blue-950/40',
                popular: true,
                features: [
                  'Custom welded architectural iron or cedar gate',
                  'Commercial LiftMaster / Ghost Controls motor',
                  'Solar charging kit with dual deep-cycle battery backup',
                  'Dual optical obstacle safety photo-eyes',
                  '2 Keyfob remotes + weatherproof digital keypad',
                  'Smartphone mobile app configuration'
                ],
                ctaText: 'Design Automated Gate'
              },
              { 
                name: 'Contractor Software & IoT Lab', 
                badge: 'DEVELOPER DIVISION',
                price: '$199', 
                unit: 'mo / or custom build',
                color: 'matrix', 
                accent: 'bg-black/80 border-[#00ff66]/40 shadow-xl shadow-emerald-950/30',
                features: [
                  'FenceQuote OS contractor estimation license',
                  'SmartGate IoT remote controller firmware access',
                  'Aerial GIS parcel boundary auto-measure tool',
                  'Client interactive quote & e-signature portal',
                  'Automated supplier bill-of-materials sync',
                  'Custom API webhooks & CRM integrations'
                ],
                ctaText: 'Launch Tech Consultation'
              },
            ].map((pkg, i) => {
              const isPurchasing = purchasingIndex === i;
              const isPurchased = purchasedIndex === i;
              const isDisabled = (purchasingIndex !== null) || (purchasedIndex !== null);

              return (
                <motion.div
                  key={i}
                  whileHover={isDisabled ? {} : { y: -10 }}
                  className={`relative p-7 md:p-9 border rounded-2xl backdrop-blur-md flex flex-col min-h-[520px] transition-all duration-300 ${pkg.accent} ${isDisabled && !isPurchased ? 'opacity-50 grayscale' : ''} will-change-transform`}
                  data-hover={!isDisabled}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1e40af] text-white border border-[#38bdf8] text-[10px] font-mono font-bold tracking-widest uppercase shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="flex-1">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                      pkg.color === 'matrix' 
                        ? 'bg-black text-[#00ff66] border-[#00ff66]/40' 
                        : pkg.color === 'navy' 
                          ? 'bg-[#0f2942] text-[#38bdf8] border-[#38bdf8]/40' 
                          : 'bg-slate-800 text-slate-300 border-slate-600'
                    }`}>
                      {pkg.badge}
                    </span>

                    <h3 className="text-xl md:text-2xl font-heading font-bold mt-4 mb-2 text-white">
                      {pkg.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className={`text-4xl md:text-5xl font-extrabold tracking-tight ${
                        pkg.color === 'matrix' ? 'text-[#00ff66]' : pkg.color === 'navy' ? 'text-[#38bdf8]' : 'text-white'
                      }`}>
                        {pkg.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{pkg.unit}</span>
                    </div>

                    <div className="h-px bg-slate-800 mb-6" />

                    <ul className="space-y-3.5 text-xs text-slate-300">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                            pkg.color === 'matrix' ? 'text-[#00ff66]' : pkg.color === 'navy' ? 'text-[#38bdf8]' : 'text-slate-400'
                          }`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchase(i)}
                    disabled={isDisabled}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 mt-8 relative overflow-hidden font-mono
                      ${isPurchased 
                        ? 'bg-[#00ff66] text-black border-[#00ff66] cursor-default' 
                        : isPurchasing 
                          ? 'bg-slate-800 text-white cursor-wait border-slate-600'
                          : isDisabled 
                            ? 'cursor-not-allowed opacity-50 border-slate-700' 
                            : pkg.color === 'matrix'
                              ? 'bg-black text-[#00ff66] border-[#00ff66]/60 hover:bg-[#00ff66] hover:text-black shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                              : 'bg-[#1e40af] text-white border-[#38bdf8]/50 hover:bg-[#2563eb] shadow-lg'
                      }`}
                  >
                    <span>
                      {isPurchasing ? 'Processing Request...' : isPurchased ? 'Request Received ✓' : pkg.ctaText}
                    </span>
                  </button>
                  
                  {isPurchased && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 rounded-lg bg-black/60 border border-slate-800 text-center"
                    >
                      <p className="text-[11px] text-[#00ff66] font-mono font-semibold">
                        Thank you! We will reach out to schedule your on-site quote or software demo.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        Direct inquiries: admin@208fenceandgate.com
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FACEBOOK HUB FOR FENCE CONTRACTING DIVISION */}
      <FacebookFenceHub onQuoteRequest={() => scrollToSection('estimate')} />

      {/* GITHUB & GIT REPOSITORIES HUB FOR SOFTWARE DIVISION */}
      <GitHubSoftwareHub />

      {/* VERTEX ORCHESTRATOR — MULTI-AGENT INFRASTRUCTURE LANDING SECTION */}
      <VertexOrchestratorHub />

      {/* GOOGLE MAPS PLATFORM SERVICE DISPATCH MAP */}
      <ServiceAreaMap />

      {/* GOOGLE WORKSPACE (DRIVE, SHEETS, GMAIL, CALENDAR, TASKS, FORMS, PICKER) & FIREBASE HUB */}
      <GoogleWorkspaceHub />

      {/* COMPLETED PROJECT SHOWCASE & MULTI-SOURCE MASONRY IMAGE GALLERY (Firebase Storage, Google Drive, Google Photos) */}
      <ProjectGallery onQuoteRequest={(spec) => scrollToSection('estimate')} />

      {/* FAQ SECTION (Warranties, Gate Maintenance, Software Support) */}
      <FAQSection onNavigateToEstimate={() => scrollToSection('estimate')} />

      {/* TESTIMONIAL CAROUSEL (Pulls client reviews & satisfaction scores from Firestore) */}
      <TestimonialCarousel onQuoteRequest={() => scrollToSection('estimate')} />

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800 py-14 md:py-16 bg-[#040810]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-24 h-auto p-1.5 bg-white/95 rounded-xl border border-slate-700/60 shadow-md flex items-center justify-center">
                <img 
                  src="/208logo.svg" 
                  alt="208 Fence & Gate Logo" 
                  className="w-full h-auto object-contain" 
                />
              </div>
              <div>
                <div className="font-heading text-lg md:text-xl font-bold tracking-tight text-white leading-none">
                  208 FENCE & GATE LLC
                </div>
                <div className="text-[10px] font-mono text-[#38bdf8] font-bold uppercase mt-1">
                  (208) 358-9077
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              Residential fencing contractor and specialized software developer providing perimeter craftsmanship, automated gates, and cloud estimator technology in Idaho.
            </p>
            <div className="text-xs font-mono text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Boise, Meridian, Eagle, Nampa, Caldwell (208 Area)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                <a href="mailto:admin@208fenceandgate.com" className="hover:text-white transition-colors">
                  admin@208fenceandgate.com
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-bold mb-4">
              Core Capabilities & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>Western Red Cedar Privacy & Shadowbox</li>
              <li>Automated Solar & Electric Driveway Gates</li>
              <li>Powder-Coated Wrought Iron & Pool Safety</li>
              <li>Maintenance-Free Vinyl & Composite Perimeters</li>
              <li>FenceQuote OS Cloud Estimating Platform</li>
              <li>SmartGate IoT Firmware & Access Control APIs</li>
              <li className="pt-2 flex flex-col gap-1.5">
                <button 
                  onClick={() => scrollToSection('testimonials-section')} 
                  className="text-emerald-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs font-semibold"
                >
                  <span>→ Client Reviews & Satisfaction Scores</span>
                </button>
                <button 
                  onClick={() => scrollToSection('faq-section')} 
                  className="text-[#38bdf8] hover:text-white transition-colors flex items-center gap-1 font-mono text-xs font-semibold"
                >
                  <span>→ View Warranties, Maintenance & FAQ</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#00ff66] font-bold mb-4">
              Contractor & Software Direct
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Need a residential fence estimate or custom contractor software development? Our team is available 6 days a week.
            </p>
            <button
              onClick={() => scrollToSection('estimate')}
              className="px-5 py-2.5 rounded-lg bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors"
            >
              Request 208 Bid
            </button>
            <div className="mt-6 text-[10px] font-mono text-slate-500">
              © {new Date().getFullYear()} 208 Fence and Gate LLC. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* SERVICE DETAIL MODAL */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#081524] border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black/90 group/modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
                data-hover="true"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateService('prev'); }}
                className="absolute left-4 bottom-4 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-slate-800 transition-colors border border-slate-700 backdrop-blur-sm"
                data-hover="true"
                aria-label="Previous Service"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateService('next'); }}
                className="absolute right-4 bottom-4 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-slate-800 transition-colors border border-slate-700 backdrop-blur-sm md:right-6"
                data-hover="true"
                aria-label="Next Service"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-slate-950">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedService.id}
                    src={selectedService.image} 
                    alt={selectedService.name} 
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#081524] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-6 md:p-10 pb-20 md:pb-10 flex flex-col justify-center relative">
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                      selectedService.division === 'developer' 
                        ? 'bg-black text-[#00ff66] border-[#00ff66]/50' 
                        : 'bg-[#0f2942] text-[#38bdf8] border-[#38bdf8]/40'
                    }`}>
                      {selectedService.day}
                    </span>
                    <span className="text-slate-400 font-medium">{selectedService.genre}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-heading font-bold uppercase leading-tight mb-2 text-white">
                    {selectedService.name}
                  </h3>
                  
                  {selectedService.pricingEstimate && (
                    <p className="text-sm text-[#38bdf8] font-mono font-semibold mb-4">
                      {selectedService.pricingEstimate}
                    </p>
                  )}
                  
                  <p className="text-slate-300 leading-relaxed text-sm font-normal mb-6">
                    {selectedService.description}
                  </p>

                  {selectedService.features && (
                    <div className="mb-6">
                      <h4 className="text-xs font-mono uppercase text-slate-400 mb-2.5">Key Specifications:</h4>
                      <ul className="space-y-1.5 text-xs text-slate-200">
                        {selectedService.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedService.metrics && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {selectedService.metrics.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase">{m.label}</div>
                          <div className="text-sm font-bold text-white mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedService(null);
                      scrollToSection('estimate');
                    }}
                    className="w-full py-3 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Request Estimate for This</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
      <ToastContainer />
    </ToastProvider>
  );
};

export default App;
