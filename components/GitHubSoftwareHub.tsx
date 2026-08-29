/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  GitFork, 
  Star, 
  Terminal, 
  Code, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Cpu, 
  FileCode, 
  Folder, 
  FolderOpen, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowUpRight,
  Send,
  Zap
} from 'lucide-react';
import { GitRepository, GitCommit, GitRelease } from '../types';

const REPOSITORIES: GitRepository[] = [
  {
    id: 'repo-fence-estimate-tool',
    name: 'fence-estimate-tool',
    fullName: '208fenceandgate/fence-estimate-tool',
    description: 'Modern full-stack fence estimate tool with 2D perimeter CAD builder, dynamic Bill of Materials (BOM) takeoff, material pricing engines, and gate adders.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 82,
    forks: 23,
    license: 'MIT',
    defaultBranch: 'main',
    updatedAt: 'Just now',
    topics: ['fence-estimate-tool', 'fence-calculator', 'contractor-bom', 'cad-estimator', 'typescript', 'react', 'tailwind'],
    cloneUrl: 'https://github.com/208fenceandgate/fence-estimate-tool.git',
    releaseVersion: 'v2.1.0-release',
    openIssues: 0,
    readmePreview: `# Fence Estimate Tool (208 Fence and Gate LLC)
Interactive residential fence pricing calculator, 2D perimeter blueprint builder, and itemized material takeoff generator.

### Live Integration Highlights
- **Interactive Yard Designer:** Click-and-drag perimeter segments, multi-side property lines, and gate placement.
- **Material Takeoff Engine:** Western Red Cedar, Virgin Vinyl, Ornamental Iron, and Trex Composite.
- **Structural Hardware Calculator:** PostMaster hidden steel posts, 36" concrete frost footing bags, 2x4 framing rails, 1x6 pickets with 10% waste buffer.
- **Gates & Automation:** Single walk gates, double equipment gates, and LiftMaster solar DC gate operator kits.
- **Contractor Proposal Generation:** Instant pricing breakdown with Idaho sales tax and low monthly financing options.

\`\`\`bash
# Clone the repository
git clone https://github.com/208fenceandgate/fence-estimate-tool.git
cd fence-estimate-tool
npm install
npm run dev
\`\`\``
  },
  {
    id: 'repo-1',
    name: '208-smartgate-controller-firmware',
    fullName: '208fenceandgate/208-smartgate-controller-firmware',
    description: 'ESP32 & FreeRTOS production firmware for automated gate actuators, solar voltage telemetry, dual photo-eye optical interrupts, and MQTT smartphone bridge.',
    language: 'C++',
    languageColor: '#f34b7d',
    stars: 64,
    forks: 14,
    license: 'MIT',
    defaultBranch: 'main',
    updatedAt: '12 minutes ago',
    topics: ['esp32', 'freertos', 'smart-gate', 'iot-telemetry', 'c++', 'mqtt', 'solar-power'],
    cloneUrl: 'https://github.com/208fenceandgate/208-smartgate-controller-firmware.git',
    releaseVersion: 'v2.4.2-stable',
    openIssues: 2,
    readmePreview: `# 208 SmartGate Controller Firmware (v2.4.2)
Production-grade IoT firmware for residential and commercial gate operators.

### Hardware Features
- **Actuators:** Dual 12V/24V DC linear rams with optical encoders
- **Safety Loops:** Dual optical obstacle photo-eyes with hardware interrupt debounce
- **Telemetry:** Solar battery array voltage (ADC), cycle counters, ambient temp
- **Wireless:** Wi-Fi 802.11 b/g/n + LoRaWAN 915 MHz long-range fallback
- **Security:** AES-256 encrypted payload validation over TLS 1.3 WebSockets

### Flashing to ESP32
\`\`\`bash
git clone https://github.com/208fenceandgate/208-smartgate-controller-firmware.git
cd 208-smartgate-controller-firmware
idf.py set-target esp32
idf.py -p /dev/ttyUSB0 flash monitor
\`\`\``
  },
  {
    id: 'repo-2',
    name: 'fencequote-os-gis-engine',
    fullName: '208fenceandgate/fencequote-os-gis-engine',
    description: 'Cloud GIS property parcel boundary calculator that auto-traces fence perimeters, computes linear footage, and outputs dynamic contractor bills-of-materials.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 49,
    forks: 9,
    license: 'Apache-2.0',
    defaultBranch: 'main',
    updatedAt: '3 hours ago',
    topics: ['gis-mapping', 'parcel-boundaries', 'fence-contractor', 'typescript', 'react', 'bom-generator'],
    cloneUrl: 'https://github.com/208fenceandgate/fencequote-os-gis-engine.git',
    releaseVersion: 'v1.8.0',
    openIssues: 1,
    readmePreview: `# FenceQuote OS GIS Engine
Automated property boundary measurement and instant proposal generation.

### Capabilities
- Ingests Ada County & Canyon County GIS parcel shapefiles
- Interactive vector snap to parcel property pins with 811 utility overlay
- Generates exact PostMaster steel post count, 2x4 rail requirements, and concrete bags
- Outputs instant homeowner quote PDF with e-signature binding`
  },
  {
    id: 'repo-3',
    name: 'contractor-cad-bom-sdk',
    fullName: '208fenceandgate/contractor-cad-bom-sdk',
    description: 'High-speed Go microservice for wind-load structural physics calculation, post spacing algorithms (6ft vs 8ft OC), and supplier live price sync.',
    language: 'Go',
    languageColor: '#00ADD8',
    stars: 35,
    forks: 5,
    license: 'BSD-3-Clause',
    defaultBranch: 'main',
    updatedAt: 'Yesterday',
    topics: ['golang', 'structural-load', 'wind-physics', 'contractor-sdk', 'materials-bom'],
    cloneUrl: 'https://github.com/208fenceandgate/contractor-cad-bom-sdk.git',
    releaseVersion: 'v3.1.0',
    openIssues: 0,
    readmePreview: `# Contractor CAD & BOM SDK (Go)
Structural engineering calculations for residential perimeters and gate cantilevers.

\`\`\`go
calc := bom.NewFenceCalculator(bom.Config{
    Material: bom.WesternRedCedar,
    PostType: bom.PostMasterSteel,
    WindZoneMPH: 90,
    SoilType: bom.IdahoClayLoam,
})
result := calc.ComputeFootage(180.0)
\`\`\``
  },
  {
    id: 'repo-4',
    name: 'smartgate-access-bridge',
    fullName: '208fenceandgate/smartgate-access-bridge',
    description: 'Node.js & MQTT access control bridge supporting Apple HomeKit accessories, automatic license plate recognition (ALPR), and time-limited visitor guest PINs.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 28,
    forks: 6,
    license: 'MIT',
    defaultBranch: 'main',
    updatedAt: '2 days ago',
    topics: ['homekit', 'mqtt-broker', 'alpr-cameras', 'access-control', 'webhooks'],
    cloneUrl: 'https://github.com/208fenceandgate/smartgate-access-bridge.git',
    releaseVersion: 'v2.1.4',
    openIssues: 3,
    readmePreview: `# SmartGate Access Control Bridge
Bridge microservice connecting gate relay controllers with smart home ecosystems and camera ALPR triggers.`
  }
];

