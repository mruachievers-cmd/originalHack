import { Shield, Github, Mail } from "lucide-react";

const team = ["R Akshaya", "B Upender", "K Sai Dinesh", "V Kavya Sri"];

const FooterSection = () => (
  <footer className="border-t border-border py-12 px-4">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold">Guardian<span className="text-gradient">Net</span></span>
          </div>
          <p className="text-sm text-muted-foreground">Smart Police Assistance System — AI-powered platform for citizen safety and emergency response.</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Team Members</h4>
          <ul className="space-y-1.5">
            {team.map((t) => (
              <li key={t} className="text-sm text-muted-foreground">{t}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Connect</h4>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:glow-border transition-all">
              <Github className="w-4 h-4 text-muted-foreground" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:glow-border transition-all">
              <Mail className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 Guardian Net. Built for innovation.
      </div>
    </div>
  </footer>
);

export default FooterSection;
