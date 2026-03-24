import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, AlertTriangle, User, FileWarning, Shield, Cpu, Zap, Search, Fingerprint } from "lucide-react";
import { TiltCard } from "./TiltCard";

const AIScannerSection = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setResult(false);
    setTimeout(() => {
      setScanning(false);
      setResult(true);
    }, 4000);
  };

  return (
    <section id="scanner" className="section-padding relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-widest mb-4">
            <Cpu size={12} className="animate-spin-slow" />
            NEURAL SCANNER ACTIVE
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            AI Criminal <span className="text-gradient">Identification</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Real-time biometric analysis and facial matching against local and international law enforcement databases.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Camera Frame */}
          <TiltCard className="group">
            <div className="card-premium p-4 relative">
            <div className="aspect-video rounded-3xl bg-black relative overflow-hidden border-4 border-white/5 flex items-center justify-center">
              {/* Camera Grid Overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
              
              {/* Corner brackets */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl" />

              {/* Scan line */}
              <AnimatePresence>
                {scanning && (
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(0,168,232,1)] z-20" 
                  />
                )}
              </AnimatePresence>

              {/* Data points overlay */}
              {scanning && (
                <div className="absolute inset-0">
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full"></motion.div>
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary rounded-full"></motion.div>
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-primary rounded-full"></motion.div>
                </div>
              )}

              {/* Face placeholder */}
              <div className="relative group">
                <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[3rem] border-2 border-dashed transition-all duration-500 flex items-center justify-center ${scanning ? 'border-primary/80 scale-105 shadow-[0_0_50px_rgba(0,168,232,0.3)]' : 'border-white/10 opacity-30'}`}>
                  <User className={`w-16 h-16 md:w-24 md:h-24 ${scanning ? 'text-primary' : 'text-white/30'}`} />
                  {scanning && (
                    <motion.div
                      className="absolute inset-0 rounded-[3rem] border-4 border-primary"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </div>
                
                {scanning && (
                  <div className="absolute -right-20 top-0 space-y-2 hidden md:block">
                    <div className="text-[10px] font-black text-primary uppercase animate-pulse">Tracking...</div>
                    <div className="text-[10px] font-black text-primary uppercase animate-pulse">Matching...</div>
                    <div className="text-[10px] font-black text-primary uppercase animate-pulse">Scanning...</div>
                  </div>
                )}
              </div>

              {/* Status bar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full glass border-white/10 flex items-center gap-4 min-w-[200px] justify-center">
                <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-primary' : 'bg-white/20'} animate-pulse`}></div>
                <span className="text-[10px] font-black tracking-widest uppercase">
                  {scanning ? "SYSTEM ANALYZING DATA..." : "SECURE FEED ACTIVE"}
                </span>
              </div>
            </div>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="mt-6 w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <ScanFace size={20} className={scanning ? 'animate-spin' : ''} />
              {scanning ? "IDENTIFYING..." : "SCAN INDIVIDUAL"}
            </button>
          </div>
          </TiltCard>

          {/* Results Reveal */}
          <TiltCard className="group">
            <AnimatePresence mode="wait">
              {!scanning && !result && (
                <motion.div 
                  key="idle"
                  className="card-premium p-12 text-center flex flex-col items-center justify-center border-dashed border-white/10"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6 group-hover:scale-110 transition-transform">
                    <Fingerprint size={40} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest mb-4">Awaiting Input</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                    Position the subject within the camera frame and initiate the scan for biometric identification.
                  </p>
                </motion.div>
              )}

              {scanning && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-premium p-12 text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-8">
                     <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-primary rounded-full shadow-[0_0_20px_rgba(0,168,232,0.3)]"
                     />
                     <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-2 border-b-2 border-cyan-500/50 rounded-full"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="text-primary animate-pulse" size={32} />
                     </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Biometric Analysis</h3>
                  <p className="text-muted-foreground text-sm font-mono uppercase tracking-[0.2em]">Neural matching in progress...</p>
                  
                  <div className="mt-8 grid grid-cols-4 gap-2 px-8">
                    {[0,1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.1, 1, 0.1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="h-1 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {result && !scanning && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-premium p-8 border-rose-500/30 bg-rose-500/5 shadow-2xl shadow-rose-500/10"
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 mb-8 animate-pulse-red">
                    <AlertTriangle className="text-rose-500" size={24} />
                    <div className="text-sm font-black text-rose-500 uppercase tracking-widest">WANTED INDIVIDUAL DETECTED</div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                           <User size={32} />
                         </div>
                         <div>
                           <div className="text-xs font-black text-muted-foreground uppercase opacity-60">IDENTIFIED SUBJECT</div>
                           <div className="text-2xl font-black italic tracking-tight">VICKRAM RAJIV</div>
                         </div>
                       </div>
                       <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-full bg-white/5 flex flex-col items-center border border-white/5"
                       >
                         <div className="text-[10px] font-black text-muted-foreground uppercase">MATCH</div>
                         <div className="text-lg font-black text-primary">98.4%</div>
                       </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2">STATUS</div>
                          <div className="text-xs font-bold text-rose-500 uppercase">HIGH RISK WANTED</div>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2">ACTIVE WARRANTS</div>
                          <div className="text-xs font-bold text-white uppercase">3 PENDING</div>
                       </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                       <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                         <FileWarning size={10} className="text-amber-500" /> RECENT CHARGES
                       </div>
                       <div className="text-xs font-bold text-white uppercase">DIGITAL THEFT, FINANCIAL CRIMES, AGGRAVATED ASSAULT</div>
                    </div>

                    <button className="w-full py-4 rounded-xl bg-rose-500 text-white font-black uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2">
                      <Zap size={16} fill="currentColor" /> ALERT NEAREST STATION
                    </button>
                    
                    <button 
                      onClick={() => setResult(false)}
                      className="w-full py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
                    >
                      CLEAR RECOGNITION DATA
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

export default AIScannerSection;

