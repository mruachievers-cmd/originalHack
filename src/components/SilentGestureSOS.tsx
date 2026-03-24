import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Fingerprint, Activity, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { submitSOS } from "../lib/api";

const SilentGestureSOS = () => {
  const [isArmed, setIsArmed] = useState(true);
  const [triggerCount, setTriggerCount] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapCycleRef = useRef<number>(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Mobile Double Tap Detection
    const handleTouch = (e: TouchEvent) => {
      if (!isArmed || cooldown) return;
      
      const now = Date.now();
      const diff = now - lastTapRef.current;
      
      if (diff < 500 && diff > 50) {
        // Recognition of a double tap cycle
        tapCycleRef.current += 1;
        if (tapCycleRef.current >= 2) {
            triggerSilentSOS("gesture_double_tap");
            tapCycleRef.current = 0;
        }
      } else if (diff > 1000) {
        tapCycleRef.current = 0;
      }
      
      lastTapRef.current = now;
    };

    // 2. Laptop / Device Motion Detection (Accelerometer Spikes)
    const handleMotion = (e: DeviceMotionEvent) => {
      if (!isArmed || cooldown) return;
      
      const acc = e.acceleration;
      if (!acc) return;

      const totalForce = Math.sqrt((acc.x || 0)**2 + (acc.y || 0)**2 + (acc.z || 0)**2);
      
      // Look for a sudden spike (physical tap on the body)
      if (totalForce > 15) { // Force threshold
        const now = Date.now();
        const diff = now - lastTapRef.current;
        
        if (diff < 1000 && diff > 100) {
            triggerSilentSOS("device_tap_pattern");
        }
        lastTapRef.current = now;
      }
    };

    window.addEventListener('touchstart', handleTouch);
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isArmed, cooldown]);

  const triggerSilentSOS = async (type: string) => {
    setCooldown(true);
    
    // Hidden "Micro-Toast" for feedback only to user
    toast("Grid Link Syncing...", {
        icon: <Activity className="text-emerald-500 animate-pulse" size={14} />,
        description: "Neural protocol established silently.",
        duration: 3000,
    });

    try {
      await submitSOS({
        user: "G-241", // Mock User as per requirement
        location: "Detected Sector (GPS Active)",
        alert_type: "silent_sos",
        trigger_source: type,
        status: "Hidden Emergency",
        meta: {
            mode: "Hidden Emergency",
            trigger: type === "gesture_double_tap" ? "Mobile Double Tap Gesture" : "Device Tap Pattern"
        }
      });
      
      // Log for evidence logs
      console.log(`[SILENT SOS] ${type} triggered mission capture.`);
      
    } catch (err) {
      console.error("Silent bridge failed.");
    }

    // Cooldown logic
    cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
    }, 30000); // 30s Cooldown
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-4">
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-2xl border backdrop-blur-xl transition-all duration-500 flex flex-col items-center gap-2 group cursor-help ${
                cooldown 
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-60 hover:opacity-100'
            }`}
        >
            <div className="relative">
                {cooldown ? <ShieldAlert size={20} className="animate-pulse" /> : <Fingerprint size={20} />}
                {isArmed && !cooldown && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                )}
            </div>
            
            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 flex flex-col items-center">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                   {cooldown ? 'Cooldown Active' : 'Silent SOS Armed'}
                </span>
                <span className="text-[6px] text-white/40 mt-1 uppercase font-bold text-center leading-tight">
                    Double Tap Screen <br/> or Body To Trigger
                </span>
            </div>
        </motion.div>
    </div>
  );
};

export default SilentGestureSOS;
