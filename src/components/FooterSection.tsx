import { Shield, Github, Mail, Linkedin, Twitter, ExternalLink, Heart } from "lucide-react";

const team = ["R Akshaya", "B Upender", "K Sai Dinesh", "V Kavya Sri"];
const links = [
  { group: "Platform", items: ["E-FIR Filing", "Tactical Map", "Neural Assistant", "Sentinel SOS"] },
  { group: "Resources", items: ["Documentation", "API Access", "Privacy Policy", "Terms of Service"] },
];

const FooterSection = () => (
  <footer className="relative border-t border-white/5 bg-secondary/30 pt-24 pb-12 px-4 md:px-8 overflow-hidden">
    {/* Decorative background glow */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
    
    <div className="container mx-auto max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
        {/* Branding Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Guardian<span className="text-primary">Net</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-8">
            Next-generation autonomous security framework designed to bridge the gap between citizens and law enforcement through real-time neural intelligence.
          </p>
          <div className="flex gap-4">
            {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
              >
                <Icon size={18} className="text-muted-foreground group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        {links.map((linkGroup) => (
          <div key={linkGroup.group}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">{linkGroup.group}</h4>
            <ul className="space-y-4">
              {linkGroup.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform"></div>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Team Column */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Mission Control</h4>
          <ul className="space-y-4">
            {team.map((t) => (
              <li key={t} className="text-sm font-black text-foreground/80 flex items-center gap-2 hover:text-primary cursor-default transition-colors">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary"></div>
                 {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
           © 2026 INTERNAL SECURITY PROTOCOL. ALL ASSETS SECURED.
        </div>
        
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
             ENGINEERING <Heart size={10} className="text-rose-500 animate-pulse fill-rose-500" /> MRU ACHIEVERS
           </div>
           <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:brightness-125 transition-all">
             SYSTEM STATUS <ExternalLink size={12} />
           </button>
        </div>
      </div>
    </div>
  </footer>
);

export default FooterSection;

