/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type DivisionType = 'all' | 'contractor' | 'developer';

export interface ServiceItem {
  id: string;
  name: string;
  genre: string; // Used for category / domain
  image: string;
  day: string; // Used for badge e.g. "EST. 208" or "CONTRACTOR" / "SOFTWARE"
  description: string;
  division: 'contractor' | 'developer' | 'hybrid';
  features?: string[];
  pricingEstimate?: string;
  metrics?: { label: string; value: string }[];
}

export type Artist = ServiceItem; // Alias for backwards compatibility

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  SERVICES = 'services',
  EXPERIENCE = 'experience',
  ESTIMATE = 'estimate',
  TECH = 'tech',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
}

// Facebook Integration Types for Fence Division
export interface FacebookPost {
  id: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  images: string[];
  location: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  projectType: string;
  linearFeet?: number;
  tag: string;
}

export interface FacebookReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  location: string;
  projectType: string;
  reviewText: string;
  verifiedHomeowner: boolean;
  recommendationType: 'positive' | 'neutral';
  highlightTags: string[];
}

// GitHub Integration Types for Software Division
export interface GitRepository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  license: string;
  defaultBranch: string;
  updatedAt: string;
  topics: string[];
  cloneUrl: string;
  releaseVersion: string;
  readmePreview: string;
  openIssues: number;
}

export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  authorAvatar: string;
  date: string;
  repo: string;
  branch: string;
  verified: boolean;
}

export interface GitRelease {
  version: string;
  title: string;
  publishedAt: string;
  downloadUrl: string;
  fileSize: string;
  targetHardware: string;
  changelog: string[];
  checksumSha256: string;
}

// Fence Estimation Engine Types
export type FenceMaterialType = 'cedar_privacy' | 'cedar_modern' | 'vinyl_privacy' | 'ornamental_iron' | 'chain_link' | 'composite_trex';
export type FencePostType = 'postmaster_steel' | 'cedar_4x4' | 'cedar_6x6' | 'steel_pipe_bracket';
export type TerrainType = 'flat' | 'moderate_slope' | 'steep_slope' | 'rocky_hardpan';

export interface YardSegment {
  id: string;
  name: string;
  lengthFeet: number;
  singleGates: number;
  doubleGates: number;
  hasTearOut: boolean;
}

export interface GateConfig {
  singleGatesCount: number;
  singleGateWidthFt: number;
  doubleGatesCount: number;
  doubleGateWidthFt: number;
  automatedSolarOperator: boolean;
  keypadAccess: boolean;
  antiSagKits: boolean;
}

export interface FenceEstimateDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  projectAddress: string;
  city: string;
  zipCode: string;
  material: FenceMaterialType;
  postType: FencePostType;
  heightFeet: number;
  postSpacingFeet: number;
  railCount: number;
  hasRotBoard: boolean;
  hasCapAndTrim: boolean;
  hasStaining: boolean;
  stainColor?: string;
  terrain: TerrainType;
  tearOutFeet: number;
  segments: YardSegment[];
  gates: GateConfig;
  notes?: string;
}

export interface BOMCalculation {
  totalLinearFeet: number;
  totalPostCount: number;
  concreteBagsCount: number; // 60lb
  railCount: number;
  picketCount: number;
  rotBoardCount: number;
  capTrimCount: number;
  fastenersCountLbs: number;
  singleGateKits: number;
  doubleGateKits: number;
  automatedOperatorUnits: number;
  materialsCost: number;
  laborCost: number;
  tearOutCost: number;
  gatesCost: number;
  addonsCost: number;
  subtotal: number;
  tax: number;
  totalCost: number;
  monthlyFinancingPayment: number;
}

