import React, { useState, useMemo } from 'react';
import {
  Train,
  Bus,
  GraduationCap,
  Baby,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Store,
  HeartPulse,
  Trees,
  Users,
  Dumbbell,
  BookOpen,
  MapPin,
  Clock,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Sparkles,
  ExternalLink,
  Map as MapIcon,
  Radar,
  List,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Amenity, AmenityCategory, HDBProperty } from '../types';
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsDirectUrl,
  getGoogleMapsDirectionsUrl,
  getGoogleStreetViewUrl,
  calculateDistanceMeters,
  getPropertyCoordinates,
} from '../utils/geocoding';

interface InteractiveMapProps {
  property: HDBProperty;
  onSelectAmenity?: (amenity: Amenity) => void;
}

type MapDisplayMode = 'google-map' | 'radar-canvas' | 'amenity-list';

const CATEGORY_CONFIG: Record<
  AmenityCategory,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string; badge: string; pinColor: string }
> = {
  mrt: { label: 'MRT / LRT', icon: Train, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', border: 'border-emerald-500/30 dark:border-emerald-500/40', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', pinColor: '#10b981' },
  bus: { label: 'Bus Stops', icon: Bus, color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-500/10 dark:bg-sky-500/20', border: 'border-sky-500/30 dark:border-sky-500/40', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300', pinColor: '#0ea5e9' },
  school_pri: { label: 'Primary Schools', icon: GraduationCap, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', border: 'border-indigo-500/30 dark:border-indigo-500/40', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300', pinColor: '#6366f1' },
  school_sec: { label: 'Secondary & Colleges', icon: GraduationCap, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10 dark:bg-purple-500/20', border: 'border-purple-500/30 dark:border-purple-500/40', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300', pinColor: '#a855f7' },
  childcare: { label: 'Childcare Centres', icon: Baby, color: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-500/10 dark:bg-pink-500/20', border: 'border-pink-500/30 dark:border-pink-500/40', badge: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300', pinColor: '#ec4899' },
  mall: { label: 'Shopping Malls', icon: ShoppingBag, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/20', border: 'border-amber-500/30 dark:border-amber-500/40', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', pinColor: '#f59e0b' },
  supermarket: { label: 'Supermarkets', icon: ShoppingCart, color: 'text-teal-500 dark:text-teal-400', bg: 'bg-teal-500/10 dark:bg-teal-500/20', border: 'border-teal-500/30 dark:border-teal-500/40', badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300', pinColor: '#14b8a6' },
  hawker: { label: 'Hawkers & Food Courts', icon: Utensils, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-500/20', border: 'border-orange-500/30 dark:border-orange-500/40', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300', pinColor: '#f97316' },
  market: { label: 'Wet Markets', icon: Store, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10 dark:bg-rose-500/20', border: 'border-rose-500/30 dark:border-rose-500/40', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', pinColor: '#f43f5e' },
  healthcare: { label: 'Clinics & Hospitals', icon: HeartPulse, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10 dark:bg-red-500/20', border: 'border-red-500/30 dark:border-red-500/40', badge: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300', pinColor: '#ef4444' },
  park: { label: 'Parks & PCN', icon: Trees, color: 'text-green-500 dark:text-green-400', bg: 'bg-green-500/10 dark:bg-green-500/20', border: 'border-green-500/30 dark:border-green-500/40', badge: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300', pinColor: '#22c55e' },
  community: { label: 'Community Centres', icon: Users, color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', border: 'border-cyan-500/30 dark:border-cyan-500/40', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300', pinColor: '#06b6d4' },
  sports: { label: 'Sports & Stadiums', icon: Dumbbell, color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-500/10 dark:bg-yellow-500/20', border: 'border-yellow-500/30 dark:border-yellow-500/40', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300', pinColor: '#eab308' },
  library: { label: 'Public Libraries', icon: BookOpen, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/20', border: 'border-blue-500/30 dark:border-blue-500/40', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300', pinColor: '#3b82f6' },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ property, onSelectAmenity }) => {
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>('google-map');
  const [selectedCategory, setSelectedCategory] = useState<AmenityCategory | 'all'>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(property.amenities[0] || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRadius, setShowRadius] = useState<boolean>(true);

  // Group amenities by category count
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: property.amenities.length };
    property.amenities.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [property.amenities]);

  const filteredAmenities = useMemo(() => {
    if (selectedCategory === 'all') return property.amenities;
    return property.amenities.filter((a) => a.category === selectedCategory);
  }, [property.amenities, selectedCategory]);

  // Deterministic 2D polar positions for SVG radar mode
  const amenityPositions = useMemo(() => {
    return property.amenities.map((amenity, index) => {
      const angle = (index * (360 / property.amenities.length) + (index % 2 === 0 ? 15 : -25)) * (Math.PI / 180);
      const distRatio = Math.min(1.0, amenity.distanceMeters / 1500);
      const radius = 45 + distRatio * 180 * zoomLevel;
      const x = 280 + Math.cos(angle) * radius;
      const y = 240 + Math.sin(angle) * radius;
      return { amenity, x, y };
    });
  }, [property.amenities, zoomLevel]);

  const handleSelect = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    if (onSelectAmenity) onSelectAmenity(amenity);
  };

  const coords = useMemo(() => {
    return getPropertyCoordinates(property);
  }, [property]);

  const googleMapsEmbedUrl = useMemo(() => {
    return getGoogleMapsEmbedUrl(coords.lat, coords.lng, 16);
  }, [coords.lat, coords.lng]);

  return (
    <div
      id="interactive-location-map"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl text-slate-800 dark:text-slate-100 transition-colors"
    >
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Google Maps & Amenity Radar</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              SLA Verified: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
            <span>Blk {property.block} {property.streetName}</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">({property.town})</span>
          </h3>
        </div>

        {/* View Mode Switcher + Google Links */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 3 View Mode Toggle Buttons */}
          <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs">
            <button
              id="map-mode-google"
              onClick={() => setDisplayMode('google-map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                displayMode === 'google-map'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Google Map Overlay</span>
            </button>

            <button
              id="map-mode-radar"
              onClick={() => setDisplayMode('radar-canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                displayMode === 'radar-canvas'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radar className="w-3.5 h-3.5" />
              <span>Polar Radar</span>
            </button>

            <button
              id="map-mode-list"
              onClick={() => setDisplayMode('amenity-list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                displayMode === 'amenity-list'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Amenity List ({property.amenities.length})</span>
            </button>
          </div>

          {/* Direct Google External Tools */}
          <div className="flex items-center gap-1">
            <a
              id="btn-google-street-view"
              href={getGoogleStreetViewUrl(coords.lat, coords.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              title="Open Google Street View (360°)"
            >
              <Eye className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">Street View</span>
            </a>

            <a
              id="btn-google-directions"
              href={getGoogleMapsDirectionsUrl(`Blk ${property.block} ${property.streetName}`, coords.lat, coords.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition"
              title="Get Google Walking Directions"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Directions</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* Category Filter Badges */}
      <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800/80">
        <button
          id="cat-filter-all"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          <span>All Amenities</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 dark:bg-white/10">{property.amenities.length}</span>
        </button>

        {(Object.keys(CATEGORY_CONFIG) as AmenityCategory[]).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const count = categoryCounts[cat] || 0;
          if (count === 0) return null;
          const Icon = cfg.icon;
          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              id={`cat-filter-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? '' : cfg.color}`} />
              <span>{cfg.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 dark:bg-black/20' : 'bg-black/5 dark:bg-white/10'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEWPORT AREA: Depending on selected Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Main Map / Radar Display Box (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {displayMode === 'google-map' && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 h-[460px] shadow-inner">
              {/* Google Maps iFrame */}
              <iframe
                title="Google Map Property View"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />

              {/* Overlaid Amenity Radar Rings & Legend Bar */}
              <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-2.5 rounded-2xl shadow-xl max-w-xs space-y-1.5 pointer-events-auto">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Radar className="w-3 h-3 animate-spin" />
                    Amenity Radar Overlaid
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {filteredAmenities.length} within 1km
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  <div className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-center">
                    &lt;300m (4m)
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 text-center">
                    &lt;600m (8m)
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-center">
                    1km School
                  </div>
                </div>
              </div>

              {/* Floating Quick Amenity Pills Overlaid along bottom */}
              <div className="absolute bottom-3 inset-x-3 flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                {filteredAmenities.slice(0, 6).map((amenity) => {
                  const cfg = CATEGORY_CONFIG[amenity.category];
                  const Icon = cfg.icon;
                  const isSelected = selectedAmenity?.id === amenity.id;

                  return (
                    <button
                      key={amenity.id}
                      onClick={() => handleSelect(amenity)}
                      className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[110px]">{amenity.name}</span>
                      <span className="text-[10px] font-mono opacity-80">{amenity.distanceMeters}m</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {displayMode === 'radar-canvas' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 relative overflow-hidden flex items-center justify-center min-h-[460px]">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

              {/* SVG Map Canvas */}
              <svg viewBox="0 0 560 480" className="w-full h-full max-h-[460px] select-none">
                <defs>
                  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Walking Isochrone Rings */}
                {showRadius && (
                  <>
                    <circle cx="280" cy="240" r={65 * zoomLevel} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                    <text x="280" y={240 - 68 * zoomLevel} fill="#10b981" fontSize="9" textAnchor="middle" opacity="0.7">300m (4 mins walk)</text>

                    <circle cx="280" cy="240" r={125 * zoomLevel} fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
                    <text x="280" y={240 - 128 * zoomLevel} fill="#0ea5e9" fontSize="9" textAnchor="middle" opacity="0.65">600m (8 mins walk)</text>

                    <circle cx="280" cy="240" r={190 * zoomLevel} fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="5 5" opacity="0.25" />
                    <text x="280" y={240 - 193 * zoomLevel} fill="#6366f1" fontSize="9" textAnchor="middle" opacity="0.55">1km Priority Radius</text>
                  </>
                )}

                <circle cx="280" cy="240" r="45" fill="url(#centerGlow)" />

                {/* Amenity Laser Lines */}
                {amenityPositions.map(({ amenity, x, y }) => {
                  const isSelected = selectedAmenity?.id === amenity.id;
                  const isFiltered = selectedCategory === 'all' || selectedCategory === amenity.category;
                  if (!isFiltered) return null;

                  return (
                    <line
                      key={`line-${amenity.id}`}
                      x1="280"
                      y1="240"
                      x2={x}
                      y2={y}
                      stroke={isSelected ? '#34d399' : '#334155'}
                      strokeWidth={isSelected ? '2' : '1'}
                      strokeDasharray={isSelected ? 'none' : '2 2'}
                      opacity={isSelected ? 0.9 : 0.4}
                    />
                  );
                })}

                {/* Amenity Interactive Nodes */}
                {amenityPositions.map(({ amenity, x, y }) => {
                  const isSelected = selectedAmenity?.id === amenity.id;
                  const isFiltered = selectedCategory === 'all' || selectedCategory === amenity.category;
                  if (!isFiltered) return null;

                  return (
                    <g
                      key={`node-${amenity.id}`}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => handleSelect(amenity)}
                    >
                      {isSelected && (
                        <circle cx={x} cy={y} r="18" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.8" className="animate-ping" />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? '14' : '10'}
                        fill={isSelected ? '#059669' : '#1e293b'}
                        stroke={isSelected ? '#34d399' : '#475569'}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        filter={isSelected ? 'url(#glow)' : undefined}
                      />
                      <text
                        x={x}
                        y={y + 3.5}
                        fontSize={isSelected ? '9' : '8'}
                        fontWeight="bold"
                        fill={isSelected ? '#ffffff' : '#94a3b8'}
                        textAnchor="middle"
                      >
                        {amenity.name.charAt(0)}
                      </text>
                      <text
                        x={x}
                        y={y + 20}
                        fontSize="9"
                        fontWeight={isSelected ? '600' : 'normal'}
                        fill={isSelected ? '#ffffff' : '#94a3b8'}
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow"
                      >
                        {amenity.name.length > 18 ? `${amenity.name.slice(0, 16)}...` : amenity.name}
                      </text>
                    </g>
                  );
                })}

                {/* Center Subject HDB Block Marker */}
                <g>
                  <circle cx="280" cy="240" r="16" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" filter="url(#glow)" />
                  <MapPin className="w-5 h-5 text-slate-950" x="270" y="228" />
                  <rect x="230" y="260" width="100" height="24" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                  <text x="280" y="275" fontSize="10" fontWeight="bold" fill="#34d399" textAnchor="middle">
                    Blk {property.block} (Subject)
                  </text>
                </g>
              </svg>

              {/* Canvas Zoom Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  id="map-zoom-out"
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-[11px] font-mono text-slate-400">{Math.round(zoomLevel * 100)}%</span>
                <button
                  id="map-zoom-in"
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {displayMode === 'amenity-list' && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 max-h-[460px] overflow-y-auto space-y-2.5 scrollbar-thin">
              {filteredAmenities.map((amenity) => {
                const cfg = CATEGORY_CONFIG[amenity.category];
                const Icon = cfg.icon;
                const isSelected = selectedAmenity?.id === amenity.id;

                return (
                  <div
                    key={amenity.id}
                    onClick={() => handleSelect(amenity)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${cfg.bg} ${cfg.border} border`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {cfg.label}
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {amenity.name}
                        </h5>
                        {amenity.highlight && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {amenity.highlight}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {amenity.distanceMeters}m
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {amenity.walkingMinutes} mins walk
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Info Panel: Selected Amenity Detail & Radar Breakdown (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Selected Amenity Highlight Box */}
          {selectedAmenity ? (
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const cfg = CATEGORY_CONFIG[selectedAmenity.category];
                    const Icon = cfg.icon;
                    return (
                      <div className={`p-2 rounded-xl ${cfg.bg} ${cfg.border} border`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                    );
                  })()}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {CATEGORY_CONFIG[selectedAmenity.category].label}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                      {selectedAmenity.name}
                    </h4>
                  </div>
                </div>
                {selectedAmenity.rating && (
                  <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg font-bold">
                    ★ {selectedAmenity.rating}
                  </span>
                )}
              </div>

              {/* Distance Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-3 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold">Walking Time</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{selectedAmenity.walkingMinutes} mins walk</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-500" />
                  <div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold">Distance</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{selectedAmenity.distanceMeters} meters</div>
                  </div>
                </div>
              </div>

              {selectedAmenity.highlight && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 bg-emerald-500/5 dark:bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/20 dark:border-slate-800 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">AI Intelligence:</span> {selectedAmenity.highlight}
                </p>
              )}

              {/* Direct Link to Google Maps Navigation for this specific amenity */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <a
                  href={getGoogleMapsDirectionsUrl(selectedAmenity.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs font-bold transition hover:opacity-90 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : null}

          {/* AI Location Score Category Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Location Score Breakdown</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{property.locationScores.overallLocationScore}/100</span>
            </h4>

            <div className="space-y-2 text-xs">
              <ScoreRow label="Transport (MRT / Bus)" score={property.locationScores.transport} icon={Train} color="bg-emerald-500" />
              <ScoreRow label="Schools & Childcare" score={property.locationScores.schools} icon={GraduationCap} color="bg-indigo-500" />
              <ScoreRow label="Shopping & Retail" score={property.locationScores.shopping} icon={ShoppingBag} color="bg-amber-500" />
              <ScoreRow label="Hawker & Dining" score={property.locationScores.food} icon={Utensils} color="bg-orange-500" />
              <ScoreRow label="Healthcare & Clinics" score={property.locationScores.healthcare} icon={HeartPulse} color="bg-red-500" />
              <ScoreRow label="Parks & Recreation" score={property.locationScores.recreation} icon={Trees} color="bg-green-500" />
              <ScoreRow label="Daily Convenience" score={property.locationScores.convenience} icon={Store} color="bg-cyan-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreRow: React.FC<{ label: string; score: number; icon: React.ElementType; color: string }> = ({
  label,
  score,
  icon: Icon,
  color,
}) => (
  <div>
    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium">
      <span className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span>{label}</span>
      </span>
      <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{score}%</span>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
    </div>
  </div>
);
