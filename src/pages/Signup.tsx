import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, UserPlus, ChevronLeft, MapPin, BadgeCheck } from "lucide-react";
import { signupCitizen } from "../lib/api";
import { toast } from "sonner";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        await signupCitizen(formData);
        toast.success("Registration Successful. Please login with your badge.");
        setTimeout(() => {
            navigate("/login");
        }, 1500);
    } catch (err: any) {
        toast.error(err.message || "Registration Failed. Email might be already in use.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors group z-10"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO COMMAND CENTER
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg mt-12"
      >
        <div className="card-premium p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
               <UserPlus size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic mb-2">Request Access</h1>
            <p className="text-white/40 text-sm font-medium tracking-wide">Register your badge for neural grid access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 ml-1 flex items-center gap-2">
                        <BadgeCheck size={12} className="text-primary" /> Full Name
                    </label>
                    <input 
                        type="text" 
                        required
                        placeholder="Officer Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 ml-1 flex items-center gap-2">
                        <MapPin size={12} className="text-primary" /> Assigned Unit
                    </label>
                    <input 
                        type="text" 
                        required
                        placeholder="Precinct / Unit ID"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 ml-1 flex items-center gap-2">
                  <Shield size={12} className="text-primary" /> Official Email Header
              </label>
              <input 
                type="email" 
                required
                placeholder="officer.id@guardian.gov"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 ml-1">Secure Protocol Initialization</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="CREATE ACCESS KEY"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 mx-1">
                <div className="w-5 h-5 rounded-md border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-sm opacity-50"></div>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-wider">
                    By submitting, I agree to follow the <span className="text-white hover:text-primary transition-colors cursor-pointer underline underline-offset-2">Neural Grid Code of Conduct</span> and acknowledge that all actions are tracked.
                </p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,168,220,0.3)] hover:shadow-[0_0_30px_rgba(0,168,220,0.5)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <BadgeCheck size={20} />
                  Initiate Request
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-white/40 text-xs font-medium">
              Already have access? <Link to="/login" className="text-primary font-black hover:underline underline-offset-4 decoration-2">Badge Login</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
