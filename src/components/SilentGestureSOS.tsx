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
        triggerSilentSOS("gesture_double_tap");
        lastTapRef.current = 0; // Reset
      } else {
        lastTapRef.current = now;
      }
    };

    // 2. Body Tap Detection (Accelerometer)
    const handleMotion = (e: DeviceMotionEvent) => {
      if (!isArmed || cooldown) return;
      
      const acc = e.acceleration;
      if (!acc) return;

      const totalForce = Math.sqrt((acc.x || 0)**2 + (acc.y || 0)**2 + (acc.z || 0)**2);
      
      if (totalForce > 18) { // Increased threshold for "motherboard" tap
        const now = Date.now();
        const diff = now - lastTapRef.current;
        
        if (diff < 800 && diff > 100) {
            triggerSilentSOS("device_tap_pattern");
            lastTapRef.current = 0;
        } else {
            lastTapRef.current = now;
        }
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
    
    // 🔊 Auditory Alarm Trigger
    const audio = new Audio("https://actions.google.com/sounds/v1/emergency/ambulance_siren.ogg");
    audio.play().catch(() => console.log("Audio blocked by browser policy"));

    // 🚨 Visual Alarm Strobe
    document.body.classList.add('animate-pulse-red');
    setTimeout(() => document.body.classList.remove('animate-pulse-red'), 5000);

    toast.error("🚨 ALARM TRIGGERED", {
        description: "Emergency protocol active. Police notified.",
        duration: 5000,
    });

    try {
      await submitSOS({
        user: "G-241",
        location: "Detected Sector (GPS Active)",
        alert_type: "silent_sos",
        trigger_source: type,
        status: "Critical Alarm",
        meta: {
            mode: "Audible Alarm Enabled",
            trigger: type
        }
      });
    } catch (err) {
      console.error("Bridge failure.");
    }

    cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
    }, 30000);
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
