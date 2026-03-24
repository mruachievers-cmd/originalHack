import { motion } from "framer-motion";
import { Smartphone, BarChart3, Cctv, Building2, BrainCircuit } from "lucide-react";

const roadmap = [
  { icon: Smartphone, title: "Mobile Application", desc: "Native iOS & Android apps for citizens" },
  { icon: BarChart3, title: "Real-time Crime Analytics", desc: "Live dashboards for law enforcement" },
  { icon: Cctv, title: "Smart Surveillance AI", desc: "Automated threat detection via CCTV" },
  { icon: Building2, title: "Govt Integration", desc: "Connect with national police databases" },
  { icon: BrainCircuit, title: "Crime Prediction", desc: "AI-powered predictive crime analysis" },
];

const FutureScopeSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">Roadmap</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">Future Scope</h2>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
        {roadmap.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex-1 glass rounded-xl p-5 text-center hover:glow-border transition-all relative"
          >
            <div className="text-xs text-primary font-mono mb-3">Phase {i + 1}</div>
            <r.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-1">{r.title}</h3>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FutureScopeSection;
