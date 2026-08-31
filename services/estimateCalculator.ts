/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  FenceMaterialType, 
  FencePostType, 
  TerrainType, 
  YardSegment, 
  GateConfig, 
  BOMCalculation 
} from '../types';

export const MATERIAL_SPECS: Record<FenceMaterialType, {
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

export interface CalculateBOMParams {
  segments: YardSegment[];
  tearOutFeet: number;
  postSpacingFeet: number;
  railCount: number;
  heightFeet: number;
  postType: FencePostType;
  material: FenceMaterialType;
  hasRotBoard: boolean;
  hasCapAndTrim: boolean;
  hasStaining: boolean;
  terrain: TerrainType;
  gates: GateConfig;
}

export function calculateBOM({
  segments,
  tearOutFeet,
  postSpacingFeet,
  railCount,
  heightFeet,
  postType,
  material,
  hasRotBoard,
  hasCapAndTrim,
  hasStaining,
  terrain,
  gates
}: CalculateBOMParams): BOMCalculation {
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
}
