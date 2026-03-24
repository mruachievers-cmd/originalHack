import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Shield, Siren, AlertTriangle, Search, Filter, Layers, Navigation, Activity } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { toast } from "sonner";

const markers = [
  { x: 32, y: 42, type: "police", label: "Sector-7 Command" },
  { x: 58, y: 28, type: "police", label: "North Precinct" },
  { x: 42, y: 68, type: "emergency", label: "Rapid Response Unit" },
  { x: 78, y: 52, type: "police", label: "East Division Outpost" },
  { x: 28, y: 72, type: "hotspot", label: "Zone A - High Risk" },
  { x: 72, y: 78, type: "hotspot", label: "Zone B - Active Alert" },
  { x: 18, y: 56, type: "emergency", label: "Emergency Medical Center" },
  { x: 45, y: 35, type: "hotspot", label: "Zone C - Reported Theft" },
  { x: 15, y: 25, type: "hotspot", label: "Zone D - Suspicious Activity" },
  { x: 85, y: 40, type: "hotspot", label: "Zone E - High Alert" },
  { x: 65, y: 60, type: "emergency", label: "Fire Station Node" },
];

const iconMap = {
  police: { icon: Shield, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  emergency: { icon: Siren, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  hotspot: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

const SafetyMapSection = () => {
  const [mapSrc, setMapSrc] = useState("https://www.openstreetmap.org/export/embed.html?bbox=78.420,17.350,78.520,17.420&layer=mapnik");
  const [isLocating, setIsLocating] = useState(false);

  const handleLiveLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    toast.info("Synchronizing with orbital satellite grid...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const offset = 0.005; 
        const newBbox = `${longitude - offset},${latitude - offset},${longitude + offset},${latitude + offset}`;
        setMapSrc(`https://www.openstreetmap.org/export/embed.html?bbox=${newBbox}&layer=mapnik`);
        setIsLocating(false);
        toast.success("Coordinates Locked: Hyper-Local View Active");
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        toast.error("Failed to acquire signal. Check GPS permissions.");
      }
    );
  };

  return (
    <section id="map" className="section-padding relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20 contrast-125"
          alt="Tactical City Grid"
          loading="lazy"
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-primary/20">
            <Navigation size={12} className="animate-pulse" />
            GEO-SPATIAL INTELLIGENCE
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-950">
            Tactical <span className="text-primary italic">Safety Grid</span>
          </h2>
          <p className="text-slate-800 text-lg leading-relaxed font-bold">
            Proprietary visualization of metropolitan security assets, real-time crime hotspots, and optimized emergency response routing.
          </p>
        </motion.div>

        <TiltCard className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-4 md:p-8 border border-primary/10 overflow-hidden shadow-2xl relative">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-primary/10 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 font-bold"
                placeholder="Search coordinates or sectors..."
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLiveLocation}
                disabled={isLocating}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                  isLocating ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:brightness-110 shadow-primary/20'
                }`}
              >
                <Navigation size={14} className={isLocating ? 'animate-spin' : ''} />
                {isLocating ? 'Locating...' : 'Track My Location'}
              </button>
              
              <div className="p-3 bg-slate-50 rounded-2xl border border-primary/10 text-slate-400 hover:text-primary transition-all cursor-pointer">
                <Shield size={18} />
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-primary/10">
                <button className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-md">Satellite</button>
                <button className="px-4 py-2 rounded-xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-primary font-bold">Terrain</button>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-primary/10 text-slate-500 hover:text-primary transition-all cursor-pointer flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest shadow-sm">
                <Activity size={18} /> Layers
              </div>
            </div>
          </div>

          <div className="relative aspect-[21/9] rounded-[2rem] bg-secondary/10 overflow-hidden border border-primary/20 shadow-inner group">
            
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
               <div className="px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border-2 border-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-primary shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  LIVE FEED ACTIVE: HYDERABAD COMMAND
               </div>
               <div className="px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border-2 border-primary/20 text-[10px] font-mono text-slate-800 shadow-xl font-bold">
                  COORD: 17.3850° N, 78.4867° E
               </div>
            </div>

            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <iframe 
                width="130%" 
                height="130%" 
                frameBorder="0" 
                src={mapSrc} 
                className="transition-all duration-1000 ease-in-out"
                style={{ 
                  position: 'absolute', 
                  top: '-15%', 
                  left: '-15%', 
                  filter: 'contrast(1.2) brightness(1.1) saturate(1.2)' 
                }}
              ></iframe>
              <div className="absolute inset-0 bg-primary/10 mix-blend-color"></div>
            </div>

            {markers.map((m, i) => {
              const cfg = iconMap[m.type as keyof typeof iconMap];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="absolute z-10"
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  <div className="relative -translate-x-1/2 -translate-y-1/2 group/marker">
                    <div className={`w-10 h-10 rounded-2xl bg-white border ${cfg.border} ${cfg.bg} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl relative z-20`}>
                      <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-none translate-y-2 group-hover/marker:translate-y-0 shadow-2xl">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${cfg.color.replace('text-', 'bg-')}`}></div>
                         {m.label}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45"></div>
                    </div>

                    {m.type === "hotspot" && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-rose-500/50"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border-2 border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 shadow-xl z-30">
              <Navigation size={12} /> AUTONOMOUS RELAY ENGINE
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Shield, label: "Precinct Command", color: "text-emerald-600", bg: "bg-emerald-50", desc: "Active Law Units" },
                { icon: Siren, label: "Emergency Response", color: "text-amber-600", bg: "bg-amber-50", desc: "Medical/Fire Grid" },
                { icon: AlertTriangle, label: "Critical Hotspots", color: "text-rose-600", bg: "bg-rose-50", desc: "Incident Vectors" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-primary/10 group hover:border-primary/30 hover:shadow-xl transition-all shadow-sm">
                  <div className={`w-12 h-12 rounded-2xl ${l.bg} flex items-center justify-center shrink-0 ${l.color} group-hover:scale-110 transition-transform`}>
                    <l.icon size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-0.5 text-slate-900">{l.label}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{l.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-900 rounded-3xl p-5 flex flex-col justify-center border border-white/10 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                  <Shield size={60} className="text-white" />
               </div>
               <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Grid Status</div>
               <div className="text-2xl font-black text-white italic">OPERATIONAL</div>
               <div className="text-[10px] text-white/40 font-bold mt-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  NERAL RELAY SECURE
               </div>
            </div>
          </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};

export default SafetyMapSection;
