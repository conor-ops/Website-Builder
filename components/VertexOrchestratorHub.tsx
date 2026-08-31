/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  GitBranch,
  Layers,
  Zap,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  HardDrive,
  RefreshCw,
  ArrowUpRight,
  Activity,
  Database,
  Code,
  Network
} from 'lucide-react';

// ── Brand colors ────────────────────────────────────────────────────────────
const VOID   = '#0A0C10';
const CYAN   = '#00F2FE';
const EMERALD = '#00FF87';
const CORAL  = '#FF416C';

// ── Animated canvas node network ────────────────────────────────────────────
interface CanvasNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

const NODE_COLORS = [CYAN, EMERALD, CORAL, '#A78BFA'];

function initNodes(w: number, h: number, count: number): CanvasNode[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: 2.5 + Math.random() * 3,
    color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03
  }));
}

const AgentNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<CanvasNode[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    nodesRef.current = initNodes(width, height, 42);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // faint background
      ctx.fillStyle = 'rgba(10,12,16,0.08)';
      ctx.fillRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const LINK_DIST = 130;
      const MOUSE_DIST = 110;

      // update positions
      for (const n of nodes) {
        n.pulse += n.pulseSpeed;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width)  n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // mouse repulsion
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST && dist > 0) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.8;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
          // clamp velocity
          const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
          if (speed > 2.5) { n.vx = (n.vx / speed) * 2.5; n.vy = (n.vy / speed) * 2.5; }
        }
      }

      // draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,242,254,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // draw nodes
      for (const n of nodes) {
        const pulseFactor = 1 + Math.sin(n.pulse) * 0.3;
        const r = n.radius * pulseFactor;

        // glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        grd.addColorStop(0, n.color + 'AA');
        grd.addColorStop(1, n.color + '00');
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
};

// ── Architecture matrix rows ─────────────────────────────────────────────────
interface ArchRow {
  layer: string;
  component: string;
  status: 'online' | 'active' | 'idle';
  metric: string;
  color: string;
}

const ARCH_ROWS: ArchRow[] = [
  { layer: 'GOAL DECOMPOSITION',  component: 'vertex_orchestrator.py',      status: 'online', metric: '8 agents spawned',  color: CYAN    },
  { layer: 'TASK ROUTING',        component: 'agent_router.py',             status: 'active', metric: '12 tasks/sec',       color: EMERALD },
  { layer: 'LOG AUDITING',        component: 'log_research_agent.py',       status: 'active', metric: '0 syntax errors',    color: EMERALD },
  { layer: 'SELF-HEALING',        component: 'dependency_patcher.py',       status: 'online', metric: 'auto-patch enabled', color: CYAN    },
  { layer: 'STORAGE TIER 1',      component: 'disk1_iops_binder.py',        status: 'online', metric: 'Primary SSD / OS',   color: '#A78BFA' },
  { layer: 'STORAGE TIER 5',      component: 'disk5_archiver.py',           status: 'idle',   metric: '10TB • logs+state',  color: '#A78BFA' },
  { layer: 'MICRO-SAAS GATEWAY',  component: 'gcp_api_gateway.py',          status: 'active', metric: 'Days-to-Zero API',   color: CORAL   },
  { layer: 'LIQUIDITY FORECAST',  component: 'trade_estimation_model.py',   status: 'active', metric: 'Real-time stream',   color: CORAL   },
];

// ── Feature cards ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: 'Goal Decomposition & Task Routing',
    description: 'Splits high-level strategic commands into discrete agent tasks — separating open-ended reasoning from deterministic code execution across isolated worker processes.',
    color: CYAN,
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'System Integrity & Self-Healing',
    description: 'Log-auditing agents parse runtime execution traces, isolate syntax errors, and patch dependency paths automatically — zero human intervention required.',
    color: EMERALD,
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    title: 'Storage & Hardware Tiering',
    description: 'High-IOPS operations bind to Disk 1 (Primary OS SSD) while logs, vector indices, and state history archive to Disk 5 (10TB local storage).',
    color: '#A78BFA',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Micro-SaaS & Commercial Interfaces',
    description: 'Business logic — real-time liquidity forecasting (Days to Zero) and custom trade estimation models — encapsulated in decoupled microservices via GCP API Gateway.',
    color: CORAL,
  },
];

// ── Install snippet ───────────────────────────────────────────────────────────
const INSTALL_CMD = 'git clone https://github.com/conor-ops/MasterRecoveryAgents.git && cd MasterRecoveryAgents && pip install -r requirements.txt && python vertex_orchestrator.py';