const COMMITS_LOG: GitCommit[] = [
  {
    sha: 'e4a8901',
    message: 'feat(estimator): enhance 2D CAD blueprint canvas and material takeoff BOM calculations',
    author: '208-dev-core',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    date: '14 mins ago',
    repo: 'fence-estimate-tool',
    branch: 'main',
    verified: true
  },
  {
    sha: '9f8b21c',
    message: 'feat(firmware): add dual optical photo-eye hardware interrupt with 5ms debounce',
    author: '208-dev-core',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    date: '42 mins ago',
    repo: '208-smartgate-controller-firmware',
    branch: 'main',
    verified: true
  },
  {
    sha: '3c1d47e',
    message: 'perf(gis): vectorize polygon raycast for 10x faster parcel footage calculation',
    author: '208-gis-lead',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    date: '3 hours ago',
    repo: 'fencequote-os-gis-engine',
    branch: 'main',
    verified: true
  },
  {
    sha: '7a4e09f',
    message: 'fix(bom-sdk): adjust PostMaster spacing to 7.5ft OC for 95 MPH Idaho wind code',
    author: '208-dev-core',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    date: 'Yesterday at 4:12 PM',
    repo: 'contractor-cad-bom-sdk',
    branch: 'main',
    verified: true
  },
  {
    sha: '1b89d3a',
    message: 'feat(bridge): add HomeKit GarageDoorOpener HAP service characteristic parser',
    author: '208-iot-engineer',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    date: '2 days ago',
    repo: 'smartgate-access-bridge',
    branch: 'v2.1-stable',
    verified: true
  }
];

