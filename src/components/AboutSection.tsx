import { motion, useInView } from "framer-motion";
import { CheckCircle2, Cpu, Users, Siren, ShieldCheck, Zap, BarChart3, Clock } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const Counter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number and suffix
  const matches = value.match(/(\d+\.?\d*)(.*)/);
  const target = matches ? parseFloat(matches[1]) : 0;
  const suffix = matches ? matches[2] : "";

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      if (start === end) return;

      const totalMiliseconds = duration * 1000;
      const incrementTime = 50;
      const totalSteps = totalMiliseconds / incrementTime;
      const increment = end / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {Number.isInteger(target) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
};

const features = [
  { title: "AI Identification", desc: "Advanced criminal facial recognition technology." },
  { title: "Real-time Response", desc: "Instantly alerts nearest police units with GPS." },
  { title: "Digital FIR System", desc: "Filing complaints is now faster and paperless." },
  { title: "Women Safety SOS", desc: "Emergency tools for immediate protection." },
  { title: "Smart Map zones", desc: "Visualizing crime hotspots in real-time." },
  { title: "Secure Data", desc: "Blockchain-inspired secure record management." },
];

const AboutSection = () => (
  <section className="section-padding relative">
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
            <ShieldCheck size={14} />
            ABOUT PLATFORM
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
            Protecting Communities with <span className="text-gradient">Next-Gen AI</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed max-w-xl">
            Guardian Net is not just an application; it&apos;s a mission to modernize public safety. We leverage state-of-the-art AI and cloud infrastructure to ensure that help is always just a click away.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <CheckCircle2 size={12} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-muted-foreground leading-snug">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-30 -z-10 animate-pulse"></div>
          
          {[
            { icon: Cpu, label: "AI Engine Accuracy", val: "99.2%", color: "text-blue-400" },
            { icon: Users, label: "Citizens Supported", val: "50K+", color: "text-cyan-400" },
            { icon: Clock, label: "Response Time", val: "3min", color: "text-emerald-400" },
            { icon: BarChart3, label: "Cases Successfully Handled", val: "12K+", color: "text-indigo-400" },
          ].map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="card-premium p-8 text-center group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${s.color}`}>
                <s.icon size={28} />
              </div>
              <div className="text-3xl font-black mb-2 tracking-tight">
                <Counter value={s.val} />
              </div>
              <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
          
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white/5 rounded-full -z-10 hidden xl:block"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent rounded-full -z-10 hidden xl:block"></div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;

