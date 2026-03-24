import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Shield, MapPin, Search, AlertTriangle, FileText, Activity, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardPreview from "../components/DashboardPreview";
import { toast } from "sonner";

const mockFIRs = [
  { id: "FIR-2026-001", type: "Theft", location: "Downtown Central", status: "Active", time: "10 mins ago", reporter: "Rajesh Kumar", description: "Reporting a stolen vehicle (Black Honda City MH-01-AB-1234) parked outside the Central Mall. Suspects were seen fleeing towards the highway." },
  { id: "FIR-2026-002", type: "Assault", location: "Sector 4 Market", status: "Investigating", time: "1 hr ago", reporter: "Anonymous", description: "Physical altercation between two shop owners over territorial dispute. Both sustained minor injuries. Crowd gathered, requesting backup." },
  { id: "FIR-2026-003", type: "Vandalism", location: "North Station", status: "Resolved", time: "3 hrs ago", reporter: "Station Manager", description: "Graffiti painted on the northbound train. Perpetrators were caught on CCTV and identified. Authorities have been notified for cleanup." },
];

const mockSOS = [
  { id: "SOS-091", user: "Priya M.", location: "Park Avenue, Lane 3", distance: "0.8 km", time: "2 mins ago" },
  { id: "SOS-092", user: "Neha S.", location: "Metro Station Exit B", distance: "1.2 km", time: "15 mins ago" },
];

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedFIR, setSelectedFIR] = useState<any>(null);

  useEffect(() => {
    // Check if user is officer
    const userType = localStorage.getItem("user_type");
    if (userType !== "officer") {
      toast.error("Unauthorized access. Redirecting to Citizen Portal.");
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("gn_auth");
    localStorage.removeItem("user_type");
    toast.success("Officer Logged Out Successfully");
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative selection:bg-primary/30">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-cyan-400 z-50"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Top Navbar for Police */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Shield className="text-primary w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight uppercase italic">Guardian <span className="text-primary">Command</span></h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Officer Terminal Active</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </nav>

      {/* Main Dashboard Elements */}
      <main className="container mx-auto px-4 py-10 space-y-16 relative z-10">
        
        {/* The beautiful Dashboard Preview section matching the requested image */}
        <div className="relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-blue-600/5 blur-[100px] -z-10 pointer-events-none"></div>
           <DashboardPreview />
        </div>

        {/* Live FIRs & SOS Action Grids */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          
          {/* FIR List Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-3xl p-8 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <FileText size={100} />
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/20 text-cyan-500 rounded-xl">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest">Logged <span className="text-cyan-400">FIRs</span></h3>
              </div>
              <span className="text-xs font-bold text-muted-foreground bg-white/5 py-1 px-3 rounded-full border border-white/10">3 ACTIVE</span>
            </div>

            <div className="space-y-4 relative z-10">
              {mockFIRs.map((fir, i) => (
                <div key={fir.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/item flex items-center justify-between">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-black text-white/50">{fir.id}</span>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${fir.status === 'Active' ? 'bg-rose-500/20 text-rose-400' : fir.status === 'Investigating' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                         {fir.status}
                       </span>
                     </div>
                     <div className="font-bold text-sm tracking-wide mb-1 flex items-center gap-2">
                       {fir.type}
                     </div>
                     <div className="text-xs text-muted-foreground flex items-center gap-2">
                       <MapPin size={12} className="text-cyan-400" /> {fir.location}
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="text-xs text-white/40 mb-2">{fir.time}</div>
                     <button 
                       onClick={() => setSelectedFIR(fir)}
                       className="text-[10px] text-cyan-400 font-bold uppercase hover:underline opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1 justify-end"
                     >
                       <Search size={12} /> View Details
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SOS Women Safety Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-3xl p-8 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <AlertTriangle size={100} className="text-rose-500" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl relative">
                  <div className="absolute inset-0 border border-rose-500/50 rounded-xl animate-ping"></div>
                  <AlertTriangle size={20} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest">Nearby <span className="text-rose-400">SOS Alerts</span></h3>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold text-rose-400 bg-rose-500/10 py-1 px-3 rounded-full border border-rose-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div>
                2 CRITICAL
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              {mockSOS.map((sos) => (
                <div key={sos.id} className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer group/item flex items-center justify-between">
                   <div>
                     <div className="flex items-center gap-2 mb-2">
                       <span className="text-xs font-black text-rose-400">{sos.id}</span>
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                         Immediate Action Required
                       </span>
                     </div>
                     <div className="font-bold text-sm tracking-wide mb-1 flex items-center gap-2 text-white">
                       Victim: {sos.user}
                     </div>
                     <div className="flex flex-col gap-1 mt-2">
                       <div className="text-xs text-rose-200/70 flex items-center gap-2">
                         <MapPin size={12} className="text-rose-400" /> Location: {sos.location}
                       </div>
                       <div className="text-xs text-rose-200/70 flex items-center gap-2">
                          <Activity size={12} className="text-rose-400" /> Distance: {sos.distance} (ETA ~ 3 mins)
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-col items-end gap-3 text-right">
                     <div className="text-[10px] font-black tracking-widest text-rose-400/80">{sos.time}</div>
                     <button 
                       onClick={() => toast.success(`Alert: Unit dispatched to ${sos.location}. Target ETA: 3 minutes.`)}
                       className="bg-[#FF4A6B] hover:bg-[#ff3055] text-white font-black uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-full border-2 border-white/80 shadow-[0_0_15px_rgba(255,74,107,0.4)] transition-all active:scale-95"
                     >
                       Dispatch Unit
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>

      {/* FIR Details Modal */}
      <AnimatePresence>
        {selectedFIR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f172a] border border-cyan-500/30 rounded-3xl p-8 max-w-xl w-full relative shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              <button 
                onClick={() => setSelectedFIR(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500/20 text-cyan-500 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-white">{selectedFIR.id}</h3>
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{selectedFIR.type}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Status</p>
                    <p className={`text-sm font-bold ${selectedFIR.status === 'Active' ? 'text-rose-400' : selectedFIR.status === 'Investigating' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {selectedFIR.status}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Time Reported</p>
                    <p className="text-sm font-bold text-white">{selectedFIR.time}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 col-span-2">
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                       <MapPin size={12} className="text-cyan-400" /> Location
                    </p>
                    <p className="text-sm font-bold text-white">{selectedFIR.location}</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20 border-l-4 border-l-cyan-400">
                   <p className="text-[10px] text-white/50 font-black uppercase tracking-widest mb-2">Reporter Information</p>
                   <p className="text-white text-sm font-medium">{selectedFIR.reporter}</p>
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Incident Description</p>
                   <p className="text-white/80 text-sm leading-relaxed">{selectedFIR.description}</p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] text-xs">
                    Assign Officer
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all border border-white/10 text-xs text-center inline-block">
                    Update Status
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PoliceDashboard;
