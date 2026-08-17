/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am the 208 Fence & Gate virtual assistant. Ask about fence materials, automated gates, or our custom contractor software solutions.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 100);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[92vw] sm:w-96 bg-[#081524]/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/60"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0b1f36] to-[#0f2d4e] p-4 flex justify-between items-center border-b border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-white tracking-wide">208 Assistant</h3>
                  <p className="text-[10px] text-[#38bdf8] font-mono">Contractor & Tech Consultant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors" 
                data-hover="true"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-black/40 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
              <button 
                onClick={() => setInput("What's the cost per linear foot for Cedar?")}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
              >
                Cedar pricing
              </button>
              <button 
                onClick={() => setInput("Tell me about automated solar gates")}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
              >
                Solar gates
              </button>
              <button 
                onClick={() => setInput("What contractor software do you develop?")}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[#00ff66] whitespace-nowrap transition-colors"
              >
                Developer tech
              </button>
              <button 
                onClick={() => setInput("What warranty is included on residential fences?")}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[#38bdf8] whitespace-nowrap transition-colors"
              >
                Warranties & FAQ
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-64 md:h-80 overflow-y-auto p-4 space-y-3 scroll-smooth text-sm"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#1e40af] text-white rounded-tr-none shadow-md'
                        : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/90 p-3 rounded-xl rounded-tl-none border border-slate-700/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-800/80 bg-black/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about fence estimates, gate tech..."
                  className="flex-1 bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#38bdf8]"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#1e40af] hover:bg-[#2563eb] text-white p-2.5 rounded-lg transition-colors disabled:opacity-40"
                  data-hover="true"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 md:h-14 px-4 rounded-full bg-gradient-to-r from-[#0f2942] to-[#1e3a8a] flex items-center gap-2 shadow-xl shadow-black/60 border border-slate-600/70 z-50 text-white group"
        data-hover="true"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <MessageSquare className="w-5 h-5 text-[#38bdf8] group-hover:rotate-6 transition-transform" />
            <span className="text-xs font-heading font-bold uppercase tracking-wider hidden sm:inline">208 Assistant</span>
            <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;

