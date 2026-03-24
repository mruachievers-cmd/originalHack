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
    <EscortMode />
    <ChatbotSection />
    <SilentGestureSOS />
    <FooterSection />
  </div>
);

export default Index;

