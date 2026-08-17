/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Compass, Layers, Shield, Wrench, CheckCircle, ExternalLink, Key } from 'lucide-react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

interface LocationPoint {
  id: string;
  name: string;
  category: 'primary' | 'expanded' | 'depot';
  position: { lat: number; lng: number };
  description: string;
  activeJobsCount: number;
  leadTime: string;
}

const SERVICE_LOCATIONS: LocationPoint[] = [
  {
    id: 'boise-hq',
    name: 'Boise Metro (HQ & Dispatch)',
    category: 'depot',
    position: { lat: 43.6150, lng: -116.2023 },
    description: 'Central fabrication workshop, timber yard & automated gate diagnostic bay.',
    activeJobsCount: 14,
    leadTime: '3-5 Days'
  },
  {
    id: 'meridian',
    name: 'Meridian Residential Corridor',
    category: 'primary',
    position: { lat: 43.6121, lng: -116.3915 },
    description: 'High-density Western Red Cedar & vinyl subdivision installations.',
    activeJobsCount: 22,
    leadTime: '2-4 Days'
  },
  {
    id: 'eagle',
    name: 'Eagle Acreage & Foothills',
    category: 'primary',
    position: { lat: 43.6954, lng: -116.3535 },
    description: 'Custom estate ornamental iron, solar gate automation, PostMaster steel.',
    activeJobsCount: 9,
    leadTime: '4-7 Days'
  },
  {
    id: 'nampa',
    name: 'Nampa Service Division',
    category: 'primary',
    position: { lat: 43.5407, lng: -116.5635 },
    description: 'Full residential perimeter builds & automated entry access controls.',
    activeJobsCount: 11,
    leadTime: '3-5 Days'
  },
  {
    id: 'caldwell',
    name: 'Caldwell & Canyon County',
    category: 'expanded',
    position: { lat: 43.6629, lng: -116.6874 },
    description: 'Ranch-rail, heavy-duty pasture boundary, and motorized ranch gates.',
    activeJobsCount: 7,
    leadTime: '5-8 Days'
  },
  {
    id: 'star-kuna',
    name: 'Star & Kuna Growth Zones',
    category: 'expanded',
    position: { lat: 43.4918, lng: -116.4201 },
    description: 'New construction perimeter framing & smart IoT controller deployments.',
    activeJobsCount: 8,
    leadTime: '3-6 Days'
  }
];

export const ServiceAreaMap: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<LocationPoint | null>(SERVICE_LOCATIONS[0]);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');

  const hasValidKey = Boolean(API_KEY && API_KEY.trim() !== '');

  return (
    <section id="service-map" className="relative z-10 py-16 md:py-24 px-4 md:px-6 bg-[#030712] border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-widest mb-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>Idaho Coverage (208 Regional Dispatch)</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">
              TREASURE VALLEY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] via-[#38bdf8] to-[#00ff66]">
                SERVICE MAP & LIVE SITES
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-xl">
              Real-time contractor dispatch zones, active residential build locations, and certified automated gate service territories across southwest Idaho.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapType(prev => prev === 'roadmap' ? 'hybrid' : 'roadmap')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#38bdf8] text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              data-hover="true"
            >
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>{mapType === 'roadmap' ? 'Satellite View' : 'Roadmap View'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Container */}
          <div className="lg:col-span-8 h-[480px] md:h-[540px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative bg-[#091522]">
            {hasValidKey ? (
              <APIProvider apiKey={API_KEY}>
                <Map
                  defaultCenter={{ lat: 43.6150, lng: -116.3500 }}
                  defaultZoom={10.5}
                  mapTypeId={mapType}
                  mapId="208_FENCE_MAP"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  className="w-full h-full"
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true
                  }}
                >
                  {SERVICE_LOCATIONS.map((loc) => (
                    <AdvancedMarker
                      key={loc.id}
                      position={loc.position}
                      onClick={() => setSelectedPoint(loc)}
                      title={loc.name}
                    >
                      <Pin
                        background={loc.category === 'depot' ? '#00ff66' : loc.category === 'primary' ? '#1e40af' : '#38bdf8'}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                        scale={1.1}
                      />
                    </AdvancedMarker>
                  ))}

                  {selectedPoint && (
                    <InfoWindow
                      position={selectedPoint.position}
                      onCloseClick={() => setSelectedPoint(null)}
                    >
                      <div className="p-2 max-w-[220px] text-slate-900">
                        <div className="text-xs font-bold font-heading">{selectedPoint.name}</div>
                        <div className="text-[11px] text-slate-600 mt-1 leading-snug">{selectedPoint.description}</div>
                        <div className="mt-2 pt-1 border-t border-slate-200 flex justify-between text-[10px] font-mono font-semibold">
                          <span>Active Crews: {selectedPoint.activeJobsCount}</span>
                          <span className="text-blue-700">{selectedPoint.leadTime}</span>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#091729] to-[#040a14]">
                <div className="w-14 h-14 rounded-2xl bg-[#1e40af]/30 border border-[#38bdf8]/50 flex items-center justify-center text-[#38bdf8] mb-4 shadow-lg">
                  <Key className="w-7 h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-2">
                  Google Maps Platform Integration Ready
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                  Interactive GIS parcel bounds & 208 crew routes are ready. To display live Google Maps, set your <code className="text-[#38bdf8] bg-black/40 px-1.5 py-0.5 rounded font-mono">GOOGLE_MAPS_PLATFORM_KEY</code>.
                </p>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-left max-w-sm text-xs text-slate-300 font-mono space-y-1.5">
                  <div className="text-[#38bdf8] font-bold uppercase text-[11px]">Quick Setup:</div>
                  <div>1. Open Settings (⚙️ top right) → Secrets</div>
                  <div>2. Add key name: <span className="text-white font-bold">GOOGLE_MAPS_PLATFORM_KEY</span></div>
                  <div>3. Paste key & Enter (App rebuilds automatically)</div>
                </div>
              </div>
            )}
          </div>

          {/* Location Details / Dispatch Hub Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-bold mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Service Territories</span>
              </h3>
              
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {SERVICE_LOCATIONS.map((loc) => {
                  const isSelected = selectedPoint?.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedPoint(loc)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#0e2744] border-[#38bdf8] shadow-md' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heading text-white">{loc.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          loc.category === 'depot' 
                            ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30' 
                            : 'bg-blue-950 text-[#38bdf8] border-[#38bdf8]/30'
                        }`}>
                          {loc.leadTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {loc.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0d223a] to-[#081525] border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-heading">On-Site Line Locates Included</div>
                <div className="text-[10px] font-mono text-slate-400">811 Dig safety verification on all installs</div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-slate-700 text-[#00ff66]">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;
