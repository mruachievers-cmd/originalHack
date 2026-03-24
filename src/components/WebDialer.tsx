import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, X } from "lucide-react";

declare global {
  interface Window {
    JsSIP: any;
  }
}

interface WebDialerProps {
  onClose: () => void;
}

const DIALPAD_KEYS = [
  { main: "1", sub: "" },
  { main: "2", sub: "ABC" },
  { main: "3", sub: "DEF" },
  { main: "4", sub: "GHI" },
  { main: "5", sub: "JKL" },
  { main: "6", sub: "MNO" },
  { main: "7", sub: "PQRS" },
  { main: "8", sub: "TUV" },
  { main: "9", sub: "WXYZ" },
  { main: "*", sub: "" },
  { main: "0", sub: "+" },
  { main: "#", sub: "" },
];

const WebDialer = ({ onClose }: WebDialerProps) => {
  const [status, setStatus] = useState("Connecting...");
  const [isOnline, setIsOnline] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("200");
  const [inCall, setInCall] = useState(false);
  const [callTime, setCallTime] = useState<string | null>(null);

  const uaRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    setCallTime("00:00");
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
      const secs = String(elapsed % 60).padStart(2, "0");
      setCallTime(`${mins}:${secs}`);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallTime(null);
  };

  const resetUI = (reason: string) => {
    sessionRef.current = null;
    setInCall(false);
    stopTimer();
    if (reason) {
      setStatus(reason);
      setTimeout(() => {
        if (!sessionRef.current) setStatus("Online (User 300)");
      }, 3000);
    } else {
      setStatus("Online (User 300)");
    }
  };

  useEffect(() => {
    // Inject JsSIP script if not already loaded
    const existingScript = document.getElementById("jssip-script");
    const initJsSIP = () => {
      if (!window.JsSIP) return;
      const socket = new window.JsSIP.WebSocketInterface("ws://localhost:8088/ws");
      const configuration = {
        sockets: [socket],
        uri: "sip:300@localhost",
        password: "password300",
      };
      const ua = new window.JsSIP.UA(configuration);
      uaRef.current = ua;

      ua.on("connected", () => setStatus("Connected"));
      ua.on("disconnected", () => { setStatus("Disconnected"); setIsOnline(false); });
      ua.on("registered", () => { setStatus("Online (User 300)"); setIsOnline(true); });
      ua.on("registrationFailed", () => { setStatus("Registration Failed"); setIsOnline(false); });

      ua.on("newRTCSession", (data: any) => {
        const s = data.session;
        sessionRef.current = s;
        setInCall(true);

        s.on("peerconnection", (e: any) => {
          e.peerconnection.addEventListener("track", (event: RTCTrackEvent) => {
            if (audioRef.current && audioRef.current.srcObject !== event.streams[0]) {
              audioRef.current.srcObject = event.streams[0];
              audioRef.current.play();
            }
          });
        });
        s.on("confirmed", () => { setStatus("In Call"); startTimer(); });
        s.on("ended", () => resetUI("Call Ended"));
        s.on("failed", () => resetUI("Call Failed"));
      });

      ua.start();
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "jssip-script";
      script.src = "/jssip.min.js";
      script.onload = initJsSIP;
      document.head.appendChild(script);
    } else if (window.JsSIP) {
      initJsSIP();
    } else {
      existingScript.addEventListener("load", initJsSIP);
    }

    return () => {
      if (uaRef.current) {
        try { uaRef.current.stop(); } catch (_) {}
      }
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDialKey = (key: string) => {
    // Always update the input field so the user sees feedback
    setPhoneNumber((prev) => prev + key);

    const sess = sessionRef.current;
    if (sess && !sess.isEnded()) {
      try {
        // Send DTMF using default transport (auto-negotiated RFC2833 or INFO)
        sess.sendDTMF(key, {
          duration: 160,
          interToneGap: 50
        });
        console.log('[DTMF] Sent:', key);
      } catch (e) {
        console.error('[DTMF] Error:', e);
      }
    }
  };

  const handleCall = () => {
    const target = phoneNumber.replace(/\s+/g, "");
    if (!target || !uaRef.current) return;
    uaRef.current.call(`sip:${target}@localhost`, {
      eventHandlers: {
        progress: () => setStatus("Ringing..."),
        confirmed: () => setStatus("In Call"),
      },
      mediaConstraints: { audio: true, video: false },
    });
  };

  const handleHangup = () => {
    if (sessionRef.current) sessionRef.current.terminate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute top-20 right-4 z-50 w-72 rounded-2xl border border-white/10 bg-[#0f1117]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
            style={{ background: isOnline ? "#22c55e" : "#ef4444", boxShadow: isOnline ? "0 0 6px #22c55e" : "none" }}
          />
          <span className="text-xs text-muted-foreground">{status}</span>
          {callTime && (
            <span className="text-xs font-bold text-green-400 pl-2 border-l border-white/20">{callTime}</span>
          )}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-center text-sm font-semibold text-foreground">Call Support</p>

        {/* Number display */}
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Extension"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-center text-lg font-mono text-foreground focus:outline-none focus:border-primary"
        />

        {/* Dialpad */}
        {inCall && (
          <p className="text-center text-[10px] text-green-400 font-medium -mb-1">🎙 In Call — tap to send DTMF</p>
        )}
        <div className="grid grid-cols-3 gap-1.5">
          {DIALPAD_KEYS.map(({ main, sub }) => (
            <button
              key={main}
              onClick={() => handleDialKey(main)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all active:scale-95 ${
                inCall
                  ? 'bg-green-900/40 hover:bg-green-700/50 border border-green-600/30'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-base font-semibold leading-none">{main}</span>
              {sub && <span className="text-[9px] text-muted-foreground mt-0.5 tracking-widest">{sub}</span>}
            </button>
          ))}
        </div>

        {/* Call Controls */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCall}
            disabled={inCall}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-white text-sm"
          >
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button
            onClick={handleHangup}
            disabled={!inCall}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-white text-sm"
          >
            <PhoneOff className="w-4 h-4" />
            Hang Up
          </button>
        </div>
      </div>

      <audio ref={audioRef} autoPlay />
    </motion.div>
  );
};

export default WebDialer;
