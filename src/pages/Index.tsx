import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import AboutSection from "@/components/AboutSection";
import ComplaintForm from "@/components/ComplaintForm";

import WomenSafetySection from "@/components/WomenSafetySection";
import SafetyMapSection from "@/components/SafetyMapSection";
import ChatbotSection from "@/components/ChatbotSection";

import TechStackSection from "@/components/TechStackSection";
import FutureScopeSection from "@/components/FutureScopeSection";
import FooterSection from "@/components/FooterSection";
import EvidenceCollection from "@/components/EvidenceCollection";
import EscortMode from "@/components/EscortMode";
import { FeatureSphere } from "@/components/FeatureSphere";
import AnonymousTip from "@/components/AnonymousTip";
import DeadManSwitch from "@/components/DeadManSwitch";
import SilentGestureSOS from "@/components/SilentGestureSOS";
import ThemeToggle from "@/components/ThemeToggle";


const Index = () => (
  <div className="min-h-screen bg-background text-foreground scroll-smooth relative overflow-x-hidden">
    <Navbar />
    <div id="home">
      <HeroSection />
    </div>
    <div className="relative z-20">
      <DeadManSwitch />
    </div>
    <div id="problem">
      <ProblemSection />
    </div>
    <div id="about">
      <AboutSection />
    </div>
    <div className="container mx-auto px-4 md:px-8 section-padding" id="features">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          Neural <span className="text-gradient">Feature Core</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          The central intelligence engine that powers every tactical unit of the Guardian Net ecosystem.
        </p>
      </div>
      <FeatureSphere />
    </div>
    <div id="complaint">
      <ComplaintForm />
    </div>
    <div id="safety">
      <WomenSafetySection />
    </div>
    <div id="witness">
      <AnonymousTip />
    </div>
    <EvidenceCollection />

    <div id="map">
      <SafetyMapSection />
    </div>
    <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] border border-white/10">
                <img src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cyberpunk City" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-end p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-auto">Sector Alpha Surveillance</span>
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] border border-white/10">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cyber Security" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-end p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-auto">Hardware Integrity Scan</span>
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] border border-white/10 md:col-span-2 lg:col-span-1">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Data Analytics" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-end p-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-auto">Real-time Data Stream</span>
                </div>
            </motion.div>
        </div>
    </div>
    <EscortMode />
    <ChatbotSection />
    <SilentGestureSOS />
    <ThemeToggle />
    <FooterSection />
  </div>
);

export default Index;

