import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Upload, Camera, Video, Mic, CheckCircle2, AlertCircle, Clock, Users, Share2 } from "lucide-react";
import { toast } from "sonner";
import { submitEvidence } from "../lib/api";

interface EvidenceItem {
  id: string;
  type: "photo" | "video" | "audio" | "report";
  user: string;
  time: string;
  status: "uploading" | "verified";
  preview: string;
}

const EvidenceCollection = () => {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isSusconfirmed, setIsSusconfirmed] = useState(false);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const simulateAlert = () => {
    setIsAlertActive(true);
    toast.info("Nearby Incident Detected: Secure Witness Request Sent", {
      description: "Guardian Net is requesting anonymous witness assistance in your vicinity.",
      duration: 5000,
    });
  };

  const handleUpload = async (type: EvidenceItem["type"]) => {
    if (!isAlertActive) {
      toast.error("No active incident requests nearby.");
      return;
    }

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    try {
        const newItem: EvidenceItem = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          user: "Anonymous Witness",
          time: "Just now",
          status: "verified",
          preview: type === "photo" ? "Image preview..." : type === "video" ? "Video snippet..." : "Audio wave...",
        };
        
        await submitEvidence({
            type,
            activityType: isSusconfirmed ? "Suspicious" : "Observer",
            location: "Sector 4",
            userId: "anonymous",
            evidenceUrl: "simulated_upload_url"
        });

        setEvidenceList([newItem, ...evidenceList]);
        setUploadProgress(null);
        toast.success(`${type.toUpperCase()} Evidence Uploaded Securely`, {
          description: "Your data is encrypted and your identity remains anonymous.",
        });
    } catch (err) {
        toast.error("Upload failed. Database connection error.");
        setUploadProgress(null);
    }
  };

  return (
    <section className="section-padding relative overflow-hidden" id="witness">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side: Control Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-2/5 space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <Users size={12} />
                Witness Network
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight italic uppercase">
                Digital <span className="text-gradient">Witness</span> Network
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Empowering the community to assist law enforcement anonymously. During an incident, nearby accounts receive secure requests to collect encrypted evidence.
              </p>
            </div>

            <div className="card-premium p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isAlertActive ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-white/50'}`}>
                    <AlertCircle className={isAlertActive ? 'animate-pulse' : ''} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">Simulate Incident</h4>
                    <p className="text-[10px] text-muted-foreground font-black uppercase">Test mode only</p>
                  </div>
                </div>
                <button 
                  onClick={simulateAlert}
                  disabled={isAlertActive}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    isAlertActive ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                  }`}
                >
                  Trigger Alert
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Contribute Evidence</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleUpload("photo")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/btn"
                  >
                    <Camera size={20} className="text-primary group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase">Photo</span>
                  </button>
                  <button 
                    onClick={() => handleUpload("video")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/btn"
                  >
                    <Video size={20} className="text-cyan-400 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase">Video</span>
                  </button>
                  <button 
                    onClick={() => handleUpload("audio")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/btn"
                  >
                    <Mic size={20} className="text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase">Audio</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FF4A6B]/5 border border-[#FF4A6B]/20">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="text-[#FF4A6B]" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Confirm Suspicious Activity</span>
                  </div>
                  <button 
                    onClick={() => {
                      if(!isAlertActive) { toast.error("No active incident requests branch."); return; }
                      setIsSusconfirmed(!isSusconfirmed);
                      if(!isSusconfirmed) toast.warning("Suspicious activity confirmed. Police notified.");
                    }}
                    className={`w-10 h-6 rounded-full transition-all relative ${isSusconfirmed ? 'bg-[#FF4A6B]' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isSusconfirmed ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 justify-center border-t border-white/5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                  <Lock size={10} />
                  Anonymous
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest">
                  <Shield size={10} />
                  AES-256 Encrypted
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Timeline & Preview */}
          <div className="lg:w-3/5 relative min-h-[500px]">
            <AnimatePresence>
              {isAlertActive ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      Incident Timeline Preview
                    </h4>
                    <span className="text-[10px] font-black bg-rose-500 text-white px-3 py-1 rounded-full animate-pulse">LIVE RECONSTRUCTION</span>
                  </div>

                  <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary before:to-transparent">
                    {/* Fixed Start Point */}
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 w-[22px] h-[22px] rounded-full bg-[#020617] border-4 border-primary shadow-[0_0_10px_rgba(0,168,232,0.5)] z-10"></div>
                      <div className="card-premium p-4 md:p-6 opacity-60">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-primary uppercase">Trigger Point</span>
                            <span className="text-[10px] text-muted-foreground mr-1">T-Minus 2m</span>
                         </div>
                         <p className="text-xs font-bold">Automatic SOS Trigger detected from Women Safety Module.</p>
                      </div>
                    </div>

                    {/* Dynamic Evidence Items */}
                    <AnimatePresence>
                      {evidenceList.map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative"
                        >
                          <div className="absolute -left-[30px] top-1 w-[22px] h-[22px] rounded-full bg-[#020617] border-4 border-white/50 z-10"></div>
                          <div className="card-premium p-4 md:p-6 hover:border-primary/50 transition-all group scale-105 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-primary/30">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                {item.type === "photo" && <Camera size={14} className="text-primary" />}
                                {item.type === "video" && <Video size={14} className="text-primary" />}
                                {item.type === "audio" && <Mic size={14} className="text-primary" />}
                                <span className="text-[10px] font-black uppercase text-primary">{item.type} SUBMITTED</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground">{item.time}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                              <div className="w-16 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-primary/20 transition-all">
                                {item.type === "photo" && <Camera size={16} />}
                                {item.type === "video" && <Video size={16} />}
                                {item.type === "audio" && <Mic size={16} />}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-black">{item.user}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight italic">Status: {item.status}</p>
                              </div>
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Progress indicator */}
                    {uploadProgress !== null && (
                      <div className="relative">
                        <div className="absolute -left-[30px] top-1 w-[22px] h-[22px] rounded-full bg-[#020617] border-4 border-cyan-400 animate-spin z-10"></div>
                        <div className="card-premium p-6 border-cyan-500/30">
                           <div className="flex justify-between mb-2">
                             <span className="text-[10px] font-black uppercase text-cyan-400">Uploading Encrypted Data...</span>
                             <span className="text-[10px] font-black text-cyan-400">{uploadProgress}%</span>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${uploadProgress}%` }}
                               className="h-full bg-cyan-400"
                             />
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem]"
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Share2 size={40} className="text-white/20" />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic text-white/40">Waiting for Incident Data...</h3>
                  <p className="text-muted-foreground max-w-sm">No active alerts detected in your sector. The reconstruction timeline will appear once a witness request is broadcast.</p>
                  <button 
                    onClick={simulateAlert}
                    className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white transition-all uppercase tracking-widest"
                  >
                    Click 'Trigger Alert' to demonstrate flow <Share2 size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EvidenceCollection;
