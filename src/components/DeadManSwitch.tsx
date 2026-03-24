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
  const [nextCheckIn, setNextCheckIn] = useState(60); // 1 minute
  const [countdown, setCountdown] = useState(30); 
  const [step, setStep] = useState<'idle' | 'dest' | 'time' | 'active'>('idle');
  const [destination, setDestination] = useState("");
  const [journeyDuration, setJourneyDuration] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); 

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const journeyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startOnboarding = () => {
    setStep('dest');
  };

  const handleSetDestination = () => {
    if (!destination.trim()) return;
    setStep('time');
  };

  const handleSetTime = () => {
    const mins = parseInt(journeyDuration);
    if (isNaN(mins) || mins <= 0) return;
    
    setTimeLeft(mins * 60);
    setStep('active');
    setIsActive(true);
    setNextCheckIn(60); 
    
    toast.success("Safe Journey Protocol Initiated", {
      description: `Monitoring journey to ${destination}. Neural probes every 1 minute.`,
    });

    startMonitoringSequence();
  };

  const startMonitoringSequence = () => {
    if (journeyTimerRef.current) clearInterval(journeyTimerRef.current);
    
    journeyTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                if(journeyTimerRef.current) clearInterval(journeyTimerRef.current);
                handleJourneyFinished();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    startNextCycle(60); 
  };

  const startNextCycle = (seconds: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setNextCheckIn(seconds);
    
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
    }, seconds * 1000);
  };

  const handleJourneyFinished = () => {
    stopMonitoring();
    toast.success("Destination Reached", {
        description: "Safety protocol concluded. Stay safe!",
        duration: 8000
    });
  };

  const stopMonitoring = () => {
    setIsActive(false);
    setShowCheckIn(false);
    setStep('idle');
    setDestination("");
    setJourneyDuration("");
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (journeyTimerRef.current) clearInterval(journeyTimerRef.current);
    toast.info("Dead-Man Switch Deactivated");
  };

  const triggerCheckIn = () => {
    const randomIdx = Math.floor(Math.random() * QUESTIONS.length);
    setCurrentQuestion(QUESTIONS[randomIdx]);
    setShowCheckIn(true);
    setResponse("");
    setCountdown(30);

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
        handleDistressDetected(`Emergency Trigger: ${response}`);
    } else {
        setShowCheckIn(false);
        toast.success("Neural Link Active. Status Green.");
        startNextCycle(60); 
    }
  };

  const handleDistressDetected = async (reason: string) => {
    setShowCheckIn(false);
    setIsActive(false);
    setStep('idle');
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (journeyTimerRef.current) clearInterval(journeyTimerRef.current);
    
    toast.warning("Neural Link Broken: Silent Distress Detected", {
      description: "Emergency units are being dispatched to your sector.",
    });

    try {
        await submitSOS({
          user: "Citizen Account",
          location: `Dest: ${destination} | Status: ${reason}`,
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
                {isActive && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest tracking-tighter">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        Mission: {destination}
                    </div>
                )}
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none font-tactical text-glow">
                Guardian <span className="text-primary">Dead-Man</span> <br/> 
                <span className="text-white">Safety Mode</span>
              </h2>
              
              <p className="text-muted-foreground text-base lg:text-lg uppercase font-black tracking-[0.2em] leading-relaxed max-w-xl font-neural">
                 Silent monitoring checks on you via casual polls, keeping your status hidden during your journey.
              </p>

              {isActive && (
                <div className="grid md:grid-cols-2 gap-6 pt-4 max-w-xl">
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary font-tactical">
                         <span>Next Safety Probe</span>
                         <span className="font-neural">{Math.floor(nextCheckIn / 60)}:{(nextCheckIn % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                         <motion.div 
                           initial={{ width: "100%" }}
                           animate={{ width: `${(nextCheckIn / 60) * 100}%` }}
                           transition={{ duration: 1, ease: "linear" }}
                           className="h-full bg-primary"
                         />
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400 font-tactical">
                         <span>Journey Progress</span>
                         <span className="font-neural">{Math.floor(timeLeft / 60)}m left</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                         <motion.div 
                           initial={{ width: "100%" }}
                           animate={{ width: `${(timeLeft / (parseInt(journeyDuration) * 60)) * 100}%` }}
                           transition={{ duration: 1, ease: "linear" }}
                           className="h-full bg-emerald-500"
                         />
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[320px]">
                {step === 'idle' && (
                    <>
                        <button 
                        onClick={startOnboarding}
                        className="relative w-28 h-14 rounded-full transition-all duration-500 scale-110 bg-white/10 hover:bg-white/20"
                        >
                        <div className="absolute top-1.5 left-1.5 w-11 h-11 rounded-full bg-white flex items-center justify-center">
                            <X className="text-muted-foreground" size={24} />
                        </div>
                        </button>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">START MISSION</span>
                    </>
                )}

                {step === 'dest' && (
                    <div className="w-full space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary text-center">Protocol: Destination</div>
                        <input 
                            type="text" 
                            placeholder="Where are you going?" 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSetDestination()}
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-center text-sm font-bold focus:border-primary/50 transition-all outline-none"
                        />
                        <button onClick={handleSetDestination} className="w-full bg-primary py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Verify Route</button>
                    </div>
                )}

                {step === 'time' && (
                    <div className="w-full space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary text-center">Protocol: Duration</div>
                        <input 
                            type="number" 
                            placeholder="Mins to reach?" 
                            value={journeyDuration}
                            onChange={(e) => setJourneyDuration(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSetTime()}
                            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-center text-sm font-bold focus:border-primary/50 transition-all outline-none"
                        />
                        <button onClick={handleSetTime} className="w-full bg-emerald-500 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Secure Link</button>
                    </div>
                )}

                {step === 'active' && (
                    <>
                        <button 
                        onClick={stopMonitoring}
                        className="relative w-28 h-14 rounded-full transition-all duration-700 bg-primary shadow-primary/30"
                        >
                        <div className="absolute top-1.5 right-1.5 w-11 h-11 rounded-full bg-white flex items-center justify-center">
                            <Shield className="text-primary" size={24} />
                        </div>
                        </button>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">LINK ACTIVE</span>
                        <button onClick={stopMonitoring} className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-2 hover:text-rose-500 transition-colors">Abort</button>
                    </>
                )}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showCheckIn && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-strong p-10 rounded-[3rem] border border-primary/30 max-w-lg w-full relative overflow-hidden text-center"
              >
                <div className="space-y-6">
                  <div className="flex justify-center"><div className="p-4 bg-primary/20 text-primary rounded-2xl animate-pulse"><MessageSquare size={32} /></div></div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase italic text-muted-foreground">Neural Probe</h3>
                    <div className="text-3xl font-black text-white">{currentQuestion}</div>
                  </div>
                  <input 
                       type="text" autoFocus value={response}
                       onChange={(e) => setResponse(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSubmitResponse()}
                       placeholder="Enter choice..."
                       className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xl font-bold focus:border-primary/50 outline-none"
                  />
                  <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    <span>Reply Now</span>
                    <span className="flex items-center gap-1"><Timer size={12} /> {countdown}s</span>
                  </div>
                  <button onClick={handleSubmitResponse} className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-xl">Confirm</button>
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
