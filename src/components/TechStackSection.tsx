import { motion } from "framer-motion";
import { Code2, Database, Brain, Map, Camera, Layout } from "lucide-react";

const techStack = [
  { icon: Layout, label: "React / Next.js", category: "Frontend" },
  { icon: Code2, label: "Node.js / Firebase", category: "Backend" },
  { icon: Database, label: "MongoDB / Firebase", category: "Database" },
  { icon: Brain, label: "Python AI", category: "AI / ML" },
  { icon: Map, label: "Google Maps API", category: "Maps" },
  { icon: Camera, label: "Camera API", category: "Vision" },
];

const TechStackSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">Technology</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">Tech Stack</h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
        {techStack.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-5 text-center hover:glow-border transition-all group"
          >
            <t.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-semibold">{t.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{t.category}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStackSection;
