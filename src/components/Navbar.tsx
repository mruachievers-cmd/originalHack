import { useState } from "react";
import { Shield, Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WebDialer from "./WebDialer";

const links = [
  { label: "Features", id: "features" },
  { label: "Report", id: "complaint" },
  { label: "AI Scanner", id: "scanner" },
  { label: "Safety Map", id: "map" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dialerOpen, setDialerOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Guardian<span className="text-gradient">Net</span></span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </button>
          ))}
          {/* Call Support */}
          <button
            onClick={() => setDialerOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all shadow-[0_0_12px_rgba(34,197,94,0.4)]"
          >
            <Phone className="w-4 h-4" />
            Call Support
          </button>
          <button onClick={() => scrollTo("complaint")} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all">
            Emergency
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {links.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left text-sm text-muted-foreground hover:text-foreground py-2">
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { setDialerOpen((v) => !v); setOpen(false); }}
                className="flex items-center gap-2 w-full text-sm text-green-400 hover:text-green-300 py-2"
              >
                <Phone className="w-4 h-4" /> Call Support
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Web Dialer Panel */}
      <AnimatePresence>
        {dialerOpen && <WebDialer onClose={() => setDialerOpen(false)} />}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
