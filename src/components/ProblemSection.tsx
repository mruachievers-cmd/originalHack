import { motion } from "framer-motion";
import { Clock, Radio, FileText, ShieldAlert } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Crime Reporting Delays",
    desc: "Traditional reporting methods cause critical delays in emergency response times, costing precious seconds.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    illustration: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: Radio,
    title: "Poor Communication",
    desc: "Lack of real-time communication channels between citizens and police leads to information gaps.",
    color: "from-purple-500/20 to-blue-500/20",
    iconColor: "text-purple-400",
    illustration: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: FileText,
    title: "No Digital FIR System",
    desc: "Paper-based FIR systems lead to inefficiency, record loss, and slow legal processes.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
    illustration: "https://images.unsplash.com/photo-1586769852044-692d6e3703a0?q=80&w=600&auto=format&fit=crop"
  },
  {
    icon: ShieldAlert,
    title: "Women Safety Emergencies",
    desc: "Insufficient tools for women to quickly and discreetly alert authorities in danger.",
    color: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-400",
    illustration: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&auto=format&fit=crop"
  },
];

const ProblemSection = () => (
  <section id="features" className="section-padding relative overflow-hidden">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan/5 blur-[120px] rounded-full -z-10"></div>
    
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">
          Current Challenges
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Why We Need <span className="text-gradient">Guardian Net</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          The existing law enforcement infrastructure faces critical bottlenecks that hinder public safety.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
            whileHover={{ y: -10 }}
            className="group relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500`}></div>
            
            <div className="card-premium relative h-full flex flex-col p-8 z-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <p.icon size={80} />
              </div>
              
              <div className="mb-8 relative overflow-hidden rounded-xl h-24 w-full">
                <img src={p.illustration} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" alt={p.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>

              <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-all duration-300 ${p.iconColor}`}>
                <p.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm grow">
                {p.desc}
              </p>
              
              <div className="mt-8 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                READ MORE <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;

