import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Timer, MessageSquare, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { submitSOS } from "../lib/api";

const QUESTIONS = [
  "Pizza 🍕 or Burger 🍔 today?",
  "Random question: Which movie 🎬 do you like more?",
  "Quick poll: Tea ☕ or Coffee ☕?",
  "Do you prefer mountains 🏔 or beaches 🏖?",
  "Tell me your favorite color! 🎨",
  "Marvel or DC? 🦸‍♂️",
  "Dogs 🐕 or Cats 🐈?",
  "Ice cream 🍦 or Cake 🍰?"
];

const DeadManSwitch = () => {
  const [isActive, setIsActive] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [nextCheckIn, setNextCheckIn] = useState(120); // 2 minutes in seconds
  const [countdown, setCountdown] = useState(30); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMonitoring = () => {
    setIsActive(true);
    setNextCheckIn(120);
    toast.success("Guardian Safety Mode Activated", {
      description: "Tactical check-ins will trigger every 2 minutes.",
    });
    
    startNextCycle();
  };

  const startNextCycle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setNextCheckIn(120);
    
    // Progress countdown for UI
    progressIntervalRef.current = setInterval(() => {
        setNextCheckIn((prev) => {
            if (prev <= 1) {
                if(progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    timerRef.current = setTimeout(() => {
      triggerCheckIn();
    }, 120000); // 2 minutes
  };

  const stopMonitoring = () => {
    setIsActive(false);
    setShowCheckIn(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    toast.info("Dead-Man Switch Deactivated");
  };

  const triggerCheckIn = () => {
    const randomIdx = Math.floor(Math.random() * QUESTIONS.length);
    setCurrentQuestion(QUESTIONS[randomIdx]);
    setShowCheckIn(true);
    setResponse("");
    setCountdown(30); // 30 seconds to reply

    countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
                if(countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                handleDistressDetected("No response - timeout");
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) return;

    if(countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    if (response.trim().toUpperCase().startsWith('D')) {
        handleDistressDetected(`Keyword detected: ${response}`);
    } else {
        setShowCheckIn(false);
        toast.success("Identity Verified. Current Sector Safe.");
        startNextCycle();
    }
  };

  const handleDistressDetected = async (reason: string) => {
    setShowCheckIn(false);
    setIsActive(false);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    toast.warning("Neural Link Broken: Silent Distress Detected", {
      description: "Emergency units are being dispatched to your sector.",
    });

    try {
        await submitSOS({
          user: "Citizen Account",
          location: "Sector 4, Street 12",
          alert_type: "silent_distress",
          trigger_source: "dead_man_switch",
          last_response: response || reason,
          status: "Critical"
        });
    } catch (err) {
        toast.error("Bridge Error: Local beacon triggered.");
    }
  };

  return (
    <section className="py-20 relative overflow-hidden z-20">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-[3rem] border border-primary/40 relative group overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.15)] bg-gradient-to-br from-primary/5 to-transparent"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Shield size={160} className="text-primary animate-pulse" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(14,165,233,0.2)]">
                  <Shield size={14} />
                  Tactical Safety Unit 07
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  Neural Grid Online
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
                Guardian <span className="text-primary">Dead-Man</span> <br/> 
                <span className="text-white">Fun Check Mode</span>
              </h2>
              
              <p className="text-muted-foreground text-base lg:text-lg uppercase font-black tracking-[0.2em] leading-relaxed max-w-xl">
                 Our advanced silent monitoring system that checks on you via casual polls, keeping your status hidden from any physical threat.
              </p>

              {isActive && (
                <div className="space-y-3 pt-4 max-w-md">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>Neural Heartbeat Sync</span>
                      <span>{Math.floor(nextCheckIn / 60)}:{(nextCheckIn % 60).toString().padStart(2, '0')}</span>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: "100%" }}
                        animate={{ width: `${(nextCheckIn / 120) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                      />
                   </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <button 
                  onClick={() => isActive ? stopMonitoring() : startMonitoring()}
                  className={`relative w-28 h-14 rounded-full transition-all duration-700 shadow-2xl scale-110 ${
                    isActive ? 'bg-primary shadow-primary/30' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1.5 w-11 h-11 rounded-full bg-white transition-all duration-700 flex items-center justify-center shadow-lg ${
                    isActive ? 'left-15 right-1.5' : 'left-1.5'
                  }`}>
                    {isActive ? <Shield className="text-primary" size={24} /> : <X className="text-muted-foreground" size={24} />}
                  </div>
                </button>
                <div className="flex flex-col items-center">
                    <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isActive ? 'SYSTEM ENGAGED' : 'SYSTEM DISARMED'}
                    </span>
                    <span className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">
                        Manual Neural Override Available
                    </span>
                </div>
            </div>
          </div>
        </motion.div>

        {/* Check-In Modal */}
        <AnimatePresence>
          {showCheckIn && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-strong p-10 rounded-[3rem] border border-primary/30 max-w-lg w-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-white/50 to-primary"></div>
                
                <div className="space-y-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-5 bg-primary/20 text-primary rounded-3xl animate-pulse">
                      <MessageSquare size={32} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black italic uppercase italic">Neural Check-In</h3>
                    <div className="text-4xl font-black text-white">{currentQuestion}</div>
                  </div>

                  <div className="space-y-4">
                     <input 
                       type="text"
                       autoFocus
                       value={response}
                       onChange={(e) => setResponse(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSubmitResponse()}
                       placeholder="Enter your choice..."
                       className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-center text-xl font-bold focus:border-primary/50 transition-all outline-none"
                     />
                     
                     <div className="flex items-center justify-between px-2">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Reply quickly</div>
                        <div className="flex items-center gap-2 text-primary font-black text-lg">
                           <Timer size={16} /> {countdown}s
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={handleSubmitResponse}
                     className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                  >
                     Confirm Choice
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DeadManSwitch;
