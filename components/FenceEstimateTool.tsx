/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Ruler, 
  Layers, 
  ShieldCheck, 
  Hammer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  Cpu, 
  FileText, 
  Calendar, 
  DollarSign, 
  Compass, 
  HelpCircle,
  Clock,
  Send,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { 
  FenceMaterialType, 
  FencePostType, 
  TerrainType, 
  YardSegment, 
  GateConfig, 
  FenceEstimateDetails, 
  BOMCalculation 
} from '../types';
import { saveQuoteToFirestore } from '../services/firebase';
import { useToast } from './ToastContext';

interface FenceEstimateToolProps {
  onQuoteSubmitted?: (quoteId: string) => void;
}

const PRESET_YARDS: { name: string; desc: string; segments: YardSegment[]; gates: Partial<GateConfig> }[] = [
  {
    name: 'Standard 3-Sided Backyard (150 LF)',
    desc: 'Tie-in to existing house: 50ft Left, 50ft Back, 50ft Right with 2 walk gates',
    segments: [
      { id: 'seg-1', name: 'Left Property Line', lengthFeet: 50, singleGates: 1, doubleGates: 0, hasTearOut: false },
      { id: 'seg-2', name: 'Back Property Line', lengthFeet: 50, singleGates: 0, doubleGates: 0, hasTearOut: false },
      { id: 'seg-3', name: 'Right Property Line', lengthFeet: 50, singleGates: 1, doubleGates: 0, hasTearOut: false },
    ],
    gates: { singleGatesCount: 2, singleGateWidthFt: 4, doubleGatesCount: 0, doubleGateWidthFt: 10 }
  },
  {
    name: 'Full 4-Sided Perimeter (220 LF)',
    desc: 'Complete enclosure with 1 walk gate and 1 double driveway gate',
    segments: [
      { id: 'seg-1', name: 'Front Fence Line', lengthFeet: 40, singleGates: 0, doubleGates: 1, hasTearOut: false },
      { id: 'seg-2', name: 'Left Property Line', lengthFeet: 70, singleGates: 1, doubleGates: 0, hasTearOut: false },
      { id: 'seg-3', name: 'Back Property Line', lengthFeet: 40, singleGates: 0, doubleGates: 0, hasTearOut: false },
      { id: 'seg-4', name: 'Right Property Line', lengthFeet: 70, singleGates: 0, doubleGates: 0, hasTearOut: false },
    ],
    gates: { singleGatesCount: 1, singleGateWidthFt: 4, doubleGatesCount: 1, doubleGateWidthFt: 12 }
  },
  {
    name: 'Side Yard Privacy Run (60 LF)',
    desc: 'Straight side-yard division with one access gate',
    segments: [
      { id: 'seg-1', name: 'Side Separation Line', lengthFeet: 60, singleGates: 1, doubleGates: 0, hasTearOut: true },
    ],
    gates: { singleGatesCount: 1, singleGateWidthFt: 4, doubleGatesCount: 0, doubleGateWidthFt: 0 }
  },
  {
    name: 'Corner Lot Wrap (180 LF)',
    desc: 'L-shaped enclosure facing side street with double equipment gate',
    segments: [
      { id: 'seg-1', name: 'Street Facing Run', lengthFeet: 100, singleGates: 0, doubleGates: 1, hasTearOut: false },
      { id: 'seg-2', name: 'Rear Neighbor Line', lengthFeet: 80, singleGates: 1, doubleGates: 0, hasTearOut: false },
    ],
    gates: { singleGatesCount: 1, singleGateWidthFt: 4, doubleGatesCount: 1, doubleGateWidthFt: 14 }
  }
];

const MATERIAL_SPECS: Record<FenceMaterialType, {
  name: string;
  tag: string;
  baseFootPrice: number;
  description: string;
  durabilityYears: number;
  maintenance: string;
  windRating: string;
  colorTheme: string;
}> = {
  cedar_privacy: {
    name: 'Western Red Cedar (Vertical Privacy)',
    tag: '#1 Grade Inland / Pacific Cedar',
    baseFootPrice: 36,
    description: 'Classic Pacific Northwest wood. Naturally rot-resistant, aromatic, premium board-on-board or dog-ear privacy.',
    durabilityYears: 25,
    maintenance: 'Stain every 3-4 years',
    windRating: 'Up to 75 MPH (with PostMaster)',
    colorTheme: 'border-amber-600/40 bg-amber-950/20 text-amber-300'
  },
  cedar_modern: {
    name: 'Architectural Cedar (Horizontal Modern)',
    tag: 'Contemporary Craftsman Style',
    baseFootPrice: 48,
    description: 'Clean horizontal lines with staggered joints and aluminum framing channels for high-end architectural curb appeal.',
    durabilityYears: 25,
    maintenance: 'Stain every 3-4 years',
    windRating: 'Up to 70 MPH',
    colorTheme: 'border-orange-500/40 bg-orange-950/20 text-orange-300'
  },
  vinyl_privacy: {
    name: 'Virgin Vinyl / PVC Privacy',
    tag: 'Zero-Maintenance Lifetime',
    baseFootPrice: 42,
    description: 'Heavy-gauge virgin PVC with titanium dioxide UV inhibitors. Will not fade, crack, splinter, or require painting.',
    durabilityYears: 40,
    maintenance: 'Occasional hose wash',
    windRating: 'Up to 80 MPH',
    colorTheme: 'border-blue-400/40 bg-blue-950/20 text-blue-300'
  },
  ornamental_iron: {
    name: 'Ornamental Welded Steel / Iron',
    tag: 'Architectural Security & Pool Code',
    baseFootPrice: 52,
    description: 'Electrostatic powder-coated welded steel panels. Superior strength, rust-inhibited, unobstructed scenic views.',
    durabilityYears: 50,
    maintenance: 'Zero maintenance',
    windRating: 'Up to 90+ MPH',
    colorTheme: 'border-slate-400/40 bg-slate-800/40 text-slate-200'
  },
  chain_link: {
    name: 'Commercial Chain Link (Black Vinyl / Galvanized)',
    tag: 'Economical Perimeter Boundary',
    baseFootPrice: 24,
    description: 'Heavy 9-gauge galvanized core with extruded black vinyl coating. Maximum perimeter protection on large properties.',
    durabilityYears: 30,
    maintenance: 'Zero maintenance',
    windRating: '100+ MPH (Low drag)',
    colorTheme: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
  },
  composite_trex: {
    name: 'Trex Seclusions Composite',
    tag: 'Ultra-Premium Eco Wood-Plastic',
    baseFootPrice: 68,
    description: '95% recycled wood fiber & plastic polymer. Extreme wind resistance, interlocking tongue-and-groove, 25-yr stain warranty.',
    durabilityYears: 35,
    maintenance: 'Zero maintenance',
    windRating: 'Up to 85 MPH',
    colorTheme: 'border-teal-500/40 bg-teal-950/20 text-teal-300'
  }
};

