/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  ThumbsUp, 
  MessageCircle, 
  ExternalLink, 
  CheckCircle, 
  ShieldCheck, 
  Star, 
  Send, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Maximize2, 
  X,
  Sparkles,
  Camera,
  Heart
} from 'lucide-react';
import { FacebookPost, FacebookReview } from '../types';

const FACEBOOK_POSTS: FacebookPost[] = [
  {
    id: 'fb-1',
    author: '208 Fence and Gate LLC',
    authorAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=200&auto=format&fit=crop',
    timestamp: '2 hours ago',
    location: 'Meridian, Idaho (Paramount Subdivision)',
    projectType: 'Western Red Cedar Privacy',
    linearFeet: 185,
    tag: 'Cedar Privacy',
    content: '🌲 Finished up this gorgeous 185 LF 6-foot Western Red Cedar privacy fence in Meridian! Built with heavy-duty PostMaster steel hidden posts set 36" in concrete to handle Idaho winter winds, plus a 2x6 pressure-treated rot board to keep the pickets off the ground. Customer opted for our premium craftsman top-cap detail. Ready for the next 25 years!',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1000&auto=format&fit=crop'
    ],
    likesCount: 54,
    commentsCount: 12,
    sharesCount: 8
  },
  {
    id: 'fb-2',
    author: '208 Fence and Gate LLC',
    authorAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=200&auto=format&fit=crop',
    timestamp: 'Yesterday at 3:45 PM',
    location: 'Eagle, Idaho (Two Rivers Estate)',
    projectType: 'Smart Automated Cantilever Gate',
    linearFeet: 24,
    tag: 'Automated Gate',
    content: '⚡ Smart automated driveway gate commissioning in Eagle! Custom welded heavy-gauge powder-coated aluminum frame, LiftMaster commercial DC arm actuator, 30W high-efficiency solar kit, and dual safety photo-eyes. Tested with our SmartGate mobile telemetry app for smartphone open/close & visitor codes.',
    images: [
      'https://images.unsplash.com/photo-1584463699026-646700c25a07?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'
    ],
    likesCount: 89,
    commentsCount: 23,
    sharesCount: 19
  },
  {
    id: 'fb-3',
    author: '208 Fence and Gate LLC',
    authorAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=200&auto=format&fit=crop',
    timestamp: '3 days ago',
    location: 'Boise, Idaho (North End Historic)',
    projectType: 'Architectural Ornamental Iron',
    linearFeet: 120,
    tag: 'Ornamental Iron',
    content: '✨ 120 linear feet of classic ornamental wrought iron perimeter with self-closing MagnaLatch pool safety gate. Multi-stage electrostatic powder coating provides lifetime corrosion resistance against Idaho snow and sprinkler rust. Zero maintenance required!',
    images: [
      'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=1000&auto=format&fit=crop'
    ],
    likesCount: 67,
    commentsCount: 9,
    sharesCount: 5
  },
  {
    id: 'fb-4',
    author: '208 Fence and Gate LLC',
    authorAvatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=200&auto=format&fit=crop',
    timestamp: '5 days ago',
    location: 'Nampa, Idaho (Ridgecrest)',
    projectType: 'Maintenance-Free Vinyl Privacy',
    linearFeet: 210,
    tag: 'Vinyl Privacy',
    content: '🏡 Full lot perimeter enclosure in Nampa with high-impact UV-stabilized white vinyl. Aluminum reinforced bottom rails prevent sagging over time. Backed by our 5-Year Craftsmanship Guarantee and lifetime manufacturer warranty.',
    images: [
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1000&auto=format&fit=crop'
    ],
    likesCount: 42,
    commentsCount: 7,
    sharesCount: 4
  }
];