// ── Main component ────────────────────────────────────────────────────────────
const VertexOrchestratorHub: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture'>('overview');

  const copyInstall = () => {
    navigator.clipboard.writeText(INSTALL_CMD).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="vertex-orchestrator"
      className="relative py-20 md:py-28 overflow-hidden border-t border-slate-800/60"
      style={{ background: `linear-gradient(180deg, ${VOID} 0%, #060810 60%, #0A0C10 100%)` }}
    >
      {/* Animated background canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <AgentNetworkCanvas />
        {/* vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C10]/80 via-transparent to-[#0A0C10]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
        >
          {/* Logo mark */}
          <div
            className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center border"
            style={{
              background: `linear-gradient(135deg, ${VOID}, #12151c)`,
              borderColor: `${CYAN}33`,
              boxShadow: `0 0 30px ${CYAN}22, 0 0 60px ${EMERALD}11`
            }}
          >
            <img src="/vertex-logo.svg" alt="Vertex Orchestrator" className="w-12 h-12 object-contain" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                style={{ color: CYAN, borderColor: `${CYAN}40`, background: `${CYAN}10` }}
              >
                Multi-Agent Infrastructure
              </span>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                style={{ color: EMERALD, borderColor: `${EMERALD}40`, background: `${EMERALD}10` }}
              >
                ● System Online
              </span>
            </div>
            <h2
              className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none"
              style={{
                background: `linear-gradient(135deg, ${CYAN} 0%, ${EMERALD} 55%, ${CORAL} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              VERTEX ORCHESTRATOR
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl">
              Enterprise-grade multi-agent orchestration framework for goal decomposition, autonomous self-healing, and commercial micro-SaaS deployment at scale.
            </p>
          </div>

          {/* GitHub CTA */}
          <a
            href="https://github.com/conor-ops/MasterRecoveryAgents"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all duration-200 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${CYAN}18, ${EMERALD}12)`,
              borderColor: `${CYAN}40`,
              color: CYAN,
              boxShadow: `0 0 18px ${CYAN}18`
            }}
          >
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </a>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1 mb-8 p-1 rounded-xl w-fit border border-slate-800 bg-slate-950/60"
        >
          {(['overview', 'architecture'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200"
              style={
                activeTab === tab
                  ? { background: `${CYAN}1A`, color: CYAN, boxShadow: `0 0 12px ${CYAN}22` }
                  : { color: '#64748b' }
              }
            >
              {tab === 'overview' ? '◈ Overview' : '⊞ Architecture'}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Feature grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {FEATURES.map((f, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="group p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${VOID}, #0d1017)`,
                      borderColor: `${f.color}22`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${f.color}55`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = `${f.color}22`)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${f.color}18`, color: f.color }}
                      >
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-sm text-white mb-1">{f.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Install snippet */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: `${EMERALD}25`, background: '#080c10' }}
              >
                <div
                  className="flex items-center justify-between px-5 py-3 border-b"
                  style={{ borderColor: `${EMERALD}20`, background: '#0a0e14' }}
                >
                  <div className="flex items-center gap-2 text-xs font-mono" style={{ color: EMERALD }}>
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Quick Start</span>
                  </div>
                  <button
                    onClick={copyInstall}
                    className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-lg border transition-all duration-200"
                    style={{
                      borderColor: `${EMERALD}30`,
                      color: copied ? EMERALD : '#64748b',
                      background: copied ? `${EMERALD}10` : 'transparent'
                    }}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="px-5 py-4 overflow-x-auto">
                  <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-all" style={{ color: CYAN }}>
                    <span style={{ color: '#475569' }}>$ </span>{INSTALL_CMD}
                  </pre>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Architecture matrix table */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: `${CYAN}20`, background: '#080c10' }}
              >
                {/* Table header */}
                <div
                  className="grid grid-cols-4 px-5 py-3 text-[10px] font-mono uppercase tracking-widest border-b"
                  style={{ borderColor: `${CYAN}18`, background: '#0a0e14', color: '#475569' }}
                >
                  <span>Layer</span>
                  <span>Component</span>
                  <span>Status</span>
                  <span>Metric</span>
                </div>

                {ARCH_ROWS.map((row, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06 }}
                    className="grid grid-cols-4 px-5 py-3.5 border-b text-xs transition-colors duration-150 hover:bg-slate-900/30"
                    style={{ borderColor: '#ffffff08' }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: row.color }}>
                      {row.layer}
                    </span>
                    <span className="font-mono text-slate-300 flex items-center gap-1.5 truncate">
                      <Code className="w-3 h-3 flex-shrink-0 text-slate-600" />
                      {row.component}
                    </span>
                    <span>
                      <span
                        className="px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase font-bold"
                        style={
                          row.status === 'online'
                            ? { color: CYAN,    borderColor: `${CYAN}35`,    background: `${CYAN}10` }
                            : row.status === 'active'
                            ? { color: EMERALD, borderColor: `${EMERALD}35`, background: `${EMERALD}10` }
                            : { color: '#64748b', borderColor: '#1e293b',    background: '#0f172a' }
                        }
                      >
                        ● {row.status}
                      </span>
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{row.metric}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { icon: <Activity className="w-4 h-4" />, label: 'Active Agents',  value: '8',       color: CYAN    },
                  { icon: <Database className="w-4 h-4" />, label: 'Storage Tiers',  value: '2',       color: '#A78BFA' },
                  { icon: <Network  className="w-4 h-4" />, label: 'API Gateway',    value: 'GCP',     color: EMERALD },
                  { icon: <RefreshCw className="w-4 h-4" />, label: 'Self-Heal',     value: 'Enabled', color: CORAL   },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07 }}
                    className="p-4 rounded-xl border flex flex-col items-center gap-2 text-center"
                    style={{ borderColor: `${stat.color}25`, background: `${stat.color}08` }}
                  >
                    <div style={{ color: stat.color }}>{stat.icon}</div>
                    <div className="font-heading font-black text-lg text-white">{stat.value}</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-5 p-6 rounded-2xl border"
          style={{
            borderColor: `${CYAN}20`,
            background: `linear-gradient(135deg, ${CYAN}08, ${EMERALD}05, ${CORAL}05)`
          }}
        >
          <div>
            <p className="font-heading font-bold text-white text-lg">Deploy Vertex Orchestrator</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Self-hosted multi-agent runtime · Python 3.10+ · GCP-ready · MIT License
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/conor-ops/MasterRecoveryAgents"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${CYAN}22, ${EMERALD}14)`,
                borderColor: `${CYAN}40`,
                color: CYAN
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> GitHub Repo
            </a>
            <a
              href="https://github.com/Autonomous-Agentic-Workflows/Orchestrator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 hover:scale-105"
              style={{
                background: `${CORAL}10`,
                borderColor: `${CORAL}35`,
                color: CORAL
              }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Orchestrator Org
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default VertexOrchestratorHub;
