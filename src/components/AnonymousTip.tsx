import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Send, AlertCircle, Info, Hash, MapPin, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { submitTip } from "../lib/api";
import { TiltCard } from "./TiltCard";

const AnonymousTip = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "Drug Dealing",
    location: "",
    description: "",
  });

  const categories = [
    "Drug Dealing",
    "Suspicious Vehicle",
    "Harassment",
    "Theft",
    "Suspicious Activity",
    "Public Nuisance",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await submitTip(formData);
      if (res.success) {
        toast.success("Tip Submitted Successfully", {
          description: "Your information was sent anonymously to the neural grid.",
        });
        setFormData({ category: "Drug Dealing", location: "", description: "" });
      }
    } catch (err) {
      toast.error("Submission Failed", {
        description: "The neural grid is currently unreachable. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="witness" className="section-padding relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <EyeOff size={12} />
                ANONYMOUS CRIME TIP SYSTEM
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Report Without <span className="text-gradient">Retaliation</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
                Help us keep your neighborhood safe. Your identity is never stored and your tips are routed through our encrypted neural grid.
            </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
                <TiltCard className="card-premium p-8 border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Send size={150} />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tip Category</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 outline-none transition-all appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    {categories.map(c => <option key={c} value={c} className="bg-[#020617]">{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Incident Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 w-4 h-4" />
                                    <input 
                                        type="text" 
                                        placeholder="Address or Landmarks"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-primary/50 outline-none transition-all"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description of Activity</label>
                            <textarea 
                                rows={4}
                                placeholder="Please provide specific details: people involved, vehicle descriptions, time of day..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 outline-none transition-all resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
                             <Shield className="text-primary shrink-0 mt-1" size={20} />
                             <div className="text-[11px] text-muted-foreground leading-relaxed">
                                <span className="text-primary font-black uppercase">Identity Protected:</span> No IP addresses, device IDs, or personal metadata are captured during this submission. Your safety is our technical priority.
                             </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Send size={18} /> Send Anonymous Tip</>}
                        </button>
                    </form>
                </TiltCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="glass p-8 rounded-3xl border border-white/5">
                    <h4 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={20} /> Use with Care
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        False reports can divert critical resources. Please ensure your tip is based on observed facts.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Provide license plate numbers if applicable",
                            "Describe clothing and physical features",
                            "Note the frequency of the activity",
                            "Specify the exact location/corner"
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-center text-xs font-bold text-white/80">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-8 rounded-3xl bg-secondary/10 border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-colors">
                    <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Info size={100} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-widest mb-2">Neural Routing</h4>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                        Your tip is encrypted into an AES-256 package before leaving your browser and is decrypted ONLY within the Police Command Center's secure environment.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AnonymousTip;