const FACEBOOK_REVIEWS: FacebookReview[] = [
  {
    id: 'rev-1',
    reviewerName: 'Marcus Lindqvist',
    reviewerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    date: 'February 12, 2026',
    location: 'Meridian, ID',
    projectType: '210 LF Western Red Cedar + 2 Double Gates',
    recommendationType: 'positive',
    highlightTags: ['On-Time Crew', 'PostMaster Steel', 'Clean Jobsite'],
    reviewText: '208 Fence and Gate did an outstanding job replacing our storm-damaged fence. The crew was courteous, worked clean, and used steel PostMaster posts that are completely hidden yet rock solid. The gate swings like butter. Highly recommended on our community Facebook group!'
  },
  {
    id: 'rev-2',
    reviewerName: 'Sarah Jenkins-Cole',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    date: 'January 28, 2026',
    location: 'Eagle, ID',
    projectType: 'Automated Solar Driveway Gate & Access Keypad',
    recommendationType: 'positive',
    highlightTags: ['Solar Powered', 'Smart Automation', 'Fast Quote'],
    reviewText: 'We needed a secure entrance for our rural property in Eagle. The team installed an automated dual-swing gate powered by solar. The smartphone app works seamlessly and the safety sensors give us total peace of mind with our dogs.'
  },
  {
    id: 'rev-3',
    reviewerName: 'David H. Reynolds',
    reviewerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    date: 'January 14, 2026',
    location: 'Boise (Depot Bench), ID',
    projectType: 'Ornamental Iron Pool Enclosure',
    recommendationType: 'positive',
    highlightTags: ['Pool Code Compliant', 'Craftsmanship', 'Fair Price'],
    reviewText: 'Flawless execution of our pool fence. Passed city inspection on the first pass with the self-closing child-safe MagnaLatch. The black powder-coat finish looks pristine.'
  }
];

interface FacebookFenceHubProps {
  onQuoteRequest?: () => void;
}

