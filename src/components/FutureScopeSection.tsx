import { motion } from "framer-motion";
import { Smartphone, BarChart3, Cctv, Building2, BrainCircuit, Milestone } from "lucide-react";

const roadmap = [
  { icon: Smartphone, title: "Mobile Ecosystem", desc: "Native iOS & Android biometric integration" },
  { icon: BarChart3, title: "Tactical Analytics", desc: "Predictive threat modeling for commanders" },
  { icon: Cctv, title: "Autonomic Vision", desc: "Recursive neural detection via city-wide CCTV" },
  { icon: Building2, title: "Federal Gateway", desc: "Direct uplink to INTERPOL & National Data" },
  { icon: BrainCircuit, title: "Cognitive Policing", desc: "Pre-emptive response optimization engines" },
];

const FutureScopeSection = () => (
  <section id="roadmap" className="section-padding relative">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Milestone size={12} />
          STRATEGIC MISSION
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          Future <span className="text-gradient">Horizon</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Our vision extends beyond digital complaints—we are engineering a proactive, AI-first security infrastructure for the smart cities of tomorrow.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto relative">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-[100px] left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        {roadmap.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative flex flex-col items-center group"
          >
            <div className="text-[10px] font-black text-primary mb-6 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 uppercase tracking-[0.2em] group-hover:scale-110 transition-transform">
              Phase 0{i + 1}
            </div>
            
            <div className="w-20 h-20 rounded-[2rem] bg-secondary border border-white/5 flex items-center justify-center mb-6 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500 shadow-xl relative z-10 group-hover:-translate-y-2">
               <r.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
               <div className="absolute inset-0 rounded-[2rem] bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </div>
            
            <div className="text-center">
              <h3 className="font-black text-sm uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{r.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed transition-opacity group-hover:opacity-100 opacity-60 px-2">{r.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Call to action card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-24 max-w-4xl mx-auto card-premium p-12 text-center relative overflow-hidden group"
      >
         <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
         <h3 className="text-2xl font-black mb-4 relative z-10 uppercase tracking-tight">Interested in collaborating on the <span className="text-primary italic">next phase</span>?</h3>
         <p className="text-muted-foreground mb-8 relative z-10 max-w-xl mx-auto">
           We are looking for strategic partners, developers, and government agencies to help scale Guardian Net.
         </p>
         <button className="relative z-10 bg-primary hover:bg-primary/90 text-white font-black px-10 py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
           Join the Mission
         </button>
      </motion.div>
    </div>
  </section>
);

export default FutureScopeSection;

