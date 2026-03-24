import { motion } from "framer-motion";
import { MapPin, Shield, Siren, AlertTriangle } from "lucide-react";

const markers = [
  { x: 25, y: 35, type: "police", label: "Central Police Station" },
  { x: 60, y: 25, type: "police", label: "North District HQ" },
  { x: 45, y: 65, type: "emergency", label: "Emergency Response Unit" },
  { x: 75, y: 50, type: "police", label: "East Police Outpost" },
  { x: 30, y: 70, type: "hotspot", label: "Crime Hotspot Area" },
  { x: 70, y: 75, type: "hotspot", label: "High Alert Zone" },
  { x: 15, y: 50, type: "emergency", label: "Fire & Rescue" },
];

const iconMap = {
  police: { icon: Shield, color: "text-primary" },
  emergency: { icon: Siren, color: "text-warning" },
  hotspot: { icon: AlertTriangle, color: "text-danger" },
};

const SafetyMapSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">Safety Map</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">Smart Safety Map</h2>
        <p className="text-muted-foreground mt-3">Real-time crime hotspots and emergency services</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-4 md:p-6 max-w-5xl mx-auto"
      >
        {/* Map simulation */}
        <div className="relative aspect-[16/9] rounded-xl bg-secondary overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-primary" style={{ top: `${(i + 1) * 10}%` }} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-primary" style={{ left: `${(i + 1) * 10}%` }} />
            ))}
          </div>

          {/* Road-like lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-muted-foreground/20" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          <div className="absolute top-[30%] left-[10%] right-[20%] h-px bg-muted-foreground/15" />
          <div className="absolute left-[35%] top-[10%] bottom-[20%] w-px bg-muted-foreground/15" />

          {/* Heatmap zones */}
          <div className="absolute w-32 h-32 rounded-full bg-danger/10 blur-2xl" style={{ left: "25%", top: "60%" }} />
          <div className="absolute w-24 h-24 rounded-full bg-danger/10 blur-2xl" style={{ left: "65%", top: "68%" }} />

          {/* Markers */}
          {markers.map((m, i) => {
            const cfg = iconMap[m.type as keyof typeof iconMap];
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="absolute group"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-8 h-8 rounded-full glass flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}>
                    <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-card text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border">
                    {m.label}
                  </div>
                  {m.type === "hotspot" && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-danger/50"
                      animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Map label */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg glass text-xs font-mono text-muted-foreground">
            <MapPin className="w-3 h-3 inline mr-1" /> Smart Safety Map v2.0
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mt-4 justify-center">
          {[
            { icon: Shield, label: "Police Station", color: "text-primary" },
            { icon: Siren, label: "Emergency Services", color: "text-warning" },
            { icon: AlertTriangle, label: "Crime Hotspot", color: "text-danger" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <l.icon className={`w-4 h-4 ${l.color}`} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default SafetyMapSection;
