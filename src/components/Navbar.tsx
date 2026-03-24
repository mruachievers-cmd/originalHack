import { useState, useEffect } from "react";
import { Shield, Menu, X, Phone, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import WebDialer from "./WebDialer";

const links = [
  { label: "Features", id: "features" },
  { label: "Report", id: "complaint" },
  { label: "Witness", id: "witness" },
  { label: "Escort", id: "escort" },
  { label: "AI Scanner", id: "scanner" },
  { label: "Safety Map", id: "map" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dialerOpen, setDialerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? "py-3 bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-lg" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse"></div>
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            Guardian<span className="text-primary italic">Net</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {links.map((l) => (
              <button 
                key={l.id} 
                onClick={() => scrollTo(l.id)} 
                className="relative text-sm font-medium text-foreground/70 hover:text-white transition-colors group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>
          
          <div className="h-4 w-px bg-white/10 mx-2"></div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 uppercase tracking-widest">
                <LogIn size={16} /> Login
            </Link>

            <Link 
              to="/signup" 
              className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-black hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,168,232,0.3)] flex items-center gap-2 group"
            >
              <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
              REQUEST ACCESS
            </Link>

            <button 
              onClick={() => setDialerOpen(true)} 
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all shadow-[0_0_12px_rgba(34,197,94,0.4)] flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Support
            </button>

            <button 
              onClick={() => scrollTo("complaint")} 
              className="relative overflow-hidden group px-5 py-2.5 rounded-full bg-danger text-white text-sm font-bold shadow-lg shadow-danger/20 hover:shadow-danger/40 transition-all duration-300 active:scale-95 flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 linear"></div>
              <Phone className="w-4 h-4 animate-bounce" />
              EMERGENCY
              <div className="absolute inset-0 rounded-full animate-pulse-red opacity-50"></div>
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
           <button 
              onClick={() => scrollTo("complaint")} 
              className="p-2 rounded-full bg-danger text-white animate-pulse"
            >
              <Phone className="w-5 h-5" />
            </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] md:hidden bg-[#020617]/98 backdrop-blur-2xl flex flex-col p-8 pt-24"
          >
            <button className="absolute top-6 right-6 p-2 text-white/50 hover:text-white" onClick={() => setOpen(false)}>
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col gap-6">
              {links.map((l, i) => (
                <motion.button 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={l.id} 
                  onClick={() => scrollTo(l.id)} 
                  className="text-2xl font-black text-left hover:text-primary transition-colors tracking-tight uppercase italic"
                >
                  {l.label}
                </motion.button>
              ))}
              
              <div className="h-px bg-white/10 my-4"></div>

              <button
                onClick={() => { setDialerOpen(true); setOpen(false); }}
                className="flex items-center gap-4 text-2xl font-black text-left text-green-400 hover:text-green-300 tracking-tight uppercase italic"
              >
                <Phone className="w-6 h-6" /> CALL SUPPORT
              </button>
              
              <Link 
                to="/login"
                onClick={() => setOpen(false)}
                className="text-2xl font-black text-left hover:text-primary transition-colors flex items-center gap-4 tracking-tight uppercase italic"
              >
                <LogIn size={28} className="text-primary" /> LOGIN
              </Link>
              
              <Link 
                to="/signup"
                onClick={() => setOpen(false)}
                className="p-6 rounded-[2rem] bg-primary text-white font-black text-center flex items-center justify-center gap-3 text-lg shadow-[0_0_30px_rgba(0,168,232,0.2)]"
              >
                <UserPlus size={24} /> REQUEST ACCESS
              </Link>

              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => scrollTo("complaint")} 
                className="mt-4 p-6 rounded-[2rem] bg-danger text-white font-black text-center flex items-center justify-center gap-3 text-lg animate-pulse-red shadow-[0_0_30px_rgba(255,0,0,0.2)]"
              >
                <Phone size={24} /> REPORT EMERGENCY
              </motion.button>
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