const RELEASES_LIST: GitRelease[] = [
  {
    version: 'v2.4.2-stable',
    title: 'ESP32 SmartGate Telemetry & Safety Operator Firmware',
    publishedAt: 'February 10, 2026',
    downloadUrl: 'https://github.com/208fenceandgate/firmware/releases/download/v2.4.2/smartgate-esp32-v2.4.2.bin',
    fileSize: '1.42 MB (.bin)',
    targetHardware: 'ESP32-WROOM-32 / ESP32-S3',
    changelog: [
      'Added high-frequency optical photo-eye obstruction interrupt handler',
      'Optimized solar MPPT battery ADC voltage telemetry curve',
      'Enhanced TLS 1.3 WebSocket reconnect backoff algorithm',
      'Fixed gate soft-start / soft-stop PWM ramp decay curve'
    ],
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    version: 'v1.8.0',
    title: 'FenceQuote OS Geospatial Parcel SDK Engine',
    publishedAt: 'January 29, 2026',
    downloadUrl: 'https://github.com/208fenceandgate/gis/releases/download/v1.8.0/fencequote-gis-engine.tar.gz',
    fileSize: '4.8 MB (.tar.gz)',
    targetHardware: 'Node.js 20+ / WebGL 2.0 Browser',
    changelog: [
      'Ada & Canyon county GIS parcel shapefile live tile streaming',
      'Automatic PostMaster vs 4x4 cedar post count generator',
      'Export quote proposals to Google Drive & Firebase Firestore'
    ],
    checksumSha256: 'a6c4e09f7a4e09f7a4e09f7a4e09f7a4e09f7a4e09f7a4e09f7a4e09f7a4e09f'
  }
];

