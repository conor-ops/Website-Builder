import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Flame, 
  Mail, 
  X, 
  Copy, 
  Check, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  FileSpreadsheet,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useToast, ToastNotification } from './ToastContext';

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration = toast.duration || 6000;

  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isPaused, onDismiss, toast.id]);

  const handleCopyQuoteId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!toast.quoteId) return;
    navigator.clipboard.writeText(toast.quoteId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBorderAndAccent = () => {
    switch (toast.type) {
      case 'email-trigger':
        return {
          border: 'border-emerald-500/50 hover:border-emerald-400',
          bgGlow: 'from-emerald-950/40 via-slate-900/90 to-[#05111e]',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          iconColor: 'text-emerald-400',
          progressBg: 'bg-emerald-500',
          icon: <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
        };
      case 'success':
        return {
          border: 'border-[#38bdf8]/50 hover:border-[#38bdf8]',
          bgGlow: 'from-blue-950/40 via-slate-900/90 to-[#05111e]',
          badgeBg: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30',
          iconColor: 'text-[#38bdf8]',
          progressBg: 'bg-[#38bdf8]',
          icon: <CheckCircle2 className="w-5 h-5 text-[#38bdf8]" />
        };
      case 'warning':
        return {
          border: 'border-amber-500/50 hover:border-amber-400',
          bgGlow: 'from-amber-950/40 via-slate-900/90 to-[#05111e]',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          iconColor: 'text-amber-400',
          progressBg: 'bg-amber-500',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
        };
      case 'error':
        return {
          border: 'border-rose-500/50 hover:border-rose-400',
          bgGlow: 'from-rose-950/40 via-slate-900/90 to-[#05111e]',
          badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          iconColor: 'text-rose-400',
          progressBg: 'bg-rose-500',
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />
        };
      default:
        return {
          border: 'border-slate-700 hover:border-slate-600',
          bgGlow: 'from-slate-900 via-slate-900/95 to-[#05111e]',
          badgeBg: 'bg-slate-800 text-slate-300 border-slate-700',
          iconColor: 'text-slate-300',
          progressBg: 'bg-slate-500',
          icon: <Info className="w-5 h-5 text-slate-300" />
        };
    }
  };

  const style = getBorderAndAccent();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -15, scale: 0.92, filter: 'blur(4px)', transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full max-w-md bg-gradient-to-br ${style.bgGlow} border ${style.border} rounded-2xl p-4 shadow-2xl backdrop-blur-xl pointer-events-auto overflow-hidden transition-colors group`}
      role="alert"
      aria-live="assertive"
    >
      {/* Top badges bar */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-black/40 border border-slate-700/60 flex items-center justify-center">
            {style.icon}
          </div>
          
          {toast.type === 'email-trigger' && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
              <span>Firebase Email Trigger</span>
            </div>
          )}

          {toast.type === 'success' && (
            <div className="px-2.5 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[10px] font-mono text-[#38bdf8] uppercase tracking-wider font-semibold">
              <span>Database Sync OK</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Title & Message */}
      <div className="space-y-1.5">
        <h4 className="text-sm font-heading font-bold text-white tracking-tight flex items-center gap-2">
          <span>{toast.title}</span>
        </h4>
        
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {toast.message}
        </p>

        {/* Email Recipient Pill if present */}
        {toast.email && (
          <div className="mt-2 flex items-center gap-2 p-2 rounded-xl bg-black/50 border border-emerald-500/20 text-xs font-mono text-slate-300">
            <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Recipient:</span>
            <span className="text-white font-medium truncate">{toast.email}</span>
            <span className="ml-auto text-[10px] text-emerald-400 font-semibold uppercase bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              Dispatched
            </span>
          </div>
        )}

        {/* Quote ID + Metadata pills */}
        {(toast.quoteId || toast.meta) && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            {toast.quoteId && (
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700/70 text-xs font-mono text-slate-300">
                <span className="text-slate-500">Ref:</span>
                <span className="text-[#38bdf8] font-bold">{toast.quoteId}</span>
                <button
                  onClick={handleCopyQuoteId}
                  className="ml-1 p-0.5 hover:text-white text-slate-400 transition-colors"
                  title="Copy Reference ID"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 ml-auto">
              {toast.meta?.linearFeet && (
                <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
                  {toast.meta.linearFeet} LF
                </span>
              )}
              {toast.meta?.totalCost && (
                <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-semibold">
                  ${toast.meta.totalCost.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Countdown progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/60 overflow-hidden">
        <div 
          className={`h-full ${style.progressBg} transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <aside 
      aria-label="Notification Center"
      className="fixed top-20 right-4 md:right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm md:max-w-md w-full"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

export default ToastContainer;
