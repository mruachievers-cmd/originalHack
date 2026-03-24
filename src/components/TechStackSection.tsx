import { motion } from "framer-motion";
import { Code2, Database, Brain, Map, Camera, Layout, Shield, Globe, Cpu, Zap, Radio, Lock } from "lucide-react";

const techStack = [
  { logo: "https://cdn.simpleicons.org/react/61DAFB", label: "React / Next.js", category: "Architecture", color: "text-sky-400" },
  { logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4", label: "Tailwind CSS", category: "Styling", color: "text-cyan-400" },
  { logo: "https://cdn.simpleicons.org/mongodb/47A033", label: "MongoDB / Atlas", category: "Database", color: "text-emerald-400" },
  { logo: "https://cdn.simpleicons.org/nodedotjs/339933", label: "Node.js / Express", category: "Backend", color: "text-green-400" },
  { logo: "https://cdn.simpleicons.org/googlemaps/4285F4", label: "Google Maps SDK", category: "Spatial", color: "text-emerald-400" },
  { logo: "https://cdn.simpleicons.org/openai/412991", label: "AI / ML Vision", category: "Intelligence", color: "text-indigo-400" },
  { logo: "https://cdn.simpleicons.org/auth0/EB5424", label: "Auth.js / JWT", category: "Security", color: "text-violet-400" },
  { logo: "https://cdn.simpleicons.org/socketdotio/010101", label: "Socket.io", category: "Real-time", color: "text-blue-400" },
  { logo: "https://cdn.simpleicons.org/framer/0055FF", label: "Framer Motion", category: "Animation", color: "text-fuchsia-400" },
  { logo: "https://cdn.simpleicons.org/twilio/F22F46", label: "Twilio / SMS", category: "Comms", color: "text-red-400" },
  { logo: "https://cdn.simpleicons.org/typescript/3178C6", label: "TypeScript", category: "Language", color: "text-blue-500" },
  { logo: "https://cdn.simpleicons.org/git/F05032", label: "Git / Versioning", category: "Control", color: "text-orange-500" },
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-7xl mx-auto">
        {techStack.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group card-premium p-3 hover:border-primary/20 transition-all flex items-center gap-3 cursor-default"
          >
            <div className={`w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300`}>
              <img src={t.logo} className="w-4 h-4 object-contain" alt={t.label} />
            </div>
            <div className="min-w-0">
              <div className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 opacity-60 truncate">{t.category}</div>
              <div className="text-[10px] font-black tracking-tight group-hover:text-primary transition-colors truncate">{t.label}</div>
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

