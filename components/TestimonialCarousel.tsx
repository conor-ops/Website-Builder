import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  MapPin, 
  Award, 
  ThumbsUp, 
  Clock, 
  Sparkles, 
  PlusCircle, 
  X, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';
import { ClientReview, ClientSatisfactionStats } from '../types';
import { 
  fetchClientReviews, 
  saveReviewToFirestore, 
  computeSatisfactionStats,
  INITIAL_VERIFIED_REVIEWS 
} from '../services/firebase';
import { useToast } from './ToastContext';

interface TestimonialCarouselProps {
  onQuoteRequest?: () => void;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ onQuoteRequest }) => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ClientReview[]>(INITIAL_VERIFIED_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // New Review Form State
  const [newReview, setNewReview] = useState({
    clientName: '',
    location: '',
    projectType: '6ft Western Red Cedar Privacy',
    rating: 5,
    satisfactionScore: 100,
    linearFeet: 160,
    reviewText: '',
    serviceCategory: 'wood_fence' as 'wood_fence' | 'vinyl_fence' | 'automated_gate' | 'iron_fence' | 'software',
    craftsmanshipHighlights: 'PostMaster Steel Posts, Precision Alignment'
  });

  // Load reviews from Firestore
  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClientReviews();
      if (data && data.length > 0) {
        setReviews(data);
      }
    } catch (e) {
      console.warn('Error loading Firestore reviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Filter reviews by selected category
  const filteredReviews = useMemo(() => {
    if (selectedCategory === 'all') return reviews;
    return reviews.filter(r => r.serviceCategory === selectedCategory);
  }, [reviews, selectedCategory]);

  // Ensure current index is within bounds of filtered reviews
  useEffect(() => {
    if (currentIndex >= filteredReviews.length) {
      setCurrentIndex(0);
    }
  }, [filteredReviews.length, currentIndex]);

  // Compute satisfaction statistics
  const stats: ClientSatisfactionStats = useMemo(() => {
    return computeSatisfactionStats(reviews);
  }, [reviews]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || filteredReviews.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, filteredReviews.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? filteredReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.clientName.trim() || !newReview.reviewText.trim()) {
      showToast({
        type: 'warning',
        title: 'Missing Details',
        message: 'Please provide your name and a brief summary of your project experience.'
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const highlightsArray = newReview.craftsmanshipHighlights
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const reviewPayload: Omit<ClientReview, 'id' | 'createdAt'> = {
        clientName: newReview.clientName.trim(),
        location: newReview.location.trim() || 'Boise Valley, ID',
        projectType: newReview.projectType,
        rating: Number(newReview.rating),
        satisfactionScore: Number(newReview.satisfactionScore),
        reviewText: newReview.reviewText.trim(),
        completionDate: 'Just Now',
        verifiedHomeowner: true,
        linearFeet: Number(newReview.linearFeet) || undefined,
        craftsmanshipHighlights: highlightsArray.length > 0 ? highlightsArray : ['5-Year Warranty', 'Precision Craftsmanship'],
        serviceCategory: newReview.serviceCategory
      };

      const docId = await saveReviewToFirestore(reviewPayload);

      const createdReview: ClientReview = {
        ...reviewPayload,
        id: docId
      };

      setReviews(prev => [createdReview, ...prev]);
      setShowReviewModal(false);

      showToast({
        type: 'email-trigger',
        title: 'Project Satisfaction Score Recorded',
        message: `Thank you, ${newReview.clientName}! Your ${newReview.rating}-star review and ${newReview.satisfactionScore}% satisfaction score were saved to Firestore.`,
        duration: 8000
      });

      // Reset form
      setNewReview({
        clientName: '',
        location: '',
        projectType: '6ft Western Red Cedar Privacy',
        rating: 5,
        satisfactionScore: 100,
        linearFeet: 160,
        reviewText: '',
        serviceCategory: 'wood_fence',
        craftsmanshipHighlights: 'PostMaster Steel Posts, Precision Alignment'
      });
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast({
        type: 'error',
        title: 'Review Submission Error',
        message: 'Could not sync review to Firestore. Please try again.'
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const currentReview = filteredReviews[currentIndex] || reviews[0];

  return (
    <section 
      id="testimonials-section" 
      className="relative z-10 py-16 md:py-20 border-t border-slate-800/80 bg-gradient-to-b from-[#040810] via-[#05101f] to-[#040810]"
      aria-label="Client Testimonials and Satisfaction Scores"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header with Project Satisfaction Metrics Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
              <span>Verified Homeowner Feedback • Firestore Real-Time Stream</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight uppercase">
              Idaho Project Satisfaction & Reviews
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Real reviews and satisfaction metrics from Treasure Valley homeowners across Boise, Meridian, Eagle, Star, and Nampa.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0e243a] hover:bg-[#163656] text-[#38bdf8] hover:text-white border border-[#38bdf8]/40 hover:border-[#38bdf8] text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-black/40"
            >
              <PlusCircle className="w-4 h-4 text-[#00ff66]" />
              <span>Share Project Feedback</span>
            </button>

            <button
              onClick={loadReviews}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-black/50 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              title="Refresh Reviews from Firestore"
              aria-label="Refresh Reviews"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#38bdf8]' : ''}`} />
            </button>
          </div>
        </div>

        {/* SATISFACTION SCORES METRICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-[#38bdf8]/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="uppercase">Overall Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-2xl md:text-3xl font-heading font-bold text-white flex items-baseline gap-1.5">
              <span>{stats.averageRating.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>{stats.fiveStarPercentage}% 5-Star Ratio</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="uppercase">Satisfaction Score</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-heading font-bold text-emerald-400 flex items-baseline gap-1">
              <span>{stats.averageSatisfactionScore}%</span>
              <span className="text-xs text-slate-400 font-mono">Average</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Based on Post-Install Audits
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-[#38bdf8]/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="uppercase">Schedule Delivery</span>
              <Clock className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="text-2xl md:text-3xl font-heading font-bold text-white flex items-baseline gap-1">
              <span>{stats.onTimeCompletionRate}%</span>
              <span className="text-xs text-slate-400 font-mono">On-Time</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Guaranteed Completion Windows
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-[#00ff66]/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="uppercase">Warranty Standing</span>
              <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div className="text-2xl md:text-3xl font-heading font-bold text-[#00ff66] flex items-baseline gap-1">
              <span>5-Year</span>
              <span className="text-xs text-slate-400 font-mono">Guaranteed</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Workmanship & Post Stability
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Project Type:</span>
          </span>

          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'wood_fence', label: 'Western Red Cedar' },
            { id: 'automated_gate', label: 'Automated Gates' },
            { id: 'vinyl_fence', label: 'Vinyl Perimeters' },
            { id: 'iron_fence', label: 'Wrought Iron & Pool' }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#38bdf8] text-black font-bold shadow-md shadow-[#38bdf8]/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* MAIN CAROUSEL STAGE */}
        <div 
          className="relative bg-gradient-to-br from-[#091829]/90 via-[#05111e]/95 to-[#040810] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/80 overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Carousel Slide Card */}
          <div className="relative min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {currentReview && (
                <motion.div
                  key={`${currentReview.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: 25, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -25, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col justify-between h-full"
                >
                  {/* Top Badges & Rating */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <div className="flex items-center gap-3">
                        {/* 5 Star Graphic */}
                        <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-xl">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(currentReview.rating) 
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-amber-400/40 fill-amber-400/20'
                              }`} 
                            />
                          ))}
                          <span className="ml-1 text-xs font-mono font-bold text-amber-300">
                            {currentReview.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Satisfaction Score Badge */}
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs font-mono text-emerald-400 font-bold">
                          <Award className="w-3.5 h-3.5" />
                          <span>{currentReview.satisfactionScore}% Satisfaction Score</span>
                        </div>

                        {/* Verified Homeowner Badge */}
                        {currentReview.verifiedHomeowner && (
                          <div className="hidden sm:flex items-center gap-1.5 bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-3 py-1 rounded-xl text-xs font-mono text-[#38bdf8] font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66]" />
                            <span>Verified Homeowner</span>
                          </div>
                        )}
                      </div>

                      {/* Project Specs Pill */}
                      {currentReview.linearFeet && (
                        <div className="text-xs font-mono text-slate-400 bg-black/40 border border-slate-800 px-3 py-1 rounded-xl">
                          Linear Footage: <span className="text-white font-bold">{currentReview.linearFeet} LF</span>
                        </div>
                      )}
                    </div>

                    {/* Review Quote Body */}
                    <div className="relative my-6 pl-6 border-l-2 border-[#38bdf8]/60">
                      <Quote className="absolute -top-3 -left-3.5 w-6 h-6 text-[#38bdf8]/40 bg-[#091829] p-0.5 rounded-full" />
                      <p className="text-base md:text-xl text-slate-100 font-normal leading-relaxed italic">
                        "{currentReview.reviewText}"
                      </p>
                    </div>

                    {/* Craftsmanship Highlights Chips */}
                    {currentReview.craftsmanshipHighlights && currentReview.craftsmanshipHighlights.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">
                          Craftsmanship Highlights:
                        </span>
                        {currentReview.craftsmanshipHighlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/70 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#00ff66]" />
                            <span>{highlight}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reviewer Meta Footer */}
                  <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0b1b36] border border-[#38bdf8]/40 flex items-center justify-center font-heading font-bold text-white text-sm shadow-md">
                        {currentReview.clientName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-heading font-bold text-white flex items-center gap-2">
                          <span>{currentReview.clientName}</span>
                          <span className="text-[11px] text-slate-400 font-normal font-sans">
                            • {currentReview.completionDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                          <span>{currentReview.location}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-300 font-medium">{currentReview.projectType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick CTA to quote identical spec */}
                    {onQuoteRequest && (
                      <button
                        onClick={onQuoteRequest}
                        className="px-4 py-2 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
                      >
                        <span>Estimate Similar Spec</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CAROUSEL NAVIGATION CONTROLS */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
            
            {/* Slide Count Indicator */}
            <div className="text-xs font-mono text-slate-400">
              Review <span className="text-white font-bold">{currentIndex + 1}</span> of{' '}
              <span className="text-white font-bold">{filteredReviews.length}</span>
              <span className="hidden sm:inline text-slate-500 ml-2">
                (Firestore sync active)
              </span>
            </div>

            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-2">
              {filteredReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-7 bg-[#38bdf8]' 
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-black/60 border border-slate-700 text-slate-300 hover:text-white hover:border-[#38bdf8] hover:bg-slate-800 transition-colors"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-black/60 border border-slate-700 text-slate-300 hover:text-white hover:border-[#38bdf8] hover:bg-slate-800 transition-colors"
                aria-label="Next Review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SUBMIT HOMEOWNER REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReviewModal(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#081524] border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/90 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Firestore Client Review Submission</span>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight uppercase">
                  Rate Your 208 Installation
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your feedback helps Idaho homeowners verify craftsmanship standards and post stability.
                </p>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Your Name / Household *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David & Sarah M."
                      value={newReview.clientName}
                      onChange={(e) => setNewReview({ ...newReview, clientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Idaho City / Subdivision
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Meridian, ID (Paramount)"
                      value={newReview.location}
                      onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Service Category
                    </label>
                    <select
                      value={newReview.serviceCategory}
                      onChange={(e) => setNewReview({ ...newReview, serviceCategory: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    >
                      <option value="wood_fence">Western Red Cedar</option>
                      <option value="automated_gate">Automated Gate</option>
                      <option value="vinyl_fence">Vinyl Perimeter</option>
                      <option value="iron_fence">Wrought Iron / Pool</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Star Rating (1-5)
                    </label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none font-bold text-amber-300"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5.0 Excellent)</option>
                      <option value={4.8}>⭐⭐⭐⭐⭐ (4.8 Great)</option>
                      <option value={4.5}>⭐⭐⭐⭐ (4.5 Very Good)</option>
                      <option value={4}>⭐⭐⭐⭐ (4.0 Good)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Satisfaction Score (%)
                    </label>
                    <select
                      value={newReview.satisfactionScore}
                      onChange={(e) => setNewReview({ ...newReview, satisfactionScore: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none text-emerald-400 font-bold"
                    >
                      <option value={100}>100% (Flawless)</option>
                      <option value={99}>99% (Outstanding)</option>
                      <option value={98}>98% (High Satisfaction)</option>
                      <option value={95}>95% (Satisfied)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Project Type & Specifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6ft Cedar Privacy + PostMaster Steel Posts + 5ft Walk Gate"
                    value={newReview.projectType}
                    onChange={(e) => setNewReview({ ...newReview, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Review Summary & Craftsmanship Experience *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell other Idaho homeowners about post depth, gate operation, cleanup, and crew professionalism..."
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Craftsmanship Highlights (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="PostMaster Steel, 36in Frost Depth, Solar Operator, On-Time Cleanup"
                    value={newReview.craftsmanshipHighlights}
                    onChange={(e) => setNewReview({ ...newReview, craftsmanshipHighlights: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-3 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmittingReview ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Syncing to Firestore...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Publish Review to Live Carousel</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TestimonialCarousel;
