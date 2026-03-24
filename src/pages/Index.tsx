import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import AboutSection from "@/components/AboutSection";
import ComplaintForm from "@/components/ComplaintForm";
import AIScannerSection from "@/components/AIScannerSection";
import WomenSafetySection from "@/components/WomenSafetySection";
import SafetyMapSection from "@/components/SafetyMapSection";
import ChatbotSection from "@/components/ChatbotSection";
import DashboardPreview from "@/components/DashboardPreview";
import TechStackSection from "@/components/TechStackSection";
import FutureScopeSection from "@/components/FutureScopeSection";
import FooterSection from "@/components/FooterSection";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <HeroSection />
    <ProblemSection />
    <AboutSection />
    <DashboardPreview />
    <ComplaintForm />
    <div id="scanner">
      <AIScannerSection />
    </div>
    <WomenSafetySection />
    <div id="map">
      <SafetyMapSection />
    </div>
    <ChatbotSection />
    <TechStackSection />
    <FutureScopeSection />
    <FooterSection />
  </div>
);

export default Index;