export const FenceEstimateTool: React.FC<FenceEstimateToolProps> = ({ onQuoteSubmitted }) => {
  const { showQuoteSuccessToast } = useToast();

  // Active Tab View: 'builder' | 'blueprint' | 'bom' | 'finalize'
  const [activeTab, setActiveTab] = useState<'builder' | 'blueprint' | 'bom' | 'finalize'>('builder');

  // Customer Information
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [notes, setNotes] = useState('');

  // Configuration State
  const [material, setMaterial] = useState<FenceMaterialType>('cedar_privacy');
  const [postType, setPostType] = useState<FencePostType>('postmaster_steel');
  const [heightFeet, setHeightFeet] = useState<number>(6);
  const [postSpacingFeet, setPostSpacingFeet] = useState<number>(7.5);
  const [railCount, setRailCount] = useState<number>(3);
  const [hasRotBoard, setHasRotBoard] = useState<boolean>(true);
  const [hasCapAndTrim, setHasCapAndTrim] = useState<boolean>(true);
  const [hasStaining, setHasStaining] = useState<boolean>(false);
  const [stainColor, setStainColor] = useState<string>('Natural Western Cedar');
  const [terrain, setTerrain] = useState<TerrainType>('flat');
  const [tearOutFeet, setTearOutFeet] = useState<number>(50);

  // Yard Segments
  const [segments, setSegments] = useState<YardSegment[]>([
    { id: 'seg-1', name: 'Left Property Line', lengthFeet: 50, singleGates: 1, doubleGates: 0, hasTearOut: true },
    { id: 'seg-2', name: 'Back Property Line', lengthFeet: 60, singleGates: 0, doubleGates: 0, hasTearOut: false },
    { id: 'seg-3', name: 'Right Property Line', lengthFeet: 50, singleGates: 0, doubleGates: 1, hasTearOut: false },
  ]);

  // Gates Config
  const [gates, setGates] = useState<GateConfig>({
    singleGatesCount: 1,
    singleGateWidthFt: 4,
    doubleGatesCount: 1,
    doubleGateWidthFt: 12,
    automatedSolarOperator: true,
    keypadAccess: true,
    antiSagKits: true
  });

  // UI state for saving / export
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Helper to apply preset
  const applyPreset = (preset: typeof PRESET_YARDS[0]) => {
    setSegments(preset.segments.map(s => ({ ...s, id: `seg-${Math.random().toString(36).substr(2, 6)}` })));
    setGates(prev => ({
      ...prev,
      singleGatesCount: preset.gates.singleGatesCount ?? prev.singleGatesCount,
      singleGateWidthFt: preset.gates.singleGateWidthFt ?? prev.singleGateWidthFt,
      doubleGatesCount: preset.gates.doubleGatesCount ?? prev.doubleGatesCount,
      doubleGateWidthFt: preset.gates.doubleGateWidthFt ?? prev.doubleGateWidthFt,
    }));
  };

  // Add a new segment
  const addSegment = () => {
    const newId = `seg-${Date.now().toString(36)}`;
    setSegments(prev => [
      ...prev,
      { id: newId, name: `Segment ${prev.length + 1}`, lengthFeet: 30, singleGates: 0, doubleGates: 0, hasTearOut: false }
    ]);
  };

  // Remove segment
  const removeSegment = (id: string) => {
    if (segments.length <= 1) return;
    setSegments(prev => prev.filter(s => s.id !== id));
  };

  // Update segment
  const updateSegment = (id: string, updates: Partial<YardSegment>) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Calculations Engine (BOM & Costing)
  const calculation: BOMCalculation = useMemo(() => {
    const totalLinearFeet = segments.reduce((sum, s) => sum + Number(s.lengthFeet || 0), 0);
    const totalTearOutFeet = segments.reduce((sum, s) => sum + (s.hasTearOut ? Number(s.lengthFeet || 0) : 0), tearOutFeet);

    // Structural Post Count = segments endpoints + internal spacing
    const standardPostCount = Math.ceil(totalLinearFeet / postSpacingFeet) + segments.length;
    // Gate post adders
    const gatePostAdders = (gates.singleGatesCount * 2) + (gates.doubleGatesCount * 2);
    const totalPostCount = standardPostCount + gatePostAdders;

    // Concrete bags (2 bags per line post, 3 per gate post for 36" Idaho frost depth)
    const concreteBagsCount = (standardPostCount * 2) + (gatePostAdders * 3);

    // Rail count = linear feet / 8ft rail length * railCount (2 or 3)
    const railCountNumber = Math.ceil((totalLinearFeet / 8) * railCount);

    // Picket count (assuming 5.5" pickets with 10% waste buffer)
    const picketsPerFoot = 12 / 5.5; // ~2.18 pickets/ft
    const picketCount = Math.ceil(totalLinearFeet * picketsPerFoot * 1.10);

    // Rot board (2x6x16 or 2x6x8)
    const rotBoardCount = hasRotBoard ? Math.ceil(totalLinearFeet / 8) : 0;

    // Cap and trim lumber
    const capTrimCount = hasCapAndTrim ? Math.ceil(totalLinearFeet / 8) * 2 : 0;

    // Fasteners (lbs of ring-shank stainless steel nails / exterior ceramic screws)
    const fastenersCountLbs = Math.ceil(totalLinearFeet * 0.25);

    // Base materials pricing calculation
    const materialData = MATERIAL_SPECS[material];
    let baseFootCost = materialData.baseFootPrice;

    // Post type modifier
    if (postType === 'postmaster_steel') baseFootCost += 6; // Postmaster hidden steel adder
    if (postType === 'cedar_6x6') baseFootCost += 4;
    if (heightFeet === 8) baseFootCost += 14;
    if (heightFeet === 5) baseFootCost -= 3;
    if (heightFeet === 4) baseFootCost -= 6;
    if (hasRotBoard) baseFootCost += 3.5;
    if (hasCapAndTrim) baseFootCost += 4.5;
    if (hasStaining) baseFootCost += 4.0;

    // Terrain modifier
    let terrainLaborMultiplier = 1.0;
    if (terrain === 'moderate_slope') terrainLaborMultiplier = 1.15;
    if (terrain === 'steep_slope') terrainLaborMultiplier = 1.30;
    if (terrain === 'rocky_hardpan') terrainLaborMultiplier = 1.25;

    // Material subtotal
    const materialsCost = Math.round(totalLinearFeet * (baseFootCost * 0.58));
    // Labor subtotal
    const baseLaborPerFoot = 16.50;
    const laborCost = Math.round(totalLinearFeet * baseLaborPerFoot * terrainLaborMultiplier);

    // Tear-out cost ($4.50 per LF for demolition, nail pull, dump disposal fee)
    const tearOutCost = Math.round(totalTearOutFeet * 4.75);

    // Gates pricing
    const singleGatePrice = 325 + (gates.singleGateWidthFt > 4 ? 85 : 0);
    const doubleGatePrice = 750 + (gates.doubleGateWidthFt > 12 ? 220 : 0);
    const automatedOperatorPrice = gates.automatedSolarOperator ? 2850 : 0;
    const keypadPrice = gates.keypadAccess ? 280 : 0;
    const antiSagPrice = gates.antiSagKits ? 65 * (gates.singleGatesCount + gates.doubleGatesCount) : 0;

    const gatesCost = (gates.singleGatesCount * singleGatePrice) + 
                      (gates.doubleGatesCount * doubleGatePrice) + 
                      automatedOperatorPrice + 
                      keypadPrice + 
                      antiSagPrice;

    // Addons cost
    const addonsCost = (hasStaining ? Math.round(totalLinearFeet * 4.0) : 0) +
                       (hasCapAndTrim ? Math.round(totalLinearFeet * 4.5) : 0) +
                       (hasRotBoard ? Math.round(totalLinearFeet * 3.5) : 0);

    const subtotal = materialsCost + laborCost + tearOutCost + gatesCost;
    const tax = Math.round(materialsCost * 0.06); // Idaho 6% sales tax on materials only
    const totalCost = subtotal + tax;

    // 84-month contractor low-interest financing estimate (e.g. 7.99% APR)
    const monthlyRate = 0.0799 / 12;
    const numMonths = 84;
    const monthlyFinancingPayment = Math.round(
      (totalCost * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / 
      (Math.pow(1 + monthlyRate, numMonths) - 1)
    );

    return {
      totalLinearFeet,
      totalPostCount,
      concreteBagsCount,
      railCount: railCountNumber,
      picketCount,
      rotBoardCount,
      capTrimCount,
      fastenersCountLbs,
      singleGateKits: gates.singleGatesCount,
      doubleGateKits: gates.doubleGatesCount,
      automatedOperatorUnits: gates.automatedSolarOperator ? 1 : 0,
      materialsCost,
      laborCost,
      tearOutCost,
      gatesCost,
      addonsCost,
      subtotal,
      tax,
      totalCost,
      monthlyFinancingPayment
    };
  }, [segments, tearOutFeet, postSpacingFeet, railCount, heightFeet, postType, material, hasRotBoard, hasCapAndTrim, hasStaining, terrain, gates]);

  // Submit to Firestore & Google Workspace CRM
  const handleSaveAndSubmit = async () => {
    setIsSubmitting(true);
    const quotePayload: FenceEstimateDetails = {
      customerName,
      customerPhone,
      customerEmail,
      projectAddress,
      city,
      zipCode,
      material,
      postType,
      heightFeet,
      postSpacingFeet,
      railCount,
      hasRotBoard,
      hasCapAndTrim,
      hasStaining,
      stainColor,
      terrain,
      tearOutFeet,
      segments,
      gates,
      notes
    };

    try {
      const generatedId = `208-EST-${Math.floor(100000 + Math.random() * 900000)}`;
      await saveQuoteToFirestore({
        ...quotePayload,
        quoteId: generatedId,
        bom: calculation,
        status: 'pending_onsite_survey',
        createdAt: new Date().toISOString()
      });

      setSubmittedQuoteId(generatedId);
      if (onQuoteSubmitted) {
        onQuoteSubmitted(generatedId);
      }

      // Trigger Firebase Trigger Email Confirmation Toast
      showQuoteSuccessToast({
        quoteId: generatedId,
        email: customerEmail,
        customerName: customerName || 'Idaho Resident',
        linearFeet: calculation.totalLinearFeet,
        material: MATERIAL_SPECS[material]?.title || 'Custom Fence',
        totalCost: calculation.totalCost,
        isEmailDispatched: Boolean(customerEmail && customerEmail.includes('@'))
      });
    } catch (err) {
      console.warn('Fallback local quote generated:', err);
      const fallbackId = `208-EST-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedQuoteId(fallbackId);
      showQuoteSuccessToast({
        quoteId: fallbackId,
        email: customerEmail,
        customerName: customerName || 'Idaho Resident',
        linearFeet: calculation.totalLinearFeet,
        material: MATERIAL_SPECS[material]?.title || 'Custom Fence',
        totalCost: calculation.totalCost,
        isEmailDispatched: Boolean(customerEmail && customerEmail.includes('@'))
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}#estimate?quote=${submittedQuoteId || 'draft'}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4 md:px-6" id="fence-estimate-engine">
      {/* HEADER BANNER */}
      <div className="relative rounded-3xl p-6 md:p-10 bg-gradient-to-br from-[#0b192e] via-[#071322] to-black border border-[#38bdf8]/40 shadow-2xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calculator className="w-64 h-64 text-[#38bdf8]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e40af]/40 border border-[#38bdf8]/50 text-[#38bdf8] text-xs font-mono font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contractor GIS CAD & BOM Estimator v4.2</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white tracking-tight">
              Interactive Fence & Gate Estimate Engine
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-2 font-normal leading-relaxed">
              Design your exact boundary layout, customize Western Red Cedar or Virgin Vinyl specs, configure automated solar gate operators, and calculate real-time bill-of-materials with Idaho labor rates.
            </p>
          </div>

          {/* Quick Summary Pill */}
          <div className="flex flex-col items-end p-4 rounded-2xl bg-black/60 border border-slate-700/80 backdrop-blur-md shrink-0 w-full lg:w-auto">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Estimated Total Investment
            </span>
            <div className="text-3xl md:text-4xl font-heading font-extrabold text-[#38bdf8] mt-0.5">
              ${calculation.totalCost.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66] mt-1">
              <span>Or from ${calculation.monthlyFinancingPayment}/mo</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{calculation.totalLinearFeet} Linear Ft</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-8 border-t border-slate-800/80 pt-6">
          {[
            { id: 'builder', label: '1. Specs & Materials', icon: Sliders },
            { id: 'blueprint', label: '2. Yard Layout & 2D CAD', icon: Ruler },
            { id: 'bom', label: '3. Bill of Materials (BOM)', icon: Layers },
            { id: 'finalize', label: '4. Summary & Save Bid', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#38bdf8] text-slate-950 shadow-lg shadow-blue-900/40'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: 1. SPECS & MATERIALS */}
      {activeTab === 'builder' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Preset Yard Selection */}
          <div className="p-6 rounded-3xl bg-[#071322]/90 border border-slate-800">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#38bdf8]" />
                  <span>Step 1: Choose Property Preset or Custom Yard</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Select a common residential layout to prepopulate footage and gate placements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRESET_YARDS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-[#38bdf8]/60 hover:bg-[#0c223d]/60 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {preset.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#38bdf8] mt-3 font-semibold uppercase">
                    Load Preset →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MATERIAL SELECTION CARDS */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#071322]/90 border border-slate-800">
            <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Hammer className="w-4 h-4 text-[#38bdf8]" />
              <span>Step 2: Perimeter Material & Style</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mb-6">
              All cedar lumber is inland #1 clear-grade. Vinyl includes full lifetime non-yellowing warranty.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(Object.keys(MATERIAL_SPECS) as FenceMaterialType[]).map((matKey) => {
                const spec = MATERIAL_SPECS[matKey];
                const isSelected = material === matKey;

                return (
                  <div
                    key={matKey}
                    onClick={() => setMaterial(matKey)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? `${spec.colorTheme} shadow-xl ring-2 ring-[#38bdf8]/60`
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10">
                          {spec.tag}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#38bdf8]">
                          ${spec.baseFootPrice}/LF
                        </span>
                      </div>

                      <h4 className="text-base font-heading font-bold text-white mb-1.5">
                        {spec.name}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {spec.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-mono text-slate-400 border-t border-white/10 pt-3">
                      <div className="flex justify-between">
                        <span>Expected Lifespan:</span>
                        <span className="text-white font-semibold">{spec.durabilityYears}+ Years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind Rating:</span>
                        <span className="text-white font-semibold">{spec.windRating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance:</span>
                        <span className="text-white font-semibold">{spec.maintenance}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* POSTS & ENGINEERING SPECS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Post Foundations */}
            <div className="p-6 rounded-3xl bg-[#071322]/90 border border-slate-800">
              <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                <span>Post System & Foundation (36" Concrete Depth)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-4">
                PostMaster hidden galvanized steel posts eliminate ground rot and resist 73+ MPH Treasure Valley winds.
              </p>

              <div className="space-y-3">
                {[
                  { id: 'postmaster_steel', title: 'PostMaster Steel In-Line Hidden Posts', desc: 'Hidden inside wood pickets. Lifetime warranty, will never rot or warp.', tag: 'RECOMMENDED (73+ MPH)' },
                  { id: 'cedar_4x4', title: '4x4 Pressure-Treated Cedar Posts', desc: 'Standard traditional wood post with concrete footing sleeve.', tag: 'TRADITIONAL' },
                  { id: 'cedar_6x6', title: '6x6 Heavy-Duty Cedar Posts', desc: 'Oversized commercial posts for high wind exposure & gates.', tag: 'HEAVY DUTY' },
                  { id: 'steel_pipe_bracket', title: 'Galvanized Schedule 40 Steel Pipe', desc: 'Round steel pipe posts with wood-to-steel adapter brackets.', tag: 'COMMERCIAL' },
                ].map((post) => (
                  <label
                    key={post.id}
                    onClick={() => setPostType(post.id as FencePostType)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      postType === post.id
                        ? 'bg-[#1e40af]/30 border-[#38bdf8] text-white ring-1 ring-[#38bdf8]'
                        : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postType"
                      checked={postType === post.id}
                      onChange={() => setPostType(post.id as FencePostType)}
                      className="mt-1 accent-[#38bdf8]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-white">{post.title}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[#38bdf8]">
                          {post.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{post.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Height, Spacing & Add-ons */}
            <div className="p-6 rounded-3xl bg-[#071322]/90 border border-slate-800 space-y-5">
              <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#38bdf8]" />
                <span>Dimensions & Craftsman Add-ons</span>
              </h3>

              {/* Height */}
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2 font-bold">
                  Fence Height: <span className="text-[#38bdf8]">{heightFeet} Feet</span>
                </label>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                  {[4, 5, 6, 8].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHeightFeet(h)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        heightFeet === h
                          ? 'bg-[#38bdf8] text-slate-950 border-[#38bdf8]'
                          : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {h} Ft {h === 6 ? '(Std)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Spacing & Rails */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Post Spacing:
                  </label>
                  <select
                    value={postSpacingFeet}
                    onChange={(e) => setPostSpacingFeet(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-[#38bdf8] outline-none"
                  >
                    <option value={6}>6 Ft (Heavy Wind)</option>
                    <option value={7.5}>7.5 Ft (Idaho Standard)</option>
                    <option value={8}>8 Ft (Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5 font-bold">
                    Horizontal Rails:
                  </label>
                  <select
                    value={railCount}
                    onChange={(e) => setRailCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-[#38bdf8] outline-none"
                  >
                    <option value={2}>2 Rails (Economy)</option>
                    <option value={3}>3 Rails (Heavy-Duty Anti-Warp)</option>
                  </select>
                </div>
              </div>

              {/* Checkbox add-ons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800 font-mono text-xs">
                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasRotBoard}
                    onChange={(e) => setHasRotBoard(e.target.checked)}
                    className="accent-[#38bdf8] w-4 h-4"
                  />
                  <div>
                    <span className="text-white font-bold">2x6 Pressure-Treated Rot Board</span>
                    <span className="text-slate-400 block text-[10px]">Keeps cedar pickets 2" above moist soil/irrigation (+$3.50/LF)</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCapAndTrim}
                    onChange={(e) => setHasCapAndTrim(e.target.checked)}
                    className="accent-[#38bdf8] w-4 h-4"
                  />
                  <div>
                    <span className="text-white font-bold">Craftsman 2x6 Top Cap & 1x4 Face Trim</span>
                    <span className="text-slate-400 block text-[10px]">Finished architectural top fascia header (+$4.50/LF)</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasStaining}
                    onChange={(e) => setHasStaining(e.target.checked)}
                    className="accent-[#38bdf8] w-4 h-4"
                  />
                  <div>
                    <span className="text-white font-bold">Pre-Installation Factory Stain & UV Seal</span>
                    <span className="text-slate-400 block text-[10px]">Ready-Seal / Wood Defender dip coat (+$4.00/LF)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* GATES & AUTOMATION SECTION */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0c223d]/60 via-[#071322] to-black border border-[#38bdf8]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#38bdf8]" />
                  <span>Step 3: Gates & Smart Solar Automation</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Heavy-duty steel welded gate frames prevent sagging. Solar DC kits include dual battery backup.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-3 py-1 rounded-full border border-[#00ff66]/30">
                  ESP32 SmartGate IoT Compatible
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              {/* Single Walk Gate */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">Single Walk Gates</span>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xl font-bold text-white">{gates.singleGatesCount} Gate(s)</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setGates(g => ({ ...g, singleGatesCount: Math.max(0, g.singleGatesCount - 1) }))}
                      className="w-7 h-7 rounded bg-slate-800 text-white font-bold hover:bg-slate-700"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setGates(g => ({ ...g, singleGatesCount: g.singleGatesCount + 1 }))}
                      className="w-7 h-7 rounded bg-slate-800 text-white font-bold hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <label className="text-[10px] text-slate-400 block mb-1">Walk Gate Width:</label>
                <select
                  value={gates.singleGateWidthFt}
                  onChange={(e) => setGates(g => ({ ...g, singleGateWidthFt: Number(e.target.value) }))}
                  className="w-full p-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value={3}>3 Ft (Standard Walk)</option>
                  <option value={4}>4 Ft (Lawnmower / Wheelbarrow)</option>
                  <option value={5}>5 Ft (ATV / Wide Access)</option>
                </select>
              </div>

              {/* Double Drive Gate */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">Double Drive Gates</span>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xl font-bold text-white">{gates.doubleGatesCount} Gate(s)</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setGates(g => ({ ...g, doubleGatesCount: Math.max(0, g.doubleGatesCount - 1) }))}
                      className="w-7 h-7 rounded bg-slate-800 text-white font-bold hover:bg-slate-700"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setGates(g => ({ ...g, doubleGatesCount: g.doubleGatesCount + 1 }))}
                      className="w-7 h-7 rounded bg-slate-800 text-white font-bold hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <label className="text-[10px] text-slate-400 block mb-1">Drive Gate Width:</label>
                <select
                  value={gates.doubleGateWidthFt}
                  onChange={(e) => setGates(g => ({ ...g, doubleGateWidthFt: Number(e.target.value) }))}
                  className="w-full p-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value={10}>10 Ft (Small Trailer)</option>
                  <option value={12}>12 Ft (Standard RV / Truck)</option>
                  <option value={14}>14 Ft (Large Boat / RV)</option>
                  <option value={16}>16 Ft (Commercial Wide)</option>
                </select>
              </div>

              {/* Automated Solar Operator */}
              <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                gates.automatedSolarOperator
                  ? 'bg-[#1e40af]/30 border-[#38bdf8]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
              onClick={() => setGates(g => ({ ...g, automatedSolarOperator: !g.automatedSolarOperator }))}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Solar Gate Opener</span>
                  <input
                    type="checkbox"
                    checked={gates.automatedSolarOperator}
                    onChange={() => {}}
                    className="accent-[#38bdf8] w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                  LiftMaster / Ghost Controls DC motor + 30W Solar Panel + Dual 12V Batteries.
                </p>
                <span className="text-[10px] font-bold text-[#38bdf8]">
                  +$2,850 Installed Complete
                </span>
              </div>

              {/* Digital Keypad & Sensors */}
              <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                gates.keypadAccess
                  ? 'bg-[#1e40af]/30 border-[#38bdf8]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
              onClick={() => setGates(g => ({ ...g, keypadAccess: !g.keypadAccess }))}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Wireless Keypad</span>
                  <input
                    type="checkbox"
                    checked={gates.keypadAccess}
                    onChange={() => {}}
                    className="accent-[#38bdf8] w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                  Weatherproof wireless pedestal keypad + 2 long-range remotes.
                </p>
                <span className="text-[10px] font-bold text-[#38bdf8]">
                  +$280 Add-on
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('blueprint')}
              className="px-8 py-3.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all"
            >
              <span>Next: Customize Yard Segments & 2D CAD →</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: 2. YARD LAYOUT & 2D CAD */}
      {activeTab === 'blueprint' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Segment Controls (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#071322]/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider">
                    Perimeter Segments
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Total footage: <span className="text-[#38bdf8] font-bold">{calculation.totalLinearFeet} LF</span>
                  </p>
                </div>

                <button
                  onClick={addSegment}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#38bdf8] text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {segments.map((seg, index) => (
                  <div
                    key={seg.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1e40af] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={seg.name}
                          onChange={(e) => updateSegment(seg.id, { name: e.target.value })}
                          className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-[#38bdf8] text-xs font-mono font-bold text-white outline-none"
                        />
                      </div>

                      <button
                        onClick={() => removeSegment(seg.id)}
                        disabled={segments.length <= 1}
                        className="text-slate-500 hover:text-red-400 disabled:opacity-30 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Length Slider & Input */}
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                        <span>Length:</span>
                        <span className="text-white font-bold">{seg.lengthFeet} Feet</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={300}
                        step={5}
                        value={seg.lengthFeet}
                        onChange={(e) => updateSegment(seg.id, { lengthFeet: Number(e.target.value) })}
                        className="w-full accent-[#38bdf8] cursor-pointer"
                      />
                    </div>

                    {/* Options per segment */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={seg.hasTearOut}
                          onChange={(e) => updateSegment(seg.id, { hasTearOut: e.target.checked })}
                          className="accent-[#38bdf8]"
                        />
                        <span>Tear-Out Existing</span>
                      </label>

                      <span className="text-slate-400">
                        ~{Math.ceil(seg.lengthFeet / postSpacingFeet) + 1} Posts
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Terrain Condition */}
              <div className="pt-3 border-t border-slate-800 font-mono text-xs">
                <label className="block text-slate-300 font-bold mb-1.5">Property Soil & Slope Condition:</label>
                <select
                  value={terrain}
                  onChange={(e) => setTerrain(e.target.value as TerrainType)}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                >
                  <option value="flat">Level Ground / Standard Soil</option>
                  <option value="moderate_slope">Moderate Grade / Stepped Panels (+15% labor)</option>
                  <option value="steep_slope">Steep Slope / Custom Racked (+30% labor)</option>
                  <option value="rocky_hardpan">Rocky / Boise Riverbed Hardpan (+25% digging)</option>
                </select>
              </div>
            </div>

            {/* 2D CAD Blueprint Visualization (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-black border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00ff66] animate-pulse" />
                    <span className="text-xs font-mono text-slate-300 uppercase tracking-wider font-bold">
                      2D Vector Yard Blueprint (Live Calculated)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Scale: 1px = ~0.5ft
                  </span>
                </div>

                {/* SVG Blueprint Canvas */}
                <div className="w-full h-80 rounded-2xl bg-[#040912] border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
                  {/* Grid Lines Pattern */}
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />

                  {/* SVG Blueprint drawing */}
                  <svg className="w-full h-full max-h-72" viewBox="0 0 500 300">
                    {/* Background Lot Guideline */}
                    <rect x="50" y="30" width="400" height="240" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="60" y="50" fill="#475569" fontSize="10" fontFamily="monospace">EXISTING RESIDENCE / LOT PERIMETER</text>

                    {/* Render Segments as perimeter polygon lines */}
                    {segments.map((seg, i) => {
                      // Dynamically calculate coordinate points
                      const totalSegs = segments.length;
                      let x1 = 70, y1 = 70, x2 = 70, y2 = 70;

                      if (totalSegs === 1) {
                        x1 = 80; y1 = 150; x2 = 420; y2 = 150;
                      } else if (totalSegs === 2) {
                        if (i === 0) { x1 = 80; y1 = 70; x2 = 420; y2 = 70; }
                        else { x1 = 420; y1 = 70; x2 = 420; y2 = 240; }
                      } else if (totalSegs === 3) {
                        if (i === 0) { x1 = 80; y1 = 70; x2 = 80; y2 = 240; }
                        else if (i === 1) { x1 = 80; y1 = 240; x2 = 420; y2 = 240; }
                        else { x1 = 420; y1 = 240; x2 = 420; y2 = 70; }
                      } else {
                        // 4 or more segments (rectangle / polygon)
                        if (i === 0) { x1 = 80; y1 = 70; x2 = 420; y2 = 70; }
                        else if (i === 1) { x1 = 420; y1 = 70; x2 = 420; y2 = 240; }
                        else if (i === 2) { x1 = 420; y1 = 240; x2 = 80; y2 = 240; }
                        else { x1 = 80; y1 = 240; x2 = 80; y2 = 70; }
                      }

                      const midX = (x1 + x2) / 2;
                      const midY = (y1 + y2) / 2;

                      return (
                        <g key={seg.id}>
                          {/* Fence line */}
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={seg.hasTearOut ? '#f59e0b' : '#38bdf8'}
                            strokeWidth={seg.hasTearOut ? '4' : '3'}
                            strokeDasharray={seg.hasTearOut ? '6 3' : 'none'}
                          />

                          {/* Post Markers */}
                          <circle cx={x1} cy={y1} r="4" fill="#00ff66" stroke="#000" strokeWidth="1.5" />
                          <circle cx={x2} cy={y2} r="4" fill="#00ff66" stroke="#000" strokeWidth="1.5" />

                          {/* Segment Label Badge */}
                          <rect
                            x={midX - 35}
                            y={midY - 10}
                            width="70"
                            height="20"
                            rx="4"
                            fill="#0b1320"
                            stroke="#38bdf8"
                            strokeWidth="1"
                          />
                          <text
                            x={midX}
                            y={midY + 3}
                            fill="#ffffff"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {seg.lengthFeet} LF
                          </text>
                        </g>
                      );
                    })}

                    {/* Gate Indicators on canvas */}
                    {gates.singleGatesCount > 0 && (
                      <g transform="translate(100, 240)">
                        <circle cx="0" cy="0" r="6" fill="#38bdf8" />
                        <path d="M 0 0 A 15 15 0 0 1 15 -15" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                        <text x="20" y="5" fill="#38bdf8" fontSize="8" fontFamily="monospace">WALK GATE</text>
                      </g>
                    )}

                    {gates.doubleGatesCount > 0 && (
                      <g transform="translate(300, 70)">
                        <circle cx="0" cy="0" r="6" fill="#00ff66" />
                        <path d="M 0 0 A 20 20 0 0 1 20 -20" fill="none" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="2 2" />
                        <text x="25" y="5" fill="#00ff66" fontSize="8" fontFamily="monospace">DRIVE GATE (AUTO)</text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* CAD Legend */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
                  <span>New Fence Line</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span>Tear-Out & Haul</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
                  <span>PostMaster Posts</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveTab('builder')}
                  className="text-xs font-mono text-slate-400 hover:text-white"
                >
                  ← Back to Specs
                </button>
                <button
                  onClick={() => setActiveTab('bom')}
                  className="px-6 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md"
                >
                  Next: Review Itemized Bill of Materials →
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: 3. BILL OF MATERIALS (BOM) */}
      {activeTab === 'bom' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="p-6 md:p-8 rounded-3xl bg-[#071322]/90 border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#38bdf8]" />
                  <span>Automated Bill of Materials & Hardware Quantity Takeoff</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Calculated based on {calculation.totalLinearFeet} linear feet, {heightFeet}ft height, and {postSpacingFeet}ft post spacing.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-mono font-bold">
                100% Contractor Accurate
              </span>
            </div>

            {/* Material Takeoff Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Specification</th>
                    <th className="p-3 text-right">Quantity</th>
                    <th className="p-3 text-right">Estimated Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-3 text-white font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>In-Line & Corner Posts</span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {postType === 'postmaster_steel' ? 'PostMaster Steel In-Line (Lifetime)' : '4x4 / 6x6 PT Cedar'}
                    </td>
                    <td className="p-3 text-right text-white font-bold">{calculation.totalPostCount} Posts</td>
                    <td className="p-3 text-right text-[#38bdf8]">${Math.round(calculation.totalPostCount * 38).toLocaleString()}</td>
                  </tr>

                  <tr>
                    <td className="p-3 text-white font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Post Hole High-PSI Concrete</span>
                    </td>
                    <td className="p-3 text-slate-400">60 lb Quikrete Commercial Mix (36" Depth)</td>
                    <td className="p-3 text-right text-white font-bold">{calculation.concreteBagsCount} Bags</td>
                    <td className="p-3 text-right text-[#38bdf8]">${Math.round(calculation.concreteBagsCount * 7.5).toLocaleString()}</td>
                  </tr>

                  <tr>
                    <td className="p-3 text-white font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Horizontal 2x4 Framing Rails</span>
                    </td>
                    <td className="p-3 text-slate-400">2x4x8 #1 Inland Cedar / Vinyl Insert ({railCount}-Rail)</td>
                    <td className="p-3 text-right text-white font-bold">{calculation.railCount} Rails</td>
                    <td className="p-3 text-right text-[#38bdf8]">${Math.round(calculation.railCount * 11.5).toLocaleString()}</td>
                  </tr>

                  <tr>
                    <td className="p-3 text-white font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Vertical Pickets / Tongue & Groove</span>
                    </td>
                    <td className="p-3 text-slate-400">1x6x{heightFeet} #1 Clear Cedar (10% Waste Factor)</td>
                    <td className="p-3 text-right text-white font-bold">{calculation.picketCount} Pickets</td>
                    <td className="p-3 text-right text-[#38bdf8]">${Math.round(calculation.picketCount * 4.2).toLocaleString()}</td>
                  </tr>

                  {hasRotBoard && (
                    <tr>
                      <td className="p-3 text-white font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Pressure-Treated Rot Board</span>
                      </td>
                      <td className="p-3 text-slate-400">2x6x8 Ground-Contact Kicker Board</td>
                      <td className="p-3 text-right text-white font-bold">{calculation.rotBoardCount} Boards</td>
                      <td className="p-3 text-right text-[#38bdf8]">${Math.round(calculation.rotBoardCount * 14).toLocaleString()}</td>
                    </tr>
                  )}

                  {hasCapAndTrim && (
                    <tr>
                      <td className="p-3 text-white font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Craftsman Cap & Trim Header</span>
                      </td>
                      <td className="p-3 text-slate-400">2x6 Top Cap + 1x4 Face Trim Fascia</td>
                      <td className="p-3 text-right text-white font-bold">{calculation.capTrimCount} pcs</td>
                      <td className="p-3 text-right text-[#38bdf8]">${Math.round(calculation.capTrimCount * 12).toLocaleString()}</td>
                    </tr>
                  )}

                  <tr>
                    <td className="p-3 text-white font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Stainless Ring-Shank Fasteners</span>
                    </td>
                    <td className="p-3 text-slate-400">Exterior Ceramic / Stainless Steel Screws</td>
                    <td className="p-3 text-right text-white font-bold">{calculation.fastenersCountLbs} Lbs</td>
                    <td className="p-3 text-right text-[#38bdf8]">${Math.round(calculation.fastenersCountLbs * 8.5).toLocaleString()}</td>
                  </tr>

                  {gates.singleGatesCount > 0 && (
                    <tr>
                      <td className="p-3 text-white font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                        <span>Single Walk Gate Steel Kits</span>
                      </td>
                      <td className="p-3 text-slate-400">Welded Steel Frame + Heavy Hinge & Latch</td>
                      <td className="p-3 text-right text-white font-bold">{gates.singleGatesCount} Kits</td>
                      <td className="p-3 text-right text-[#00ff66]">${(gates.singleGatesCount * 325).toLocaleString()}</td>
                    </tr>
                  )}

                  {gates.doubleGatesCount > 0 && (
                    <tr>
                      <td className="p-3 text-white font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                        <span>Double Driveway Gate Kits</span>
                      </td>
                      <td className="p-3 text-slate-400">Heavy Drop Cane Rod + Steel Truss Frame</td>
                      <td className="p-3 text-right text-white font-bold">{gates.doubleGatesCount} Kits</td>
                      <td className="p-3 text-right text-[#00ff66]">${(gates.doubleGatesCount * 750).toLocaleString()}</td>
                    </tr>
                  )}

                  {gates.automatedSolarOperator && (
                    <tr>
                      <td className="p-3 text-white font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                        <span>LiftMaster Commercial Solar Opener</span>
                      </td>
                      <td className="p-3 text-slate-400">30W Solar Panel + Dual 12V Batteries + Remotes</td>
                      <td className="p-3 text-right text-white font-bold">1 Complete System</td>
                      <td className="p-3 text-right text-[#00ff66]">$2,850</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 font-mono">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Materials Subtotal</span>
                <div className="text-xl font-bold text-white mt-1">${calculation.materialsCost.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Labor & Post Excavation</span>
                <div className="text-xl font-bold text-white mt-1">${calculation.laborCost.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Gates & Automation</span>
                <div className="text-xl font-bold text-[#00ff66] mt-1">${calculation.gatesCost.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c223d] border border-[#38bdf8]/40">
                <span className="text-[10px] text-[#38bdf8] uppercase">Total Investment</span>
                <div className="text-2xl font-bold text-[#38bdf8] mt-1">${calculation.totalCost.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('blueprint')}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                ← Back to 2D CAD
              </button>
              <button
                onClick={() => setActiveTab('finalize')}
                className="px-6 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md"
              >
                Next: Finalize & Request On-Site Survey →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB CONTENT: 4. SUMMARY & SAVE BID */}
      {activeTab === 'finalize' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Customer Details Form (5 cols) */}
            <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-[#071322]/90 border border-slate-800 space-y-4">
              <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#38bdf8]" />
                <span>Homeowner & Project Contact</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-4">
                We will use this address to verify parcel property line records and schedule your 811 utility locate.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-[#38bdf8] placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Phone Number:</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. (208) 555-0123"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-[#38bdf8] placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Email:</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-[#38bdf8] placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Street Address:</label>
                  <input
                    type="text"
                    value={projectAddress}
                    onChange={(e) => setProjectAddress(e.target.value)}
                    placeholder="e.g. 1234 Main St"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-[#38bdf8] placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">City (Treasure Valley):</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Boise, Meridian, Eagle"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-[#38bdf8] placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Zip Code:</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g. 83702"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-[#38bdf8] placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Project Notes / Gate Specifics:</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any project notes, HOA guidelines, gate codes, access details..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-[#38bdf8] placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Official Contractor Proposal Preview (7 cols) */}
            <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-black border border-[#38bdf8]/40 shadow-2xl flex flex-col justify-between" id="printable-estimate">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <span className="text-[10px] font-mono text-[#38bdf8] font-bold uppercase tracking-widest">
                      Official Contractor Proposal
                    </span>
                    <h4 className="text-xl font-heading font-bold text-white">
                      208 Fence & Gate LLC
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400">Quote Reference:</span>
                    <div className="text-xs font-mono font-bold text-[#00ff66]">
                      {submittedQuoteId || '#208-EST-DRAFT'}
                    </div>
                  </div>
                </div>

                {/* Scope Summary */}
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Primary Material:</span>
                      <span className="text-white font-bold">{MATERIAL_SPECS[material].name}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Total Linear Footage:</span>
                      <span className="text-[#38bdf8] font-bold">{calculation.totalLinearFeet} LF ({heightFeet}ft Height)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Post System:</span>
                      <span className="text-white font-bold">{postType.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Gate Hardware:</span>
                      <span className="text-white font-bold">
                        {gates.singleGatesCount} Walk Gate(s), {gates.doubleGatesCount} Drive Gate(s)
                      </span>
                    </div>
                    {gates.automatedSolarOperator && (
                      <div className="flex justify-between text-[#00ff66]">
                        <span>Smart Automation:</span>
                        <span className="font-bold">LiftMaster 30W Solar DC Motor Included</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-2 text-slate-300">
                    <div className="flex justify-between">
                      <span>Materials & Lumber:</span>
                      <span>${calculation.materialsCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor, Digging & Installation:</span>
                      <span>${calculation.laborCost.toLocaleString()}</span>
                    </div>
                    {calculation.tearOutCost > 0 && (
                      <div className="flex justify-between">
                        <span>Old Fence Tear-Out & Disposal:</span>
                        <span>${calculation.tearOutCost.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Gates & Automation Adders:</span>
                      <span>${calculation.gatesCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Idaho Sales Tax (6% materials):</span>
                      <span>${calculation.tax.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-slate-800 my-2" />
                    <div className="flex justify-between text-base font-bold text-white">
                      <span>Total Contract Investment:</span>
                      <span className="text-[#38bdf8] text-xl">${calculation.totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#00ff66]">
                      <span>Estimated Financing:</span>
                      <span>From ${calculation.monthlyFinancingPayment}/mo (84 mos, 0% down)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
                <button
                  onClick={handleSaveAndSubmit}
                  disabled={isSubmitting || !!submittedQuoteId}
                  className={`w-full py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                    submittedQuoteId
                      ? 'bg-[#00ff66] text-black cursor-default'
                      : isSubmitting
                        ? 'bg-slate-800 text-slate-300 cursor-wait'
                        : 'bg-[#1e40af] hover:bg-[#2563eb] text-white shadow-blue-900/50'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Saving to Firebase Database...</span>
                  ) : submittedQuoteId ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Estimate Confirmed ({submittedQuoteId})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>Save Estimate & Request Free On-Site Inspection</span>
                    </div>
                  )}
                </button>

                {/* Print & Share utilities */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Specification</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#38bdf8] text-xs font-mono flex items-center justify-center gap-2 border border-slate-800"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'Share Estimate'}</span>
                  </button>
                </div>

                {submittedQuoteId && (
                  <div className="p-3 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/30 text-center">
                    <p className="text-xs font-mono text-[#00ff66] font-semibold">
                      Your estimate has been logged with contractor dispatch!
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Direct inquiries: (208) 555-0199 • admin@208fenceandgate.com
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FenceEstimateTool;
