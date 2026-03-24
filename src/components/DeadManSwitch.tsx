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
  const [countdown, setCountdown] = useState(10); // Simulation countdown
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMonitoring = () => {
    setIsActive(true);
    toast.success("Guardian Dead-Man Switch Activated", {
      description: "Casual check-ins will begin shortly. Stay safe!",
    });
    // For demo: trigger first check after 10 seconds
    timerRef.current = setTimeout(() => {
      triggerCheckIn();
    }, 10000);
  };

  const stopMonitoring = () => {
    setIsActive(false);
    setShowCheckIn(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    toast.info("Dead-Man Switch Deactivated");
  };

  const triggerCheckIn = () => {
    const randomIdx = Math.floor(Math.random() * QUESTIONS.length);
    setCurrentQuestion(QUESTIONS[randomIdx]);
    setShowCheckIn(true);
    setResponse("");
    setCountdown(10); // User has 10 seconds to reply (Simulated)

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
        toast.success("Check-in confirmed. Safe travels!");
        // Schedule next check in 20 seconds for demo
        timerRef.current = setTimeout(() => {
            triggerCheckIn();
        }, 20000);
    }
  };

  const handleDistressDetected = async (reason: string) => {
    setShowCheckIn(false);
    setIsActive(false);
    toast.warning("Silent Distress Detected", {
      description: "Triggering emergency protocols immediately.",
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
        toast.error("SOS Emergency Alert Dispatched to Central Command", {
            duration: 10000
        });
    } catch (err) {
        toast.error("Bridge Connection Lost - Local SOS broadcast only.");
    }
  };

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="glass-card p-8 rounded-[2rem] border border-white/10 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Timer size={120} className="text-primary" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} />
                Dead-Man Switch
              </div>
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight">
                Fun <span className="text-gradient">Check Mode</span>
              </h2>
              <p className="text-muted-foreground text-sm uppercase font-black tracking-widest leading-relaxed">
                 Monitor your safety via casual polls without alerting attackers.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => isActive ? stopMonitoring() : startMonitoring()}
                  className={`relative w-24 h-12 rounded-full transition-all duration-500 shadow-2xl ${
                    isActive ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 w-10 h-10 rounded-full bg-white transition-all duration-500 flex items-center justify-center ${
                    isActive ? 'left-13 right-1' : 'left-1'
                  }`}>
                    {isActive ? <CheckCircle2 className="text-emerald-500" size={20} /> : <X className="text-muted-foreground" size={20} />}
                  </div>
                </button>
                <div className="text-[10px] font-black uppercase tracking-[0.2em]">
                   {isActive ? 'Safety Switch: ENGAGED' : 'Safety Switch: DISARMED'}
                </div>
            </div>
          </div>
        </div>

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
