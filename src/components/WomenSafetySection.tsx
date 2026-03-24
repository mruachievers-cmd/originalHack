import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, MapPin, Mic, Video, Phone, Users, Zap, Heart, Activity } from "lucide-react";
import { TiltCard } from "./TiltCard";

const features = [
  { icon: MapPin, title: "Precision GPS", desc: "Live location propagation across 12 nodes" },
  { icon: Mic, title: "Acoustic Trigger", desc: 'Neural voice recognition for instant activation' },
  { icon: Video, title: "Ghost Record", desc: "Stealth cloud synchronization of evidence" },
  { icon: Phone, title: "Rapid Response", desc: "E-dispatch to the 3 nearest police units" },
  { icon: Users, title: "Sentinel Network", desc: "Emergency broadcast to verified circles" },
];

const WomenSafetySection = () => {
  const [sosActive, setSosActive] = useState(false);

  const handleSosToggle = async () => {
    const newState = !sosActive;
    setSosActive(newState);
    
    if (newState) {
      try {
        // Trigger n8n webhook (using GET to match your current n8n node configuration)
        const params = new URLSearchParams({
          event: "SOS_ACTIVATED",
          timestamp: new Date().toISOString(),
          source: "WomenSafetyModule"
        }).toString();

        await fetch(`https://uninstructed-sharan-uncorpulent.ngrok-free.dev/webhook-test/e036c541-c252-4eda-af88-6eeca706a184?${params}`, { 
          method: 'GET',
          headers: { 
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log('SOS webhook triggered successfully');
      } catch (error) {
        console.error('Failed to trigger SOS webhook:', error);
      }
    }
  };

  return (
    <section id="safety" className="section-padding relative overflow-hidden">
      {/* Background intensity glow */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-rose-600/10 pointer-events-none -z-10"
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Heart size={12} className={sosActive ? "animate-pulse" : ""} />
            GUARDIAN PROTOCOL
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Advanced <span className="text-gradient-danger font-black italic">Personal Safety</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A military-grade response system designed to provide instant protection and situational awareness during critical moments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* SOS Primary Interface */}
          <TiltCard className="flex flex-col items-center justify-center relative">
            <div className="relative group">
              {/* Outer Decorative Rings */}
              <div className="absolute inset-0 -m-8 rounded-full border border-rose-500/10 animate-spin-slow"></div>
              <div className="absolute inset-0 -m-16 rounded-full border border-rose-500/5 animate-reverse-spin"></div>
              
              <button
                onClick={handleSosToggle}
                className={`relative w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${
                  sosActive ? "bg-rose-600 scale-95" : "bg-rose-500/90 hover:bg-rose-600 group-hover:scale-105"
                }`}
              >
                {/* Layered Ripples */}
                {sosActive ? (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-4 border-rose-500"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1 + (i * 0.5), opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                      />
                    ))}
                  </>
                ) : (
                  <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-20"></div>
                )}
                
                <div className="relative z-10 flex flex-col items-center">
                  <ShieldAlert className={`w-16 h-16 md:w-20 md:h-20 mb-2 text-white ${sosActive ? "animate-[bounce_0.5s_infinite]" : ""}`} />
                  <span className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">SOS</span>
                  <div className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mt-1">TAP TO ACTIVATE</div>
                </div>
              </button>
            </div>

            <div className="mt-12 text-center">
               <div className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${sosActive ? "text-rose-500" : "text-muted-foreground opacity-50"}`}>
                  <div className={`w-2 h-2 rounded-full ${sosActive ? "bg-rose-500 animate-pulse" : "bg-white/10"}`}></div>
                  {sosActive ? "EMERGENCY BEACON BROADCASTING" : "STANDBY MODE ACTIVE"}
               </div>
               <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto opacity-60">
                 All telemetry data is being routed through secure government servers in real-time.
               </p>
            </div>
            
            <AnimatePresence>
              {sosActive && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-10 card-premium p-6 w-full max-w-sm border-rose-500/30 bg-rose-500/5 shadow-2xl shadow-rose-500/20"
                >
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <Activity size={18} className="text-rose-500 animate-pulse" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-rose-500">Protocol Active</h4>
                     </div>
                     <span className="text-[10px] font-black text-white/40">ID: GN-24-X</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { l: "GPS Broadcast", s: "Success" },
                      { l: "Police Dispatch", s: "Initiated" },
                      { l: "Circles Notified", s: "9 Total" },
                      { l: "Neural Record", s: "Syncing" },
                    ].map((st, i) => (
                      <div key={i} className="flex justify-between items-center text-xs font-bold border-b border-white/5 pb-2">
                         <span className="text-white/60">{st.l}</span>
                         <span className="text-rose-500 flex items-center gap-1">
                           <Zap size={10} fill="currentColor" /> {st.s}
                         </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>

          {/* Sentinel Features Board */}
          <TiltCard className="grid gap-6">
            <h3 className="text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-3">
              <ShieldAlert size={20} className="text-rose-500" /> SENTINEL CAPABILITIES
            </h3>
            
            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-premium p-6 flex items-start gap-6 group hover:border-rose-500/20 transition-all cursor-default"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center shrink-0 group-hover:bg-rose-500/10 group-hover:scale-110 transition-all duration-300">
                    <f.icon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-widest mb-1 group-hover:text-rose-500 transition-colors">{f.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    {/* Progress indicator mini */}
                    <div className="mt-3 h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-rose-500 w-1/3 group-hover:w-full transition-all duration-700"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Quick action info */}
            <div className="mt-4 p-6 rounded-3xl bg-secondary/50 border border-white/5 flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/30 group-hover:border-rose-500/50 group-hover:text-rose-500 transition-all animate-spin-slow">
                 <ShieldAlert size={20} />
               </div>
               <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                 Press the volume buttons for 3 seconds to activate silent emergency mode without unlocking your phone.
               </p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

export default WomenSafetySection;
