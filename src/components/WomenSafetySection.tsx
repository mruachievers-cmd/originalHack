import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, MapPin, Mic, Video, Phone, Users } from "lucide-react";

const features = [
  { icon: MapPin, title: "Live GPS Tracking", desc: "Real-time location sharing with police & family" },
  { icon: Mic, title: "Voice Trigger", desc: 'Say "Help me" to activate emergency mode' },
  { icon: Video, title: "Auto Recording", desc: "Automatic video & audio capture on alert" },
  { icon: Phone, title: "Alert Police", desc: "Instant notification to nearest station" },
  { icon: Users, title: "Alert Family", desc: "Simultaneous alerts to emergency contacts" },
];

const WomenSafetySection = () => {
  const [sosActive, setSosActive] = useState(false);

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background glow */}
      {sosActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-danger/5 pointer-events-none"
        />
      )}

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-danger text-sm font-semibold tracking-widest uppercase">Emergency</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Women Safety Module</h2>
          <p className="text-muted-foreground mt-3">Instant emergency response at the touch of a button</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          {/* SOS Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <button
              onClick={() => setSosActive(!sosActive)}
              className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all ${
                sosActive ? "animate-pulse-glow bg-danger" : "bg-danger/80 hover:bg-danger glow-red"
              }`}
            >
              {sosActive && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-danger"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-danger"
                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </>
              )}
              <div className="text-center relative z-10">
                <ShieldAlert className="w-12 h-12 mx-auto mb-1 text-foreground" />
                <span className="text-xl font-black text-foreground">SOS</span>
              </div>
            </button>
            <p className="text-sm text-muted-foreground mt-6">
              {sosActive ? "Emergency alert sent! Tap to cancel." : "Tap to activate emergency alert"}
            </p>

            <AnimatePresence>
              {sosActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 glass rounded-xl p-4 w-full max-w-xs"
                >
                  <div className="text-sm font-semibold text-danger mb-2">🚨 Alert Active</div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>✓ GPS location shared</p>
                    <p>✓ Police notified</p>
                    <p>✓ Family contacts alerted</p>
                    <p>✓ Audio/video recording started</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Features list */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4 flex items-start gap-4 hover:glow-border transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-danger" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{f.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WomenSafetySection;