export const FacebookFenceHub: React.FC<FacebookFenceHubProps> = ({ onQuoteRequest }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'reviews' | 'messenger' | 'share'>('feed');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [filterTag, setFilterTag] = useState<string>('all');
  
  // Review form state
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [reviewsList, setReviewsList] = useState<FacebookReview[]>(FACEBOOK_REVIEWS);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Share quote generator state
  const [shareFenceType, setShareFenceType] = useState('Western Red Cedar Privacy');
  const [shareFootage, setShareFootage] = useState('160');
  const [shareCity, setShareCity] = useState('Boise, ID');
  const [shareCopied, setShareCopied] = useState(false);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const newRev: FacebookReview = {
      id: `rev-${Date.now()}`,
      reviewerName: newReviewName,
      reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      rating: 5,
      date: 'Just now',
      location: newReviewCity || 'Treasure Valley, ID',
      projectType: 'Residential Fence & Gate Project',
      recommendationType: 'positive',
      highlightTags: ['Verified Homeowner', '5-Star Craftsmanship'],
      reviewText: newReviewText
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewName('');
    setNewReviewCity('');
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const filteredPosts = FACEBOOK_POSTS.filter(post => {
    if (filterTag === 'all') return true;
    return post.tag.toLowerCase().includes(filterTag.toLowerCase());
  });

  const generateShareText = () => {
    return `🏡 Getting a new ${shareFootage} LF ${shareFenceType} built by @208FenceAndGate in ${shareCity}! Excited for precision Idaho craftsmanship and 5-Year Guarantee. Check out their builds at 208fenceandgate.com! #208Fence #BoiseContractor #IdahoFences`;
  };

  const copyShareText = () => {
    navigator.clipboard.writeText(generateShareText());
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  return (
    <section id="facebook-hub" className="relative z-10 py-16 md:py-24 bg-gradient-to-b from-[#050e1c] via-[#08182b] to-[#040d1a] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header: Fence Division Social Integration */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-widest mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] animate-pulse" />
              <span>Fence Division • Social Hub & Community Feed</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white uppercase tracking-tight">
              Facebook Connect <span className="text-[#1877F2]">@208FenceAndGate</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mt-2">
              Browse real job-site photo updates, verified Idaho homeowner recommendations, live project albums, and direct Messenger dispatch for all residential fence and gate builds.
            </p>
          </div>

          {/* Facebook Official Page Badge / Follow Action */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-900/30"
              id="fb-follow-button"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Follow on Facebook</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            
            <a
              href="https://m.me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-all border border-slate-700 flex items-center gap-2"
              id="fb-messenger-button"
            >
              <MessageCircle className="w-4 h-4 text-[#38bdf8]" />
              <span>Messenger Dispatch</span>
            </a>
          </div>
        </div>

        {/* Facebook Page Meta Banner Card */}
        <div className="bg-[#0b1b30]/90 border border-slate-700/80 rounded-2xl p-6 mb-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1877F2] via-[#0f3b75] to-slate-900 border-2 border-white/20 flex items-center justify-center text-white font-heading font-extrabold text-2xl shadow-lg">
                208
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1877F2] border-2 border-[#0b1b30] flex items-center justify-center text-white text-xs font-bold">
                f
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg md:text-xl font-bold text-white">208 Fence and Gate LLC</h3>
                <CheckCircle className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <p className="text-xs text-slate-400 font-mono">@208FenceAndGate • Residential General Contractor • Boise, ID</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold text-white">5.0</span>
                  <span className="text-slate-400">(84 recommendations)</span>
                </div>
                <span className="text-slate-600">|</span>
                <div className="text-slate-400">
                  <span className="font-bold text-white">2.4k</span> followers
                </div>
                <span className="text-slate-600">|</span>
                <div className="text-[#00ff66] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                  <span>Typically replies within minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CTA to request quote */}
          <button
            onClick={onQuoteRequest}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#1e40af] to-[#1877F2] hover:from-[#2563eb] hover:to-[#166fe5] text-white text-xs font-bold uppercase tracking-wider font-mono shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            id="fb-request-quote-cta"
          >
            <span>Request Fence Bid on FB</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'feed', label: 'Job-Site Posts & Photos', count: FACEBOOK_POSTS.length, icon: Camera },
            { id: 'reviews', label: 'Homeowner Reviews', count: reviewsList.length, icon: Star },
            { id: 'messenger', label: 'Messenger Direct Chat', count: null, icon: MessageCircle },
            { id: 'share', label: 'Share Bid Card to Facebook', count: null, icon: Share2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 px-5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#1877F2] text-white bg-[#1877F2]/10 rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                id={`fb-tab-${tab.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1877F2]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-[#1877F2] text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: JOB-SITE POSTS & PHOTO GALLERY */}
        {activeTab === 'feed' && (
          <div>
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-mono text-slate-400 uppercase mr-2">Filter Fence Style:</span>
              {[
                { label: 'All Jobs', value: 'all' },
                { label: 'Cedar Privacy', value: 'cedar' },
                { label: 'Automated Gates', value: 'gate' },
                { label: 'Ornamental Iron', value: 'iron' },
                { label: 'Vinyl', value: 'vinyl' }
              ].map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setFilterTag(chip.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    filterTag === chip.value
                      ? 'bg-[#1877F2] text-white font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => {
                const isLiked = likedPosts[post.id];
                const likeCount = post.likesCount + (isLiked ? 1 : 0);

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#091524] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between shadow-xl transition-all"
                    id={`fb-post-${post.id}`}
                  >
                    <div>
                      {/* Post Header */}
                      <div className="p-5 flex items-start justify-between gap-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-11 h-11 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-white">{post.author}</h4>
                              <CheckCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {post.timestamp}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-[#38bdf8]">
                                <MapPin className="w-3 h-3" />
                                {post.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#1877F2]/20 text-[#38bdf8] border border-[#1877F2]/40 uppercase font-semibold">
                          {post.tag}
                        </span>
                      </div>

                      {/* Post Content */}
                      <div className="p-5">
                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Images Grid */}
                      <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 px-5 pb-4`}>
                        {post.images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            onClick={() => setSelectedImage(imgUrl)}
                            className="relative h-56 rounded-xl overflow-hidden bg-slate-900 cursor-pointer group"
                          >
                            <img
                              src={imgUrl}
                              alt={`Job ${post.projectType}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="p-2 rounded-full bg-black/60 text-white backdrop-blur-sm">
                                <Maximize2 className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300 backdrop-blur-sm">
                              {post.projectType}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Post Footer & Social Actions */}
                    <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          {likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                          {post.commentsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3.5 h-3.5 text-slate-400" />
                          {post.sharesCount}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isLiked
                              ? 'bg-[#1877F2] text-white'
                              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                          }`}
                          id={`like-post-${post.id}`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{isLiked ? 'Liked' : 'Like'}</span>
                        </button>
                        
                        <a
                          href="https://facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                          title="View on Facebook"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIED REVIEWS & RECOMMENDATIONS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-lg font-bold text-white">Idaho Community Recommendations</h3>
                <span className="text-xs font-mono text-[#00ff66] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Recommended
                </span>
              </div>

              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#091524] border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg"
                  id={`review-${rev.id}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.reviewerAvatar}
                        alt={rev.reviewerName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{rev.reviewerName}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                            Verified Homeowner
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">{rev.location} • {rev.date}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed mb-4">
                    "{rev.reviewText}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Project:</span>
                    <span className="text-[11px] font-mono text-[#38bdf8] font-semibold">{rev.projectType}</span>
                    <div className="flex gap-1.5 ml-auto">
                      {rev.highlightTags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Facebook Recommendation Form */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b1b30] border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl sticky top-28">
                <div className="flex items-center gap-2 text-xs font-mono text-[#1877F2] uppercase font-bold mb-2">
                  <Star className="w-4 h-4 fill-[#1877F2]" />
                  <span>Leave Facebook Recommendation</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Review 208 Fence & Gate</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Had a fence or gate installed in Boise, Meridian, Eagle, or Nampa? Share your experience with Idaho neighbors.
                </p>

                {reviewSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/40 text-center"
                  >
                    <CheckCircle className="w-8 h-8 text-[#00ff66] mx-auto mb-2" />
                    <h4 className="font-bold text-sm text-white">Thank You for Your Review!</h4>
                    <p className="text-xs text-slate-300 mt-1 font-mono">
                      Your feedback helps fellow Idaho homeowners choose high-durability fencing.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePostReview} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Michael Henderson"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1877F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">City / Idaho Subdivision</label>
                      <input
                        type="text"
                        placeholder="e.g. Meridian, ID (Bainbridge)"
                        value={newReviewCity}
                        onChange={(e) => setNewReviewCity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1877F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Your Review & Craftsmanship Rating</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell others about post depth, gate alignment, crew punctuality, and cleanup..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1877F2]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      id="submit-fb-review-button"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Recommendation</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MESSENGER DIRECT CONNECT */}
        {activeTab === 'messenger' && (
          <div className="bg-[#091524] border border-slate-800 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1877F2] to-[#00c6ff] flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-blue-900/40">
              <MessageCircle className="w-8 h-8" />
            </div>
            
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              Chat Instantly with 208 Fence Contractor Dispatch
            </h3>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Have questions about property line stakes, 811 utility locates, cedar vs. vinyl durability, or solar gate operators? Send us a quick direct message on Facebook Messenger.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
              {[
                { title: '⚡ Fast Response', desc: 'Typical response time under 15 minutes during daylight hours.' },
                { title: '📸 Photo Estimates', desc: 'Snap a picture of your old fence or yard and get an initial estimate.' },
                { title: '📍 Local Boise Crew', desc: 'Direct access to the licensed builder, not an offshore call center.' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="font-bold text-xs text-white mb-1 font-mono">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://m.me"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xl shadow-blue-900/40 flex items-center gap-2"
                id="launch-messenger-btn"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Launch Messenger Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onQuoteRequest}
                className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-slate-700"
              >
                Use Web Quote Form Instead
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SHARE ESTIMATE CARD TO FACEBOOK */}
        {activeTab === 'share' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Customizer */}
            <div className="md:col-span-6 space-y-4 bg-[#091524] border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase font-bold mb-1">
                <Share2 className="w-4 h-4" />
                <span>Custom Facebook Share Generator</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Share Your Fence Project on Social</h3>
              <p className="text-xs text-slate-400">
                Generate a formatted post card to ask neighbors on Facebook or your HOA board for feedback.
              </p>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Fence / Gate Material</label>
                <select
                  value={shareFenceType}
                  onChange={(e) => setShareFenceType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1877F2]"
                >
                  <option value="Western Red Cedar Privacy">Western Red Cedar Privacy</option>
                  <option value="Smart Automated Cantilever Gate">Smart Automated Cantilever Gate</option>
                  <option value="Architectural Ornamental Iron">Architectural Ornamental Iron</option>
                  <option value="Maintenance-Free Virgin Vinyl">Maintenance-Free Virgin Vinyl</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Linear Footage</label>
                  <input
                    type="number"
                    value={shareFootage}
                    onChange={(e) => setShareFootage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">City / Area</label>
                  <input
                    type="text"
                    value={shareCity}
                    onChange={(e) => setShareCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={copyShareText}
                className={`w-full py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  shareCopied
                    ? 'bg-[#00ff66] text-black'
                    : 'bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-lg'
                }`}
                id="copy-fb-share-btn"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareCopied ? 'Share Caption Copied! ✓' : 'Copy Facebook Post Text'}</span>
              </button>
            </div>

            {/* Live Facebook Card Preview */}
            <div className="md:col-span-6">
              <div className="bg-[#18191a] border border-[#3a3b3c] rounded-2xl p-5 text-slate-200 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold font-heading">
                    208
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">208 Fence and Gate LLC</div>
                    <div className="text-[10px] text-slate-400 font-mono">Sponsored Preview • 🌐 Public</div>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed mb-3">
                  {generateShareText()}
                </p>

                <div className="rounded-xl overflow-hidden border border-[#3a3b3c] bg-black/50">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
                    alt="Fence Preview"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3 bg-[#242526]">
                    <div className="text-[10px] uppercase font-mono text-slate-400">208fenceandgate.com</div>
                    <div className="text-xs font-bold text-white mt-0.5">{shareFootage} LF {shareFenceType}</div>
                    <div className="text-[11px] text-slate-300">Idaho Master Fencing & Automated Gate Contractors</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-3 mt-3 border-t border-[#3a3b3c]">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>Like</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Comment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage}
                alt="Enlarged Facebook Project View"
                className="w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FacebookFenceHub;
