import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Shield, MapPin, Search, AlertTriangle, FileText, Activity, X, EyeOff, CheckCircle, Info, Fingerprint } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardPreview from "../components/DashboardPreview";
import AIScannerSection from "../components/AIScannerSection";
import SafetyMapSection from "../components/SafetyMapSection";
import { getFIRs, getSOSAlerts, getEvidence, getTips, updateTipStatus, updateFIRStatus } from "../lib/api";
import { toast } from "sonner";
import BackgroundAmbience from "../components/BackgroundAmbience";

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedFIR, setSelectedFIR] = useState<any>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  
  const [firs, setFirs] = useState<any[]>([]);
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [prevSosCount, setPrevSosCount] = useState(0);

  const fetchData = async () => {
    try {
      const [firRes, sosRes, evidenceRes, tipRes] = await Promise.all([
        getFIRs(),
        getSOSAlerts(),
        getEvidence(),
        getTips()
      ]);
      setFirs(firRes);
      setSosAlerts(sosRes);
      setEvidence(evidenceRes);
      setTips(tipRes);

      // Notification for new SOS
      if (sosRes.length > prevSosCount) {
        const latest = sosRes[sosRes.length - 1];
        const isSilent = latest.alert_type === 'silent_distress' || latest.alert_type === 'silent_sos';
        const isGesture = latest.trigger_source?.includes('gesture') || latest.trigger_source?.includes('device_tap');

        toast.error(isSilent ? (isGesture ? "🚨 GESTURE SOS DETECTED" : "🚨 SILENT DISTRESS TRIGGERED") : "🚨 CRITICAL SOS ALERT", {
          description: isSilent 
            ? (isGesture 
                ? `Hidden gesture trigger from ${latest.user} via ${latest.trigger_source}. Extreme caution at ${latest.location}.`
                : `Silent signal detected from ${latest.user} via Dead-Man Switch. High suspicion at ${latest.location}.`)
            : `Emergency reported at ${latest.location}. Dispatch units immediately!`,
          duration: 10000,
        });
        setPrevSosCount(sosRes.length);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => {
    // Check if user is officer
    const userType = localStorage.getItem("user_type");
    if (userType !== "officer") {
      toast.error("Unauthorized access. Redirecting to Citizen Portal.");
      navigate("/");
    } else {
      setLoading(false);
      fetchData();
      const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [navigate, prevSosCount]);

  const handleLogout = () => {
    localStorage.removeItem("gn_auth");
    localStorage.removeItem("user_type");
    toast.success("Officer Logged Out Successfully");
    navigate("/login");
  };

  const handleUpdateTipStatus = async (id: string, status: string) => {
    try {
      await updateTipStatus(id, status);
      toast.success(`Tip ${id} marked as ${status}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdateFIRStatus = async (id: string, status: string) => {
    try {
      await updateFIRStatus(id, status);
      toast.success(`FIR ${id} updated to ${status}`);
      setSelectedFIR(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update FIR status");
    }
  };

  if (loading) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-black tracking-widest uppercase italic">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative selection:bg-primary/30 pb-20">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-cyan-400 z-50"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Top Navbar for Police */}
      <nav className="border-b border-primary/10 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight uppercase italic text-foreground">Police <span className="text-primary">Headquarters</span></h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Officer Terminal Active</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </nav>
      
      <BackgroundAmbience />

      {/* Main Dashboard Elements */}
      <main className="container mx-auto px-4 py-10 space-y-16 relative z-10 font-neural">
        
        {/* Real-time Stats & Feed Header */}
        <div className="relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-blue-600/5 blur-[100px] -z-10 pointer-events-none"></div>
           <DashboardPreview />
        </div>

        {/* AI Bio-Scanner Terminal */}
        <div className="rounded-[2.5rem] overflow-hidden border border-primary/10 shadow-2xl relative bg-white/50 p-8">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Search size={150} />
           </div>
           <AIScannerSection />
        </div>

        {/* Live FIRs & SOS Action Grids */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          
          {/* FIR List Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-primary/10 relative overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <FileText size={100} />
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 text-cyan-600 rounded-xl">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-[#0F172A]">Logged <span className="text-cyan-600">FIRs</span></h3>
              </div>
              <span className="text-xs font-bold text-muted-foreground bg-secondary/20 py-1 px-3 rounded-full border border-primary/10">{firs.length} ACTIVE</span>
            </div>

            <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {firs.length === 0 ? (
                <div className="text-center py-10 opacity-30 font-black uppercase tracking-widest text-xs text-muted-foreground">No FIRs logged in grid</div>
              ) : (
                firs.map((fir) => (
                  <div key={fir.id} className="p-5 rounded-2xl bg-secondary/10 border border-primary/5 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group/item flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs font-black text-muted-foreground">{fir.id}</span>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${fir.status === 'Active' ? 'bg-rose-500/10 text-rose-500' : fir.status === 'Investigating' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           {fir.status}
                         </span>
                       </div>
                       <div className="font-bold text-sm tracking-wide mb-1 flex items-center gap-2 text-foreground">
                         {fir.type}
                       </div>
                       <div className="text-xs text-muted-foreground flex items-center gap-2">
                         <MapPin size={12} className="text-cyan-600" /> {fir.location}
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-xs text-muted-foreground/60 mb-2">{new Date(fir.created_at).toLocaleTimeString()}</div>
                       <button 
                         onClick={() => setSelectedFIR(fir)}
                         className="text-[10px] text-cyan-600 font-bold uppercase hover:underline opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1 justify-end"
                       >
                         <Search size={12} /> View Details
                       </button>
                     </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* SOS Women Safety Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-primary/10 relative overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <AlertTriangle size={100} className="text-rose-500" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl relative">
                  <div className="absolute inset-0 border border-rose-500/50 rounded-xl animate-ping text-rose-500 opacity-20"></div>
                  <AlertTriangle size={20} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-[#0F172A]">Nearby <span className="text-rose-500">SOS Alerts</span></h3>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-500/10 py-1 px-3 rounded-full border border-rose-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div>
                {sosAlerts.length} ACTIVE
              </span>
            </div>

            <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {sosAlerts.length === 0 ? (
                <div className="text-center py-10 opacity-30 font-black uppercase tracking-widest text-xs text-muted-foreground">No active SOS alerts</div>
              ) : (
                sosAlerts.map((sos) => (
                  <div key={sos.id} className="p-5 rounded-2xl bg-gradient-to-r from-rose-50/50 to-transparent border border-rose-100 hover:border-rose-300 transition-all cursor-pointer group/item flex items-center justify-between">
                     <div>
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs font-black text-rose-500">{sos.id}</span>
                         {sos.alert_type === 'silent_distress' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider bg-amber-100 text-amber-700 flex items-center gap-1 border border-amber-200">
                               <AlertTriangle size={10} /> Silent Distress
                            </span>
                         )}
                         {sos.alert_type === 'silent_sos' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider bg-purple-100 text-purple-700 flex items-center gap-1 border border-purple-200">
                               <Fingerprint size={10} /> Hidden Gesture
                            </span>
                         )}
                         {!sos.alert_type?.startsWith('silent') && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                              Immediate Action Required
                            </span>
                         )}
                      </div>
                       <div className="font-bold text-sm tracking-wide mb-1 flex items-center gap-2 text-foreground">
                         Victim: {sos.user}
                       </div>
                       <div className="flex flex-col gap-1 mt-2">
                         <div className="text-xs text-muted-foreground flex items-center gap-2">
                           <MapPin size={12} className="text-rose-500" /> Location: {sos.location}
                         </div>
                         {sos.trigger_source === 'dead_man_switch' && (
                            <div className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1 flex flex-col gap-1">
                               <div>Source: Dead-Man Switch (Neural Grid)</div>
                               <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 italic text-muted-foreground">
                                 " {sos.last_response} "
                               </div>
                            </div>
                         )}
                       </div>
                     </div>
                     <div className="flex flex-col items-end gap-3 text-right">
                       <div className="text-[10px] font-black tracking-widest text-rose-500/80">{new Date(sos.created_at).toLocaleTimeString()}</div>
                       <button 
                         onClick={() => toast.success(`Alert: Unit dispatched to ${sos.location}. Target ETA: 3 minutes.`)}
                         className="bg-[#FF4A6B] hover:bg-[#ff3055] text-white font-black uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-full shadow-lg shadow-rose-200 transition-all active:scale-95"
                       >
                         Dispatch Unit
                       </button>
                     </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Anonymous Evidence Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-primary/10 relative overflow-hidden group mt-12 shadow-xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <Shield size={100} className="text-emerald-500" />
          </div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <Shield size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-[#0F172A]">Verified <span className="text-emerald-500">Evidence</span></h3>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-secondary/20 py-1 px-3 rounded-full border border-primary/10">{evidence.length} COLLECTED</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {evidence.length === 0 ? (
               <div className="col-span-full text-center py-10 opacity-30 font-black uppercase tracking-widest text-xs text-muted-foreground">No digital evidence collected</div>
            ) : (
              evidence.map((ev) => (
                <div key={ev.id} className="p-6 rounded-2xl bg-secondary/10 border border-primary/5 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group/ev" onClick={() => setSelectedEvidence(ev)}>
                   <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-emerald-100 text-emerald-600`}>
                        {ev.type === 'photo' ? <Activity size={16} /> : <FileText size={16} />}
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <div className="font-bold text-sm mb-1 uppercase tracking-tight text-foreground">{ev.activityType} Activity</div>
                   <div className="text-[10px] text-muted-foreground flex items-center gap-2 mb-4">
                     <MapPin size={10} /> {ev.location}
                   </div>
                   <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest group-hover/ev:underline cursor-pointer">View Encrypted Asset →</div>
                </div>
              ))
            )}
          </div>
        </motion.div>
        {/* Anonymous Tips Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-primary/10 relative overflow-hidden group mt-12 shadow-xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <EyeOff size={100} className="text-amber-500" />
          </div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                <EyeOff size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-amber-700">Neural Grid <span className="text-foreground">Anonymous Tips</span></h3>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-secondary/20 py-1 px-3 rounded-full border border-primary/10">{tips.length} PENDING REVIEW</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {tips.length === 0 ? (
               <div className="col-span-full text-center py-10 opacity-30 font-black uppercase tracking-widest text-xs text-muted-foreground">No incoming tips from citizen grid</div>
            ) : (
                tips.map((tip) => (
                <div key={tip.id} className={`p-6 rounded-2xl bg-secondary/10 border border-primary/5 hover:bg-white hover:shadow-md hover:border-primary/20 transition-all border-l-4 ${tip.status === 'Verified' ? 'border-l-emerald-500' : tip.status === 'Investigating' ? 'border-l-amber-500' : 'border-l-primary/20'}`}>
                   <div className="flex items-center justify-between mb-4">
                      <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{tip.id}</div>
                      <span className="text-[10px] font-black text-muted-foreground/40">{new Date(tip.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <div className="font-bold text-sm mb-1 uppercase tracking-tight text-foreground">{tip.category}</div>
                   <div className="text-[10px] text-muted-foreground flex items-center gap-2 mb-4">
                     <MapPin size={10} /> {tip.location}
                   </div>
                   <p className="text-[11px] text-muted-foreground italic line-clamp-2 mb-6">"{tip.description}"</p>
                   
                   <div className="flex items-center gap-2 pt-4 border-t border-primary/5">
                        <button 
                            onClick={() => handleUpdateTipStatus(tip.id, "Verified")}
                            className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-tighter hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-1 border border-emerald-100"
                        >
                            <CheckCircle size={10} /> Verified
                        </button>
                        <button 
                             onClick={() => handleUpdateTipStatus(tip.id, "Investigating")}
                            className="flex-1 py-2 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-tighter hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-1 border border-amber-100"
                        >
                            <Search size={10} /> Inspecting
                        </button>
                   </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>

      {/* Evidence Details Modal */}
      <AnimatePresence>
        {selectedEvidence && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-emerald-500/20 rounded-3xl p-8 max-w-xl w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedEvidence(null)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-foreground">Evidence Asset</h3>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">ID: {selectedEvidence.id}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="aspect-video bg-secondary/20 rounded-2xl flex items-center justify-center border border-primary/5 overflow-hidden">
                   <div className="text-center">
                     <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mx-auto mb-4"></div>
                     <p className="text-[10px] text-emerald-600 font-black tracking-widest uppercase italic">Decrypting AES-256 Protocol...</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/10 p-4 rounded-2xl border border-primary/5">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Type</p>
                    <p className="text-sm font-bold text-foreground uppercase">{selectedEvidence.type}</p>
                  </div>
                   <div className="bg-secondary/10 p-4 rounded-2xl border border-primary/5">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Activity</p>
                    <p className="text-sm font-bold text-emerald-600 uppercase">{selectedEvidence.activityType}</p>
                  </div>
                </div>

                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Location Data</p>
                   <p className="text-foreground text-sm font-medium">{selectedEvidence.location}</p>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-emerald-100 text-xs">
                  Download Encrypted Package
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIR Details Modal */}
      <AnimatePresence>
        {selectedFIR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-cyan-500/20 rounded-3xl p-8 max-w-xl w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedFIR(null)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500/10 text-cyan-600 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-widest text-foreground">{selectedFIR.id}</h3>
                  <p className="text-xs text-cyan-600 font-bold uppercase tracking-widest">{selectedFIR.type}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/10 p-4 rounded-2xl border border-primary/5">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Status</p>
                    <p className={`text-sm font-bold ${selectedFIR.status === 'Active' ? 'text-rose-500' : selectedFIR.status === 'Investigating' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {selectedFIR.status}
                    </p>
                  </div>
                  <div className="bg-secondary/10 p-4 rounded-2xl border border-primary/5">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Time Reported</p>
                    <p className="text-sm font-bold text-foreground">{new Date(selectedFIR.created_at).toLocaleString()}</p>
                  </div>
                  <div className="bg-secondary/10 p-4 rounded-2xl border border-primary/5 col-span-2">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                       <MapPin size={12} className="text-cyan-600" /> Location
                    </p>
                    <p className="text-sm font-bold text-foreground">{selectedFIR.location}</p>
                  </div>
                </div>

                <div className="bg-cyan-50 p-5 rounded-2xl border border-cyan-100 border-l-4 border-l-cyan-600">
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Reporter Information</p>
                   <p className="text-foreground text-sm font-medium">{selectedFIR.reporter}</p>
                </div>

                <div className="space-y-2">
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Incident Description</p>
                   <p className="text-foreground/80 text-sm leading-relaxed">{selectedFIR.description}</p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => handleUpdateFIRStatus(selectedFIR.id, "Investigating")}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-xl shadow-cyan-100 text-xs text-center border-none"
                  >
                    Assign Officer
                  </button>
                  <button 
                    onClick={() => handleUpdateFIRStatus(selectedFIR.id, "Resolved")}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-xl shadow-emerald-100 text-xs text-center border-none"
                  >
                    Resolve Case
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
