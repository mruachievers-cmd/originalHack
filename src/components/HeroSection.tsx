import { motion } from "framer-motion";
import { Shield, Brain, MapPin, ShieldCheck } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const icons = [
  { icon: Shield, label: "Police" },
  { icon: Brain, label: "AI" },
  { icon: MapPin, label: "GPS" },
  { icon: ShieldCheck, label: "Safety" },
];

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* SaaS Style Background Illustration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background z-10" />
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20 grayscale brightness-50"
          alt="Smart City AI Background"
          loading="lazy"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <motion.img 
          src={heroBg} 
          alt="Smart city security" 
          className="w-full h-full object-cover scale-110" 
          width={1920} 
          height={1080}
          animate={{
            scale: [1.1, 1.25, 1.1],
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">AI-Powered Safety Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            <span className="text-foreground">Guardian</span>{" "}
            <span className="text-gradient">Net</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 font-medium">
            Smart Police Assistance System
          </p>
          <p className="text-sm md:text-base text-muted-foreground/80 max-w-xl mx-auto mb-10">
            AI-powered platform connecting citizens and police for faster emergency response and safer communities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => scrollTo("features")}
              className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all glow-cyan"
            >
              Explore Features
            </button>
            <button
              onClick={() => scrollTo("complaint")}
              className="px-8 py-3.5 rounded-lg glass font-semibold text-foreground hover:bg-card/80 transition-all border border-primary/30"
            >
              Report Emergency
            </button>
          </div>

          <div className="flex justify-center gap-8 md:gap-12">
            {icons.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center glow-border">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
