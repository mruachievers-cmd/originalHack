import { motion } from "framer-motion";
import { MapPin, Shield, Siren, AlertTriangle, Search, Filter, Layers, Navigation } from "lucide-react";
import { TiltCard } from "./TiltCard";

const markers = [
  { x: 32, y: 42, type: "police", label: "Sector-7 Command" },
  { x: 58, y: 28, type: "police", label: "North Precinct" },
  { x: 42, y: 68, type: "emergency", label: "Rapid Response Unit" },
  { x: 78, y: 52, type: "police", label: "East Division Outpost" },
  { x: 28, y: 72, type: "hotspot", label: "Zone A - High Risk" },
  { x: 72, y: 78, type: "hotspot", label: "Zone B - Active Alert" },
  { x: 18, y: 56, type: "emergency", label: "Emergency Medical Center" },
];

const iconMap = {
  police: { icon: Shield, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  emergency: { icon: Siren, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  hotspot: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

const SafetyMapSection = () => (
  <section id="map" className="section-padding relative">
    <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.02] -z-10"></div>
    
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Navigation size={12} className="animate-pulse" />
          GEO-SPATIAL INTELLIGENCE
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          Tactical <span className="text-gradient">Safety Grid</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Proprietary visualization of metropolitan security assets, real-time crime hotspots, and optimized emergency response routing.
        </p>
      </motion.div>

      <TiltCard className="max-w-6xl mx-auto">
        <div className="glass-strong rounded-[2.5rem] p-4 md:p-8 border border-white/10 overflow-hidden shadow-2xl relative">
        {/* Map Header / Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                    placeholder="Search coordinates or sectors..." 
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold focus:border-primary/50 outline-none transition-all"
                 />
              </div>
              <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                 <Filter size={18} />
              </button>
           </div>
           
           <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
              <button className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest transition-all">SATELLITE</button>
              <button className="px-4 py-2 rounded-xl hover:bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest transition-all">TERRAIN</button>
              <button className="px-4 py-2 rounded-xl hover:bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                 <Layers size={12} /> LAYERS
              </button>
           </div>
        </div>

        {/* Map Simulation */}
        <div className="relative aspect-[21/9] rounded-[2rem] bg-[#020617] overflow-hidden border border-white/5 shadow-inner group">
          
          {/* Actual Geographic Map Background */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
            <iframe 
              width="120%" 
              height="120%" 
              frameBorder="0" 
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.015,40.700,-73.990,40.715&layer=mapnik" 
              style={{ 
                position: 'absolute', 
                top: '-10%', 
                left: '-10%', 
                filter: 'invert(100%) grayscale(100%) contrast(150%) brightness(70%)' 
              }}
            ></iframe>
            {/* Color tint for tactical mode */}
            <div className="absolute inset-0 bg-primary/30 mix-blend-color"></div>
            {/* Edge fading gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]"></div>
          </div>

          {/* Radar Sweep Animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] pointer-events-none opacity-20 z-10">
             <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-[spin_10s_linear_infinite]" style={{ clipPath: 'conic-gradient(from 0deg at 50% 50%, #00A8E8, transparent 90deg)' }}></div>
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-10" style={{ backgroundImage: 'linear-gradient(#00A8E8 1px, transparent 1px), linear-gradient(90deg, #00A8E8 1px, transparent 1px)', backgroundSize: '4% 8%' }}></div>

          {/* Road-like lines */}
          <div className="absolute top-[40%] left-0 right-0 h-px bg-white/10" />
          <div className="absolute left-[45%] top-0 bottom-0 w-px bg-white/10" />

          {/* Heatmap zones */}
          <div className="absolute w-48 h-48 rounded-full bg-rose-500/10 blur-[60px] animate-pulse" style={{ left: "20%", top: "60%" }} />
          <div className="absolute w-40 h-40 rounded-full bg-rose-500/10 blur-[50px] animate-pulse" style={{ left: "65%", top: "65%" }} />

          {/* Markers */}
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
                  <div className={`w-10 h-10 rounded-2xl glass-strong border ${cfg.border} ${cfg.bg} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl relative z-20`}>
                    <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-none translate-y-2 group-hover/marker:translate-y-0 shadow-2xl">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${cfg.color.replace('text-', 'bg-')}`}></div>
                       {m.label}
                    </div>
                    {/* Small arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-white/10 rotate-45"></div>
                  </div>

                  {/* Pulsing effect */}
                  {m.type === "hotspot" && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-rose-500/50"
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                  {m.type === "police" && (
                    <div className="absolute inset-0 rounded-2xl border border-cyan-500/30 animate-pulse"></div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Map info overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
             <div className="px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                LIVE FEED ACTIVE: DOWNTOWN CORE
             </div>
             <div className="px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-mono text-muted-foreground">
                COORD: 12.9716° N, 77.5946° E
             </div>
          </div>
          
          <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Navigation size={12} /> AUTONOMOUS RELAY ENGINE
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {[
            { icon: Shield, label: "POLICE COMMAND", color: "text-cyan-500", desc: "Active precinct units" },
            { icon: Siren, label: "EMERGENCY RESPONSE", color: "text-amber-500", desc: "Medical and fire support" },
            { icon: AlertTriangle, label: "CRITICAL ZONES", color: "text-rose-500", desc: "High probability areas" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 ${l.color} group-hover:scale-110 transition-transform`}>
                <l.icon size={24} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest mb-0.5">{l.label}</div>
                <div className="text-[10px] text-muted-foreground font-medium">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </TiltCard>
    </div>
  </section>
);

export default SafetyMapSection;

