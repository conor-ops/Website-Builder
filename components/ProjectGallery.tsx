import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Image as ImageIcon, 
  HardDrive, 
  Cloud, 
  Camera, 
  Upload, 
  Plus, 
  Filter, 
  Search, 
  ZoomIn, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  SlidersHorizontal,
  RefreshCw,
  FolderOpen,
  ArrowUpRight,
  Maximize2,
  FileCheck2,
  Info,
  Loader2
} from 'lucide-react';
import { ProjectPhotoItem, PhotoSourceType } from '../types';
import { 
  fetchProjectGalleryPhotos, 
  uploadProjectPhotoToStorage, 
  saveGalleryPhotoToFirestore,
  INITIAL_PROJECT_GALLERY 
} from '../services/firebase';
import { 
  listDriveProjectImages, 
  listGooglePhotosMedia, 
  loadAndOpenGooglePicker, 
  requestGoogleAccessToken,
  getCachedToken 
} from '../services/googleWorkspace';
import { useToast } from './ToastContext';

interface ProjectGalleryProps {
  onQuoteRequest?: (specPrefill?: { fenceType?: string; footage?: number }) => void;
}

// Framer Motion Animation Variants for Staggered Grid Reveal
const gridContainerVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
      when: 'beforeChildren'
    }
  }
};

const cardItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 28, 
    scale: 0.95,
    filter: 'blur(4px)'
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 260,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 18,
    filter: 'blur(3px)',
    transition: {
      duration: 0.22,
      ease: 'easeOut'
    }
  }
};

const skeletonContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const skeletonItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

interface GalleryCardProps {
  photo: ProjectPhotoItem;
  index: number;
  onSelect: (photo: ProjectPhotoItem) => void;
}