export const GitHubSoftwareHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'repos' | 'commits' | 'releases' | 'sandbox'>('repos');
  const [selectedRepo, setSelectedRepo] = useState<GitRepository>(REPOSITORIES[0]);
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedRelease, setCopiedRelease] = useState<string | null>(null);

  // Sandbox API simulation state
  const [selectedEndpoint, setSelectedEndpoint] = useState<'trigger-gate' | 'telemetry' | 'calculate-bom'>('trigger-gate');
  const [sandboxResponse, setSandboxResponse] = useState<any>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2500);
  };

  const executeSandboxApi = () => {
    setIsExecutingApi(true);
    setTimeout(() => {
      if (selectedEndpoint === 'trigger-gate') {
        setSandboxResponse({
          status: 200,
          success: true,
          event: 'GATE_ACTUATOR_CYCLE_INITIATED',
          timestamp: new Date().toISOString(),
          details: {
            gateId: '208-GATE-MERIDIAN-042',
            action: 'OPEN_COMMAND',
            relayPin: 'GPIO_23',
            opticalObstructionState: 'CLEAR',
            solarVoltage: '13.8V',
            batteryLevel: '98%',
            estimatedCycleTimeMs: 14200,
            securityHandshake: 'AES-256_VALIDATED'
          }
        });
      } else if (selectedEndpoint === 'telemetry') {
        setSandboxResponse({
          status: 200,
          deviceId: '208-SMARTGATE-EAGLE-007',
          metrics: {
            firmwareVersion: 'v2.4.2-stable',
            uptimeSeconds: 864200,
            solarArrayWatts: 28.4,
            dailyCycles: 18,
            lifetimeCycles: 4210,
            wifiSignalRSSI: '-58 dBm',
            loraCarrierFrequency: '915.0 MHz'
          },
          deviceStatus: 'ONLINE_OPTIMAL'
        });
      } else {
        setSandboxResponse({
          status: 200,
          engine: 'FenceQuote-BOM-v3.1.0',
          input: { footage: 180, material: 'Western Red Cedar', postType: 'PostMaster Steel' },
          outputBOM: {
            postCount: 24,
            postMasterSteelPosts: 24,
            cedarPickets6ft: 410,
            treatedRails2x4x8: 72,
            rotBoards2x6x8: 24,
            fastenersBoxCount: 3,
            concreteBags60lb: 48,
            estimatedLaborHours: 18.5,
            calculatedWindLoadMPH: 95
          }
        });
      }
      setIsExecutingApi(false);
    }, 600);
  };

  return (
    <section id="github-hub" className="relative z-10 py-16 md:py-24 bg-gradient-to-b from-[#02050b] via-[#040c14] to-[#010307] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header: Software Division Git Integration */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00ff66] uppercase tracking-widest mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-pulse" />
              <span>Software & IoT Division • Git Repository Architecture</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white uppercase tracking-tight">
              GitHub Repositories <span className="text-[#00ff66]">@208fenceandgate</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mt-2 font-normal">
              Explore open-source firmware, IoT microcontrollers, GIS estimating engines, and contractor REST SDKs engineered for smart gate automation and precision fencing.
            </p>
          </div>

          {/* GitHub Action Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-[#00ff66] border border-[#00ff66]/50 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.2)]"
              id="github-profile-btn"
            >
              <Code className="w-4 h-4" />
              <span>View GitHub Org</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            
            <button
              onClick={() => setActiveTab('sandbox')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-bold uppercase tracking-wider transition-all border border-slate-700 flex items-center gap-2"
              id="api-sandbox-btn"
            >
              <Terminal className="w-4 h-4 text-[#38bdf8]" />
              <span>API Sandbox</span>
            </button>
          </div>
        </div>

        {/* GitHub Organization Meta Stats Bar */}
        <div className="bg-black/80 border border-[#00ff66]/30 rounded-2xl p-6 mb-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-black border-2 border-[#00ff66]/60 flex items-center justify-center text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.25)]">
                <Terminal className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00ff66] border-2 border-black flex items-center justify-center text-black text-xs font-extrabold">
                git
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg md:text-xl font-bold text-white">208 Software & IoT Lab</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40">
                  Verified Developer
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">github.com/208fenceandgate • Access Control & Contractor GIS</p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Folder className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>4 Public Repos</span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>176 Stars</span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <GitFork className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>34 Forks</span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1 text-[#00ff66]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>CI/CD Builds: All Passing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Clone Snippet */}
          <div className="w-full md:w-auto bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 font-mono text-xs text-slate-300">
            <span className="text-[#00ff66] select-none">$</span>
            <span className="text-slate-200 truncate max-w-xs md:max-w-md">
              git clone {selectedRepo.cloneUrl}
            </span>
            <button
              onClick={() => copyToClipboard(`git clone ${selectedRepo.cloneUrl}`)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors shrink-0"
              title="Copy Git Clone Command"
            >
              {copiedClone ? <Check className="w-4 h-4 text-[#00ff66]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'repos', label: 'Repositories & Code', count: REPOSITORIES.length, icon: FolderOpen },
            { id: 'commits', label: 'Live Commit Log', count: COMMITS_LOG.length, icon: GitCommitIcon },
            { id: 'releases', label: 'Firmware Releases (.bin)', count: RELEASES_LIST.length, icon: Download },
            { id: 'sandbox', label: 'API & Webhook Console', count: null, icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 px-5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#00ff66] text-[#00ff66] bg-[#00ff66]/10 rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                id={`git-tab-${tab.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00ff66]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-black text-[#00ff66] border border-[#00ff66]/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: REPOSITORIES EXPLORER */}
        {activeTab === 'repos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Repositories List */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
                Select Repository
              </h3>

              {REPOSITORIES.map((repo) => {
                const isSelected = selectedRepo.id === repo.id;
                return (
                  <div
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.15)]'
                        : 'bg-[#08121e] border-slate-800 hover:border-slate-700'
                    }`}
                    id={`repo-card-${repo.id}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Code className={`w-4 h-4 ${isSelected ? 'text-[#00ff66]' : 'text-[#38bdf8]'}`} />
                        <h4 className="font-mono font-bold text-sm text-white">{repo.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                        {repo.releaseVersion}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {repo.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: repo.languageColor }}
                        />
                        <span className="text-slate-200">{repo.language}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-slate-400" />
                        <span>{repo.forks}</span>
                      </div>
                      <span className="ml-auto text-[10px] text-slate-500">{repo.updatedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Repository Deep Dive / README & File Structure */}
            <div className="lg:col-span-7">
              <div className="bg-black/90 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl sticky top-28">
                {/* Repo Header Bar */}
                <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                      <GitBranch className="w-4 h-4 text-[#00ff66]" />
                      <span>{selectedRepo.fullName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[#00ff66]">
                        {selectedRepo.defaultBranch}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">License: {selectedRepo.license} • Open Issues: {selectedRepo.openIssues}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(selectedRepo.cloneUrl)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono font-semibold text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedClone ? <Check className="w-3.5 h-3.5 text-[#00ff66]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedClone ? 'Copied' : 'Clone'}</span>
                    </button>

                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                      title="Open on GitHub"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Topics Chips */}
                <div className="px-5 py-3 bg-slate-900/50 border-b border-slate-800 flex flex-wrap gap-1.5">
                  {selectedRepo.topics.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/60 text-[#38bdf8] border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Mock File Tree Explorer */}
                <div className="p-5 border-b border-slate-800/80 bg-[#050b12]">
                  <div className="text-[11px] font-mono uppercase text-slate-500 mb-2.5 flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-[#00ff66]" />
                    <span>Project File Structure</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-slate-800 text-slate-300">
                      <Folder className="w-3.5 h-3.5 text-amber-400" />
                      <span>src/</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-slate-800 text-slate-300">
                      <Folder className="w-3.5 h-3.5 text-amber-400" />
                      <span>include/</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-slate-800 text-slate-300">
                      <FileCode className="w-3.5 h-3.5 text-[#00ff66]" />
                      <span>gate_relays.cpp</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-slate-800 text-slate-300">
                      <FileCode className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>README.md</span>
                    </div>
                  </div>
                </div>

                {/* README Markdown Preview */}
                <div className="p-6 max-h-[380px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed space-y-3 bg-black/80">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200">
                    {selectedRepo.readmePreview}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE COMMITS STREAM */}
        {activeTab === 'commits' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                <GitCommitIcon className="w-4 h-4 text-[#00ff66]" />
                <span>Recent Repository Commits</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">Branch: main (GPG Verified)</span>
            </div>

            {COMMITS_LOG.map((commit, idx) => (
              <div
                key={idx}
                className="bg-[#08121e] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                id={`commit-${commit.sha}`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={commit.authorAvatar}
                    alt={commit.author}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-mono text-xs md:text-sm font-semibold text-white">
                      {commit.message}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                      <span className="text-slate-300">{commit.author}</span>
                      <span>committed</span>
                      <span className="text-[#38bdf8]">{commit.date}</span>
                      <span>in</span>
                      <span className="text-slate-300 font-semibold">{commit.repo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {commit.verified && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                      Verified
                    </span>
                  )}
                  <div className="px-3 py-1 rounded-lg bg-black border border-slate-700 font-mono text-xs text-slate-300">
                    {commit.sha}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FIRMWARE BINARY RELEASES */}
        {activeTab === 'releases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {RELEASES_LIST.map((rel, idx) => (
              <div
                key={idx}
                className="bg-black/90 border border-[#00ff66]/40 rounded-2xl p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between"
                id={`release-${rel.version}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/50 font-bold">
                        {rel.version}
                      </span>
                      <h4 className="font-heading text-lg font-bold text-white mt-2">{rel.title}</h4>
                      <p className="text-xs text-slate-400 font-mono">{rel.publishedAt} • Target: {rel.targetHardware}</p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-800 my-4" />

                  <div className="text-xs font-mono uppercase text-slate-400 mb-2">Changelog Highlights:</div>
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    {rel.changelog.map((c, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#00ff66] mt-0.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-6">
                    <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">SHA-256 Checksum:</div>
                    <div className="font-mono text-[10px] text-slate-400 truncate">{rel.checksumSha256}</div>
                  </div>
                </div>

                <a
                  href={rel.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#00ff66] hover:bg-[#00e65c] text-black text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Firmware {rel.fileSize}</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: API & WEBHOOK SANDBOX */}
        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Control Panel */}
            <div className="lg:col-span-5 bg-[#08121e] border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <div className="text-xs font-mono text-[#00ff66] uppercase font-bold mb-1">Interactive API Console</div>
                <h3 className="font-heading text-lg font-bold text-white">Test SmartGate Webhooks</h3>
                <p className="text-xs text-slate-400 mt-1">Simulate real-time gate controller telemetry & quote calculation APIs.</p>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-2">Endpoint</label>
                <div className="space-y-2">
                  {[
                    { id: 'trigger-gate', method: 'POST', path: '/api/v1/gate/trigger', label: 'Trigger Gate Cycle' },
                    { id: 'telemetry', method: 'GET', path: '/api/v1/gate/telemetry', label: 'Solar & Battery Status' },
                    { id: 'calculate-bom', method: 'POST', path: '/api/v1/estimates/bom', label: 'Calculate PostMaster BOM' }
                  ].map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => { setSelectedEndpoint(ep.id as any); setSandboxResponse(null); }}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                        selectedEndpoint === ep.id
                          ? 'bg-black border-[#00ff66] text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className={`font-bold mr-2 ${ep.method === 'POST' ? 'text-[#38bdf8]' : 'text-[#00ff66]'}`}>
                          {ep.method}
                        </span>
                        <span>{ep.path}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{ep.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={executeSandboxApi}
                disabled={isExecutingApi}
                className="w-full py-3 rounded-xl bg-[#00ff66] hover:bg-[#00e65c] text-black text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)] cursor-pointer"
                id="send-api-request-btn"
              >
                {isExecutingApi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{isExecutingApi ? 'Executing API Call...' : 'Send Request Payload'}</span>
              </button>
            </div>

            {/* JSON Output Display */}
            <div className="lg:col-span-7 bg-black border border-slate-800 rounded-2xl p-6 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400">
                <span className="text-[11px] text-[#00ff66]">Response Stream (HTTP 200 OK)</span>
                <span>Content-Type: application/json</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 min-h-[260px] overflow-auto">
                {sandboxResponse ? (
                  <pre className="text-[#00ff66] whitespace-pre-wrap text-xs">
                    {JSON.stringify(sandboxResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center py-12">
                    <Terminal className="w-8 h-8 mb-2 text-slate-600" />
                    <p>Click "Send Request Payload" to execute API call.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default GitHubSoftwareHub;
