import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Navigation, Clock, Activity, AlertTriangle, Siren, UserCheck, X } from "lucide-react";
import { toast } from "sonner";

const EscortMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasDeviated, setHasDeviated] = useState(false);
  const [status, setStatus] = useState<"connecting" | "tracking" | "alert">("connecting");

  // Path coordinates for SVG animation (normalized 0-100)
  const path = "M 10 10 L 40 10 L 40 40 L 70 40 L 70 80 L 90 80";
  const deviationPoint = 75; // Deviation occurs at 75% progress

  useEffect(() => {
    let interval: any;
    if (isActive && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          
          if (next >= deviationPoint && !hasDeviated) {
            setHasDeviated(true);
            setStatus("alert");
            toast.warning("Route Deviation Detected", {
              description: "User deviated 800m from expected path. Alerting police units.",
              duration: 4000
            });
          }

          if (next >= 100) {
            clearInterval(interval);
            setIsActive(false);
            setStatus("connecting");
            toast.success("Destination Reached Successfully", {
              description: "Virtual escort session closed. You are safe.",
            });
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, progress, hasDeviated]);

  const handleStart = () => {
    setIsActive(true);
    setProgress(0);
    setHasDeviated(false);
    setStatus("tracking");
    toast.info("Smart Escort Mode Activated", {
      description: "Police Command Center is now monitoring your live location.",
    });
  };

  return (
    <section className="section-padding relative bg-[#020617]" id="escort">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute bottom-0 left-0 w-full h-96 bg-primary/5 blur-[150px] -z-10"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Right Side: Map Demonstration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 w-full order-2 lg:order-1"
          >
            <div className="glass-strong rounded-[2.5rem] p-3 border border-white/10 relative overflow-hidden aspect-video lg:aspect-square max-w-2xl mx-auto shadow-2xl">
              {/* Futuristic Map Background */}
              <div className="absolute inset-0 bg-[#080d1e] opacity-40"></div>
              
              {/* SVG Grid Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
                <defs>
                   <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                   </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>

              {/* Route Path */}
              <svg className="absolute inset-0 w-full h-full p-12 overflow-visible" viewBox="0 -10 110 110">
                <path 
                  d={path} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                
                <motion.path 
                  d={path} 
                  fill="none" 
                  stroke={hasDeviated ? "rgba(244,63,94,0.4)" : "#0ea5e9"} 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.1 }}
                  className="shadow-lg"
                />

                {hasDeviated && (
                    <motion.path 
                        d="M 70 40 L 90 40 L 90 20"
                        fill="none"
                        stroke="#FF4A6B"
                        strokeWidth="5"
                        strokeDasharray="4 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        className="animate-pulse"
                    />
                )}

                <motion.circle 
                  cx={progress < 25 ? (10 + progress*1.2) : progress < 50 ? 40 : progress < 65 ? (40 + (progress-50)*2) : progress < 85 ? 70 : (70 + (progress-85)*1.33)} 
                  cy={progress < 25 ? 10 : progress < 50 ? (10 + (progress-25)*1.2) : progress < 65 ? 40 : progress < 85 ? (40 + (progress-65)*2) : 80}
                  r="3.5"
                  fill={hasDeviated ? "#FF4A6B" : "#0ea5e9"}
                  className="shadow-[0_0_15px_rgba(14,165,233,0.8)]"
                >
                   <animate attributeName="r" values="3.5;5.5;3.5" dur="1s" repeatCount="indefinite" />
                </motion.circle>

                <circle cx="10" cy="10" r="2" fill="white" />
                <circle cx="90" cy="80" r="3" fill="#0ea5e9" opacity="0.5" />
              </svg>

              <div className="absolute top-8 left-8 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Navigation className="text-primary w-4 h-4" />
                 </div>
                 <div className="text-[10px] font-black tracking-widest uppercase">
                    <span className="text-white/40 mb-0.5 block">Heading</span>
                    <span className="text-white">NE 42.1°</span>
                 </div>
              </div>

              <div className="absolute bottom-8 right-8 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-[180px]">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Signal Quality</span>
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic">Stable</span>
                 </div>
                 <div className="flex items-end gap-1 mb-2 h-4">
                    {[3, 5, 8, 4, 10, 6, 9].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/10 rounded-full h-full overflow-hidden">
                           <motion.div initial={{ height: 0 }} animate={{ height: `${h * 10}%` }} className="bg-primary w-full h-full" />
                        </div>
                    ))}
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold">
                    <UserCheck className="text-primary w-3 h-3" />
                    Police Linked
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Left Side: Text and Controls */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-widest mb-4">
                <Navigation size={12} />
                LIVE ESCORT TECH
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase italic">
                Smart Escort <span className="text-gradient">Companion</span>
              </h2>
              <p className="text-muted-foreground text-lg italic leading-relaxed">
                A digital police guardian for late-night travels. Our system monitors your route in real-time and alerts high-patrol units the moment you deviate or stop unexpectedly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                  { icon: MapPin, label: "Live Tracking", value: isActive ? "ON" : "STANDBY", color: isActive ? "text-emerald-400" : "text-white/20" },
                  { icon: Siren, label: "Dispatch Unit", value: "LINKED", color: "text-primary" },
                  { icon: Clock, label: "ETA Tracking", value: progress < 100 && isActive ? `${10 - Math.floor(progress/10)} Min` : "--", color: "text-white" },
                  { icon: Activity, label: "Path Safety", value: hasDeviated ? "CRITICAL" : (isActive ? "SECURE" : "--"), color: hasDeviated ? "text-rose-500" : "text-emerald-400" },
              ].map((s, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-5 rounded-3xl hover:bg-white/[0.08] transition-all">
                     <s.icon size={18} className="text-primary/70 mb-3" />
                     <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">{s.label}</div>
                     <div className={`text-sm font-black tracking-widest ${s.color}`}>{s.value}</div>
                  </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {!isActive ? (
                <button 
                  onClick={handleStart}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.25em] h-16 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 italic active:scale-95 group"
                >
                  <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Initiate Escort Mode
                </button>
              ) : (
                <div className="flex gap-4">
                   <button 
                     onClick={() => { setIsActive(false); setProgress(0); setHasDeviated(false); }}
                     className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl border border-white/10"
                   >
                     Terminate Mode
                   </button>
                   <button className="flex-1 bg-[#FF4A6B] text-white font-black uppercase tracking-widest rounded-2xl py-4 flex items-center justify-center gap-2 group">
                      <Siren size={20} className="animate-bounce" />
                      Instant SOS
                   </button>
                </div>
              )}
            </div>

            <AnimatePresence>
              {hasDeviated && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-6 rounded-[2rem] bg-rose-500/10 border-2 border-rose-500/50 flex items-start gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                  <div className="p-3 rounded-2xl bg-rose-500 text-white">
                     <AlertTriangle size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h5 className="font-black text-rose-500 text-sm uppercase tracking-widest mb-1">UNUSUAL DEVIATION DETECTED</h5>
                    <p className="text-xs text-rose-200/60 leading-relaxed font-bold">You are 820m away from the primary route. Police dispatch units in Sector 4 have been notified for immediate surveillance.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EscortMode;
