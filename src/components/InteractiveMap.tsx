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
  Maximize2,
  CheckCircle2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { Amenity, AmenityCategory, HDBProperty, LocationScoreBreakdown } from '../types';

interface InteractiveMapProps {
  property: HDBProperty;
  onSelectAmenity?: (amenity: Amenity) => void;
}

const CATEGORY_CONFIG: Record<
  AmenityCategory,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string; ringColor: string }
> = {
  mrt: { label: 'MRT / LRT', icon: Train, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', ringColor: 'stroke-emerald-400' },
  bus: { label: 'Bus Stops', icon: Bus, color: 'text-sky-400', bg: 'bg-sky-500/20', border: 'border-sky-500/40', ringColor: 'stroke-sky-400' },
  school_pri: { label: 'Primary Schools', icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/40', ringColor: 'stroke-indigo-400' },
  school_sec: { label: 'Secondary & Colleges', icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40', ringColor: 'stroke-purple-400' },
  childcare: { label: 'Childcare Centres', icon: Baby, color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/40', ringColor: 'stroke-pink-400' },
  mall: { label: 'Shopping Malls', icon: ShoppingBag, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', ringColor: 'stroke-amber-400' },
  supermarket: { label: 'Supermarkets', icon: ShoppingCart, color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/40', ringColor: 'stroke-teal-400' },
  hawker: { label: 'Hawkers & Food Courts', icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40', ringColor: 'stroke-orange-400' },
  market: { label: 'Wet Markets', icon: Store, color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40', ringColor: 'stroke-rose-400' },
  healthcare: { label: 'Clinics & Hospitals', icon: HeartPulse, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40', ringColor: 'stroke-red-400' },
  park: { label: 'Parks & PCN', icon: Trees, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/40', ringColor: 'stroke-green-400' },
  community: { label: 'Community Centres', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', ringColor: 'stroke-cyan-400' },
  sports: { label: 'Sports & Stadiums', icon: Dumbbell, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', ringColor: 'stroke-yellow-400' },
  library: { label: 'Public Libraries', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40', ringColor: 'stroke-blue-400' },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ property, onSelectAmenity }) => {
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

  // Deterministic 2D polar positions for amenities based on distance & index
  const amenityPositions = useMemo(() => {
    return property.amenities.map((amenity, index) => {
      const angle = (index * (360 / property.amenities.length) + (index % 2 === 0 ? 15 : -25)) * (Math.PI / 180);
      // scale distance: 0m to 1500m -> radius 40px to 210px
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

  return (
    <div id="interactive-location-map" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Navigation className="w-3 h-3 animate-pulse" /> Live 14-Amenity Radar
            </span>
            <span className="text-xs text-slate-400">Precision Location Intelligence</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>{property.block} {property.streetName}</span>
            <span className="text-slate-400 text-sm font-normal">({property.town})</span>
          </h3>
        </div>

        {/* Quick Location Score pill */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">AI Location Score</div>
              <div className="text-lg font-extrabold text-emerald-400">{property.locationScores.overallLocationScore}<span className="text-xs text-slate-400">/100</span></div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              id="map-zoom-out"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              id="map-zoom-in"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="map-toggle-radius"
              onClick={() => setShowRadius((r) => !r)}
              className={`p-1.5 rounded-lg transition-colors ${showRadius ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:bg-slate-700'}`}
              title="Toggle Walking Isochrones"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
        <button
          id="cat-filter-all"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
          }`}
        >
          <span>All Amenities</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/40">{property.amenities.length}</span>
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
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-100 text-slate-950 font-semibold shadow-md'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : cfg.color}`} />
              <span>{cfg.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-slate-300 text-slate-900' : 'bg-slate-900/60 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Map Visual Canvas + Right Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-2">
        {/* SVG Interactive Canvas Stage */}
        <div className="lg:col-span-8 bg-slate-950/80 rounded-xl border border-slate-800 p-2 relative overflow-hidden flex items-center justify-center min-h-[420px]">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

          {/* SVG Map Canvas */}
          <svg viewBox="0 0 560 480" className="w-full h-full max-h-[440px] select-none">
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Walking Isochrone Rings */}
            {showRadius && (
              <>
                {/* 300m / 4 mins walking */}
                <circle cx="280" cy="240" r={65 * zoomLevel} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <text x="280" y={240 - 68 * zoomLevel} fill="#10b981" fontSize="9" textAnchor="middle" opacity="0.7">300m (4 mins walk)</text>

                {/* 600m / 8 mins walking */}
                <circle cx="280" cy="240" r={125 * zoomLevel} fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
                <text x="280" y={240 - 128 * zoomLevel} fill="#0ea5e9" fontSize="9" textAnchor="middle" opacity="0.65">600m (8 mins walk)</text>

                {/* 1000m / 12 mins walking */}
                <circle cx="280" cy="240" r={190 * zoomLevel} fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="5 5" opacity="0.25" />
                <text x="280" y={240 - 193 * zoomLevel} fill="#6366f1" fontSize="9" textAnchor="middle" opacity="0.55">1km Priority Radius</text>
              </>
            )}

            {/* Center HDB Glow Radius */}
            <circle cx="280" cy="240" r="45" fill="url(#centerGlow)" />

            {/* Amenity Connective Laser Lines */}
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
              const cfg = CATEGORY_CONFIG[amenity.category];
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
                  {/* Category initial / dot */}
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
                  {/* Name badge */}
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

          {/* Bottom Left Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] text-slate-300 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Target HDB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-sky-400" />
              <span>&lt;500m Walking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-indigo-400" />
              <span>&lt;1km Priority</span>
            </div>
          </div>
        </div>

        {/* Right Info Panel: Selected Amenity Detail & Radar Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Selected Amenity Highlight Box */}
          {selectedAmenity ? (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-lg">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const cfg = CATEGORY_CONFIG[selectedAmenity.category];
                    const Icon = cfg.icon;
                    return (
                      <div className={`p-2 rounded-lg ${cfg.bg} ${cfg.border} border`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                    );
                  })()}
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      {CATEGORY_CONFIG[selectedAmenity.category].label}
                    </span>
                    <h4 className="text-base font-bold text-white leading-tight">{selectedAmenity.name}</h4>
                  </div>
                </div>
                {selectedAmenity.rating && (
                  <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
                    ★ {selectedAmenity.rating}
                  </span>
                )}
              </div>

              {/* Distance Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-3.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Walking Time</div>
                    <div className="text-sm font-bold text-white">{selectedAmenity.walkingMinutes} mins walk</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Distance</div>
                    <div className="text-sm font-bold text-white">{selectedAmenity.distanceMeters} meters</div>
                  </div>
                </div>
              </div>

              {selectedAmenity.highlight && (
                <p className="text-xs text-slate-300 mt-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">AI Intelligence:</span> {selectedAmenity.highlight}
                </p>
              )}
            </div>
          ) : null}

          {/* AI Location Score Category Breakdown */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Location Score Breakdown</span>
              <span className="text-emerald-400 font-mono font-bold">{property.locationScores.overallLocationScore}/100</span>
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
    <div className="flex items-center justify-between text-slate-300 mb-1">
      <span className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span>{label}</span>
      </span>
      <span className="font-mono font-semibold text-slate-200">{score}%</span>
    </div>
    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
    </div>
  </div>
);