const GalleryCardItem: React.FC<GalleryCardProps> = ({ photo, index, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFirebase = photo.source === 'firebase_storage';
  const isDrive = photo.source === 'google_drive';
  const isGPhotos = photo.source === 'google_photos';

  const isFeatured = photo.featured && index % 4 === 0;
  const cardSpanClass = isFeatured 
    ? 'sm:col-span-2 lg:col-span-2 row-span-2' 
    : photo.aspectRatio === 'tall' 
      ? 'row-span-2' 
      : '';

  return (
    <motion.div
      layout
      variants={cardItemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      onClick={() => onSelect(photo)}
      className={`group relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800/90 hover:border-[#38bdf8]/60 cursor-pointer shadow-xl shadow-black/60 transition-colors duration-300 flex flex-col justify-between ${cardSpanClass}`}
    >
      {/* Photo Thumbnail Container */}
      <div className="relative w-full h-full min-h-[260px] overflow-hidden bg-black/80 flex items-center justify-center">
        {/* Placeholder Loader Spinner before image loads */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-0">
            <Loader2 className="w-6 h-6 text-[#38bdf8] animate-spin mb-2 opacity-70" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Streaming Asset...
            </span>
          </div>
        )}

        <img 
          src={photo.imageUrl} 
          alt={photo.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageLoaded(true);
            setImageError(true);
          }}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0 scale-95'
          }`}
        />

        {/* Gradient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050c18] via-[#050c18]/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Top Source Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {isFirebase && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/90 text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-sm">
                <Cloud className="w-3 h-3" />
                <span>Firebase Storage</span>
              </span>
            )}
            {isDrive && (
              <span className="px-2.5 py-1 rounded-xl bg-[#38bdf8]/90 text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-sm">
                <HardDrive className="w-3 h-3" />
                <span>Google Drive</span>
              </span>
            )}
            {isGPhotos && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md backdrop-blur-sm">
                <Camera className="w-3 h-3" />
                <span>Google Photos</span>
              </span>
            )}
          </div>

          {photo.linearFeet && photo.linearFeet > 0 && (
            <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-slate-700 text-white text-[11px] font-mono font-semibold shadow-md">
              {photo.linearFeet} LF
            </span>
          )}
        </div>

        {/* Hover Zoom Icon Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="w-12 h-12 rounded-2xl bg-black/70 backdrop-blur-md border border-[#38bdf8]/60 flex items-center justify-center text-[#38bdf8] shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>

        {/* Bottom Metadata In Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <div className="text-[11px] font-mono text-[#38bdf8] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{photo.location}</span>
          </div>
          
          <h3 className="text-base md:text-lg font-heading font-bold text-white leading-snug group-hover:text-[#38bdf8] transition-colors">
            {photo.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
            {photo.description}
          </p>

          {/* Craftsmanship Chips */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {photo.tags.slice(0, 3).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 rounded-lg bg-black/60 border border-slate-700/80 text-[10px] font-mono text-slate-300"
                >
                  {tag}
                </span>
              ))}
              {photo.tags.length > 3 && (
                <span className="text-[10px] font-mono text-slate-400">
                  +{photo.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ onQuoteRequest }) => {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<ProjectPhotoItem[]>(INITIAL_PROJECT_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhotoItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncingDrive, setIsSyncingDrive] = useState<boolean>(false);
  const [isSyncingPhotos, setIsSyncingPhotos] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Upload Modal State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'wood_fence' as 'wood_fence' | 'automated_gate' | 'iron_fence' | 'vinyl_fence' | 'smart_access',
    location: '',
    linearFeet: 180,
    description: '',
    material: 'Grade-A Western Red Cedar',
    postType: 'PostMaster Galvanized Steel',
    footingDepth: '36-inch Bored Concrete Footing',
    tags: 'PostMaster Steel, UV Pre-Stain, Precision Alignment'
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load photos from Firestore on mount
  const loadGalleryPhotos = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjectGalleryPhotos();
      if (data && data.length > 0) {
        setPhotos(data);
      }
    } catch (err) {
      console.warn('Error fetching gallery photos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryPhotos();
  }, []);

  // Sync images from Google Drive API
  const handleSyncGoogleDrive = async () => {
    setIsSyncingDrive(true);
    try {
      const token = getCachedToken() || await requestGoogleAccessToken();
      const driveImages = await listDriveProjectImages();
      
      if (driveImages.length === 0) {
        showToast({
          type: 'info',
          title: 'Google Drive Synced',
          message: 'Connected to Google Drive. No new standalone image files found in root; existing project Drive links are active.'
        });
      } else {
        const drivePhotoItems: ProjectPhotoItem[] = driveImages.map((file, idx) => ({
          id: `drive-${file.id}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          category: 'wood_fence',
          categoryLabel: 'Google Drive Project Asset',
          location: 'Treasure Valley, ID',
          imageUrl: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s1200') : 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
          source: 'google_drive',
          sourceLabel: `Google Drive (${file.name})`,
          googleFileId: file.id,
          description: `Project photography imported directly from Google Drive Workspace folder. File ID: ${file.id}`,
          specs: {
            material: 'Contractor Specified Materials',
            postType: 'PostMaster Steel or 4x4 In-Ground',
            footingDepth: '36-inch Deep Concrete',
            hardware: 'Commercial Grade Fasteners',
            warranty: '5-Year Workmanship Warranty'
          },
          tags: ['Google Drive Import', 'Completed Install'],
          aspectRatio: idx % 3 === 0 ? 'tall' : idx % 3 === 1 ? 'wide' : 'square',
          uploadedAt: 'Synced from Drive'
        }));

        setPhotos(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = drivePhotoItems.filter(p => !existingIds.has(p.id));
          return [...newItems, ...prev];
        });

        showToast({
          type: 'success',
          title: 'Google Drive Photos Synced',
          message: `Successfully loaded ${drivePhotoItems.length} project photo(s) from your Google Drive account.`
        });
      }
    } catch (err: any) {
      console.warn('Google Drive Sync Error:', err);
      showToast({
        type: 'warning',
        title: 'Google Drive Auth Notice',
        message: 'Please authorize Google Workspace in the Workspace Hub to query private Drive photo folders.'
      });
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Sync images from Google Photos API or Google Picker
  const handleSyncGooglePhotos = async () => {
    setIsSyncingPhotos(true);
    try {
      const token = getCachedToken() || await requestGoogleAccessToken();
      const mediaItems = await listGooglePhotosMedia(10);
      
      if (mediaItems.length > 0) {
        const photoItems: ProjectPhotoItem[] = mediaItems.map((item, idx) => ({
          id: `gphoto-${item.id}`,
          title: item.filename ? item.filename.replace(/\.[^/.]+$/, "") : `Google Photos Build #${idx + 1}`,
          category: 'automated_gate',
          categoryLabel: 'Google Photos Album Asset',
          location: 'Idaho Installation Site',
          imageUrl: `${item.baseUrl}=w1200-h800`,
          thumbnailUrl: `${item.baseUrl}=w400-h300`,
          source: 'google_photos',
          sourceLabel: `Google Photos (${item.filename})`,
          googleFileId: item.id,
          description: 'High-resolution job site photography synced from Google Photos library.',
          specs: {
            material: 'Heavy-Duty Gate & Fence Systems',
            postType: 'Engineered Ground Posts',
            footingDepth: '36-48 Inch Frost Footing',
            hardware: 'Architectural Hardware',
            warranty: '5-Year Warranty'
          },
          tags: ['Google Photos', 'Jobsite Camera'],
          aspectRatio: idx % 2 === 0 ? 'wide' : 'tall',
          uploadedAt: 'Synced from Photos'
        }));

        setPhotos(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = photoItems.filter(p => !existingIds.has(p.id));
          return [...newItems, ...prev];
        });

        showToast({
          type: 'success',
          title: 'Google Photos Synced',
          message: `Imported ${photoItems.length} photos from your Google Photos library.`
        });
      } else {
        // Fallback: Open Google Picker to select any project photo from Drive / Google account
        loadAndOpenGooglePicker((pickedDoc: any) => {
          if (pickedDoc && pickedDoc.url) {
            const pickedPhoto: ProjectPhotoItem = {
              id: `picked-${pickedDoc.id || Date.now()}`,
              title: pickedDoc.name || 'Google Cloud Selected Photo',
              category: 'wood_fence',
              categoryLabel: 'Google Workspace Selected Photo',
              location: 'Boise Valley, ID',
              imageUrl: pickedDoc.thumbnails?.[0]?.url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
              source: 'google_drive',
              sourceLabel: `Google Picker (${pickedDoc.name})`,
              googleFileId: pickedDoc.id,
              description: 'Project photo selected via Google Cloud Picker dialog.',
              specs: {
                material: 'Contractor Grade Timber & Hardware',
                postType: 'PostMaster Steel Alignment',
                footingDepth: '36-inch Footing',
                hardware: 'Exterior Coated Screws',
                warranty: '5-Year Guarantee'
              },
              tags: ['Google Picker', 'Verified Build'],
              aspectRatio: 'wide',
              uploadedAt: 'Just Now'
            };

            setPhotos(prev => [pickedPhoto, ...prev]);
            showToast({
              type: 'success',
              title: 'Photo Imported',
              message: `Added "${pickedDoc.name}" to the project gallery.`
            });
          }
        });
      }
    } catch (err) {
      console.warn('Google Photos / Picker error:', err);
      showToast({
        type: 'info',
        title: 'Google Workspace Authentication',
        message: 'Connect your Google Account to fetch photos from Google Photos or Google Drive.'
      });
    } finally {
      setIsSyncingPhotos(false);
    }
  };

  // Handle Photo File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      const previewUrl = URL.createObjectURL(file);
      setUploadPreview(previewUrl);
      if (!uploadForm.title) {
        setUploadForm(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
        }));
      }
    }
  };

  // Handle Upload to Firebase Storage & Firestore
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile && !uploadPreview) {
      showToast({
        type: 'warning',
        title: 'No Image Selected',
        message: 'Please choose a photo from your device to upload to Firebase Storage.'
      });
      return;
    }

    setUploadProgress(true);
    try {
      let finalImageUrl = uploadPreview || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
      let storagePath = `projects/${uploadForm.category}/${uploadFile?.name || 'custom_fence.jpg'}`;

      if (uploadFile) {
        const uploadResult = await uploadProjectPhotoToStorage(uploadFile, {
          projectTitle: uploadForm.title,
          category: uploadForm.category
        });
        finalImageUrl = uploadResult.downloadUrl;
        storagePath = uploadResult.storagePath;
      }

      const tagsArray = uploadForm.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const categoryLabels: Record<string, string> = {
        wood_fence: 'Western Red Cedar',
        automated_gate: 'Automated Solar Gate',
        iron_fence: 'Wrought Iron & Pool',
        vinyl_fence: 'Vinyl Perimeter',
        smart_access: 'IoT Access Control'
      };

      const newPhotoItem: Omit<ProjectPhotoItem, 'id'> = {
        title: uploadForm.title.trim() || 'Custom Idaho Installation',
        category: uploadForm.category,
        categoryLabel: categoryLabels[uploadForm.category] || 'Fence Build',
        location: uploadForm.location.trim() || 'Boise Valley, ID',
        linearFeet: Number(uploadForm.linearFeet) || 160,
        imageUrl: finalImageUrl,
        source: 'firebase_storage',
        sourceLabel: `Firebase Storage (${storagePath})`,
        storagePath: storagePath,
        description: uploadForm.description.trim() || 'Verified craftsmanship project completed by 208 Fence & Gate LLC.',
        specs: {
          material: uploadForm.material,
          postType: uploadForm.postType,
          footingDepth: uploadForm.footingDepth,
          hardware: 'Commercial Hardware & Fasteners',
          warranty: '5-Year Structural Workmanship'
        },
        tags: tagsArray.length > 0 ? tagsArray : ['Verified Install', 'Idaho Craftsmanship'],
        aspectRatio: 'wide',
        uploadedAt: 'Just Now',
        featured: true
      };

      const docId = await saveGalleryPhotoToFirestore(newPhotoItem);

      const createdItem: ProjectPhotoItem = {
        ...newPhotoItem,
        id: docId
      };

      setPhotos(prev => [createdItem, ...prev]);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadPreview(null);

      showToast({
        type: 'email-trigger',
        title: 'Uploaded to Firebase Storage',
        message: `Project photo "${newPhotoItem.title}" saved to Firebase Storage bucket and synced live into the gallery!`,
        duration: 7000
      });
    } catch (err) {
      console.error('Error saving uploaded photo:', err);
      showToast({
        type: 'error',
        title: 'Upload Error',
        message: 'Could not complete upload to Firebase Storage. Please try again.'
      });
    } finally {
      setUploadProgress(false);
    }
  };

  // Filter photos by category, source, and search query
  const filteredPhotos = useMemo(() => {
    return photos.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Source filter
      if (selectedSource !== 'all' && item.source !== selectedSource) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags?.some(t => t.toLowerCase().includes(q));
        const matchesMaterial = item.specs?.material.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocation && !matchesDesc && !matchesTags && !matchesMaterial) {
          return false;
        }
      }
      return true;
    });
  }, [photos, selectedCategory, selectedSource, searchQuery]);

  // Source Stats Counts
  const sourceStats = useMemo(() => {
    const counts = {
      total: photos.length,
      firebase: photos.filter(p => p.source === 'firebase_storage').length,
      drive: photos.filter(p => p.source === 'google_drive').length,
      photos: photos.filter(p => p.source === 'google_photos').length
    };
    return counts;
  }, [photos]);

  return (
    <section 
      id="project-gallery-section" 
      className="relative z-10 py-16 md:py-24 border-t border-slate-800 bg-[#050c18] text-white"
      aria-label="Completed Project Gallery and Masonry Grid"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* SECTION HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-widest mb-3">
              <ImageIcon className="w-4 h-4 text-[#00ff66]" />
              <span>Multi-Source Media Stream • Firebase Storage • Google Workspace</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white tracking-tight uppercase">
              Completed Project Showcase
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
              Explore high-resolution job site photography of completed Western Red Cedar privacy fences, automated cantilever solar gates, wrought iron perimeters, and smart IoT access nodes across the Treasure Valley.
            </p>
          </div>

          {/* CLOUD SOURCE ACTION CONTROLS */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Upload to Firebase Storage */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30"
              title="Upload project photo directly to Firebase Storage bucket"
            >
              <Upload className="w-4 h-4 text-[#00ff66]" />
              <span>Upload to Storage</span>
            </button>

            {/* Sync Google Drive */}
            <button
              onClick={handleSyncGoogleDrive}
              disabled={isSyncingDrive}
              className="px-3.5 py-2.5 rounded-xl bg-black/60 hover:bg-slate-800 border border-slate-700 hover:border-[#38bdf8] text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2"
              title="Fetch project images from Google Drive"
            >
              <HardDrive className={`w-4 h-4 text-[#38bdf8] ${isSyncingDrive ? 'animate-spin' : ''}`} />
              <span>Sync Drive</span>
            </button>

            {/* Sync Google Photos */}
            <button
              onClick={handleSyncGooglePhotos}
              disabled={isSyncingPhotos}
              className="px-3.5 py-2.5 rounded-xl bg-black/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2"
              title="Query Google Photos / Google Cloud Picker"
            >
              <Camera className={`w-4 h-4 text-amber-400 ${isSyncingPhotos ? 'animate-spin' : ''}`} />
              <span>Google Photos</span>
            </button>

            {/* Reload Gallery */}
            <button
              onClick={loadGalleryPhotos}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-black/60 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              title="Refresh Firestore & Storage Catalog"
              aria-label="Refresh Gallery"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#38bdf8]' : ''}`} />
            </button>
          </div>
        </div>

        {/* MULTI-SOURCE METRICS & CLOUD PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-white">{sourceStats.total}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Builds</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-white">{sourceStats.firebase}</div>
              <div className="text-[10px] font-mono text-amber-300 uppercase">Firebase Storage</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-white">{sourceStats.drive}</div>
              <div className="text-[10px] font-mono text-[#38bdf8] uppercase">Google Drive</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800 backdrop-blur-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-white">{sourceStats.photos}</div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase">Google Photos</div>
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH TOOLBAR */}
        <div className="bg-black/50 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'wood_fence', label: 'Cedar Privacy' },
              { id: 'automated_gate', label: 'Solar Gates' },
              { id: 'iron_fence', label: 'Wrought Iron' },
              { id: 'vinyl_fence', label: 'Vinyl' },
              { id: 'smart_access', label: 'IoT Software' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#38bdf8] text-black font-bold shadow-md shadow-[#38bdf8]/20'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Source Selector & Search */}
          <div className="flex items-center gap-3">
            {/* Storage Source Dropdown */}
            <div className="relative">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 outline-none focus:border-[#38bdf8]"
                aria-label="Filter by storage source"
              >
                <option value="all">All Storage Sources</option>
                <option value="firebase_storage">Firebase Storage</option>
                <option value="google_drive">Google Drive</option>
                <option value="google_photos">Google Photos</option>
              </select>
            </div>

            {/* Keyword Search Input */}
            <div className="relative min-w-[200px] flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search specs, city, post type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500 outline-none focus:border-[#38bdf8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MASONRY PHOTO GRID */}
        {isLoading ? (
          <motion.div
            variants={skeletonContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
          >
            {[1, 2, 3, 4, 5, 6].map((skel, sIdx) => {
              const isTall = sIdx % 3 === 0;
              return (
                <motion.div
                  key={`skeleton-${skel}`}
                  variants={skeletonItemVariants}
                  className={`rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800/80 p-5 flex flex-col justify-between animate-pulse ${
                    isTall ? 'row-span-2 min-h-[420px]' : 'min-h-[290px]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-24 h-5 rounded-lg bg-slate-800/90" />
                    <div className="w-14 h-5 rounded-lg bg-slate-800/90" />
                  </div>
                  <div className="flex-1 flex items-center justify-center my-6">
                    <Loader2 className="w-8 h-8 text-[#38bdf8]/40 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-32 h-3.5 rounded bg-[#38bdf8]/20" />
                    <div className="w-3/4 h-5 rounded bg-slate-800" />
                    <div className="w-full h-3 rounded bg-slate-800/60" />
                    <div className="w-2/3 h-3 rounded bg-slate-800/60" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : filteredPhotos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-black/30 border border-dashed border-slate-800 rounded-3xl p-8"
          >
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-heading font-bold text-slate-300 uppercase">No Matching Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Try adjusting your category filters, storage source, or search terms, or upload a new photo directly to Firebase Storage.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedSource('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`gallery-grid-${selectedCategory}-${selectedSource}-${searchQuery}-${photos.length}`}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <GalleryCardItem
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onSelect={setSelectedPhoto}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* LIGHTBOX SPECIFICATION MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#081524] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl shadow-black/90 max-h-[90vh] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 shadow-lg"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo High-Res Column */}
              <div className="md:w-1/2 relative bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                <img 
                  src={selectedPhoto.imageUrl} 
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover max-h-[550px]"
                />
                
                {/* Source Badge Pin */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Cloud className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Source:</span>
                  </span>
                  <span className="text-[#38bdf8] font-bold truncate max-w-[220px]">
                    {selectedPhoto.sourceLabel}
                  </span>
                </div>
              </div>

              {/* Project Specs & Engineering Details Column */}
              <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase font-bold tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedPhoto.location}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-extrabold text-white leading-tight">
                    {selectedPhoto.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mt-3">
                    {selectedPhoto.description}
                  </p>

                  {/* Specification Breakdown */}
                  <div className="mt-6 space-y-2.5">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#00ff66]" />
                      <span>Engineering Specifications</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/50 border border-slate-800 text-xs font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Material Grade:</span>
                        <span className="text-white font-semibold">{selectedPhoto.specs?.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Post Engineering:</span>
                        <span className="text-[#38bdf8] font-semibold">{selectedPhoto.specs?.postType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Footing Depth:</span>
                        <span className="text-emerald-400 font-semibold">{selectedPhoto.specs?.footingDepth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hardware & Latches:</span>
                        <span className="text-white">{selectedPhoto.specs?.hardware}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Warranty Coverage:</span>
                        <span className="text-[#00ff66] font-bold">{selectedPhoto.specs?.warranty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Homeowner Review Quote if present */}
                  {selectedPhoto.homeownerReview && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 italic">
                      "{selectedPhoto.homeownerReview}"
                    </div>
                  )}
                </div>

                {/* Lightbox Footer Actions */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setSelectedPhoto(null);
                      if (onQuoteRequest) {
                        onQuoteRequest({
                          fenceType: selectedPhoto.category === 'automated_gate' ? 'Automated Solar Gate' : 'Western Red Cedar Privacy',
                          footage: selectedPhoto.linearFeet || 180
                        });
                      }
                    }}
                    className="flex-1 py-3 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Estimate This Exact Spec</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD PROJECT PHOTO MODAL (Firebase Storage Bucket) */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
            className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#081524] border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/90 overflow-hidden max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
                aria-label="Close Upload Modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Title */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider mb-2">
                  <Cloud className="w-4 h-4 text-amber-400" />
                  <span>Firebase Cloud Storage Uploader</span>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight uppercase">
                  Add Installation Photography
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload completed job site photos to Firebase Storage bucket and publish them live into the showcase gallery.
                </p>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                
                {/* File Drop Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-[#38bdf8] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-black/40 relative overflow-hidden"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploadPreview ? (
                    <div className="relative">
                      <img 
                        src={uploadPreview} 
                        alt="Upload Preview" 
                        className="max-h-48 mx-auto rounded-xl object-cover shadow-md"
                      />
                      <p className="text-xs font-mono text-[#00ff66] mt-2 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready to upload: {uploadFile?.name || 'Selected Photo'}</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-10 h-10 text-[#38bdf8] mx-auto mb-2" />
                      <p className="text-xs font-mono font-bold text-white">
                        Click or drag & drop project photo here
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Supports JPG, PNG, WEBP (Direct Firebase Storage Bucket Stream)
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 6ft Cedar Privacy with Steel Posts"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Idaho Location / Subdivision
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Meridian ID (Paramount)"
                      value={uploadForm.location}
                      onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Project Category
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    >
                      <option value="wood_fence">Western Red Cedar</option>
                      <option value="automated_gate">Automated Solar Gate</option>
                      <option value="iron_fence">Wrought Iron & Pool</option>
                      <option value="vinyl_fence">Vinyl Perimeter</option>
                      <option value="smart_access">IoT Access Control</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Linear Footage (LF)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 180"
                      value={uploadForm.linearFeet}
                      onChange={(e) => setUploadForm({ ...uploadForm, linearFeet: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Project Description & Craftsmanship Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe timber grade, post depth, solar operator model, or latch specifications..."
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Craftsmanship Highlights (Tags, Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="PostMaster Steel, 36in Frost Footing, Solar Powered, Meridian ID"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-slate-700 text-white text-xs font-mono focus:border-[#38bdf8] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={uploadProgress}
                    className="w-full py-3 rounded-xl bg-[#1e40af] hover:bg-[#2563eb] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {uploadProgress ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#00ff66]" />
                        <span>Uploading to Firebase Storage...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4 text-[#00ff66]" />
                        <span>Upload & Stream to Live Gallery</span>
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

export default ProjectGallery;
