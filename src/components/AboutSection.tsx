import { motion } from "framer-motion";
import { CheckCircle2, Cpu, Users, Siren } from "lucide-react";

const features = [
  "AI-powered criminal identification",
  "Real-time emergency response",
  "Digital FIR & complaint system",
  "Women safety panic alerts",
  "Smart crime mapping",
  "Citizen-police communication",
];

const AboutSection = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">About</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
            What is <span className="text-gradient">Guardian Net</span>?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Guardian Net is a smart safety platform that uses AI technology to help citizens quickly contact police, report crimes, and improve emergency response. It bridges the gap between citizens and law enforcement using cutting-edge technology.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { icon: Cpu, label: "AI Engine", val: "99.2% Accuracy" },
            { icon: Users, label: "Citizens Protected", val: "50K+" },
            { icon: Siren, label: "Response Time", val: "<3 min" },
            { icon: CheckCircle2, label: "Cases Resolved", val: "12K+" },
          ].map((s, i) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center hover:glow-border transition-all">
              <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-foreground">{s.val}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
