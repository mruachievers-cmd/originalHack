import { motion } from "framer-motion";
import { Clock, Radio, FileText, ShieldAlert } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Crime Reporting Delays",
    desc: "Traditional reporting methods cause critical delays in emergency response times.",
  },
  {
    icon: Radio,
    title: "Poor Communication",
    desc: "Lack of real-time communication channels between citizens and police.",
  },
  {
    icon: FileText,
    title: "No Digital FIR System",
    desc: "Paper-based FIR systems lead to inefficiency and record loss.",
  },
  {
    icon: ShieldAlert,
    title: "Women Safety Emergencies",
    desc: "Insufficient tools for women to quickly alert authorities in danger.",
  },
];

const ProblemSection = () => (
  <section id="features" className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">The Problem</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">Why We Need Guardian Net</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6 hover:glow-border transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <p.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
