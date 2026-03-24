import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("gn_theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    const newIsLight = !isLight;
    setIsLight(newIsLight);
    
    if (newIsLight) {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("gn_theme", "light");
    } else {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("gn_theme", "dark");
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[10000] flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative w-12 h-24 rounded-full transition-colors duration-500 overflow-hidden flex flex-col items-center justify-between py-2 ${
            isLight ? "bg-amber-500/20 border-amber-500/40" : "bg-primary/20 border-primary/40"
          } border`}
        >
          <motion.div
            animate={{ y: isLight ? -5 : 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
              isLight ? "bg-amber-500 text-white" : "bg-primary text-navy"
            }`}
          >
            {isLight ? <Sun size={20} /> : <Moon size={20} />}
          </motion.div>
          
          <div className={`text-[8px] font-black uppercase tracking-tight transition-opacity ${isLight ? 'opacity-100 text-amber-600' : 'opacity-30 text-white'}`}>
             Light
          </div>
          <div className={`text-[8px] font-black uppercase tracking-tight transition-opacity ${!isLight ? 'opacity-100 text-primary' : 'opacity-30 text-slate-400'}`}>
             Dark
          </div>
        </motion.button>
        
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground vertical-text py-2">
            System Theme
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
