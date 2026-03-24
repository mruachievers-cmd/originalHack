import { motion } from "framer-motion";
import { Code2, Database, Brain, Map, Camera, Layout, Shield, Globe, Cpu, Zap, Radio, Lock } from "lucide-react";

const techStack = [
  { icon: Layout, label: "React / Next.js", category: "Architecture", color: "text-sky-400" },
  { icon: Code2, label: "Tailwind CSS", category: "Styling", color: "text-cyan-400" },
  { icon: Database, label: "Appwrite / Firebase", category: "Backend", color: "text-rose-400" },
  { icon: Brain, label: "Python / PyTorch", category: "Intelligence", color: "text-indigo-400" },
  { icon: Map, label: "Google Maps SDK", category: "Spatial", color: "text-emerald-400" },
  { icon: Camera, label: "OpenCV / Vision", category: "Processing", color: "text-amber-400" },
  { icon: Shield, label: "Auth.js / JWT", category: "Security", color: "text-violet-400" },
  { icon: Globe, label: "Socket.io", category: "Real-time", color: "text-blue-400" },
  { icon: Cpu, label: "Edge Computing", category: "Infrastructure", color: "text-orange-400" },
  { icon: Zap, label: "Framer Motion", category: "Animation", color: "text-fuchsia-400" },
  { icon: Radio, label: "Twilio / SMS", category: "Comms", color: "text-red-400" },
  { icon: Lock, label: "AES-256 / RSA", category: "Encryption", color: "text-slate-400" },
];

const TechStackSection = () => (
  <section id="tech" className="section-padding relative overflow-hidden">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Code2 size={12} />
          SYSTEM ARCHITECTURE
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          Engineered for <span className="text-gradient">Performance</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          The Guardian Net ecosystem is built on a foundation of modern, industry-standard technologies to ensure scalability, security, and real-time reliability.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {techStack.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group card-premium p-6 hover:border-white/20 transition-all flex items-center gap-5 cursor-default"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 ${t.color}`}>
              <t.icon size={26} />
            </div>
            <div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">{t.category}</div>
              <div className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{t.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] -z-10 rounded-full rotate-12"></div>
    </div>
  </section>
);

export default TechStackSection;

