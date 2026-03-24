import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, LogIn, ChevronLeft } from "lucide-react";
import { loginCitizen, loginOfficer } from "../lib/api";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"officer" | "citizen">("officer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [badgeId, setBadgeId] = useState("");
  const [station, setStation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (loginType === "citizen") {
          await loginCitizen({ email, password });
        } else {
          await loginOfficer({ badge_id: badgeId, station });
        }

        // Only reach here if API call is successful
        localStorage.setItem("gn_auth", "true");
        localStorage.setItem("user_type", loginType);
        toast.success("Authentication Successful. Redirecting to Neural Grid...");
        setTimeout(() => {
            if (loginType === "officer") {
                navigate("/police-dashboard");
            } else {
                navigate("/");
            }
            window.location.reload(); 
        }, 1000);
    } catch (err: any) {
        toast.error(err.message || "Authentication Failed. Please check your credentials.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="card-premium p-10 relative overflow-hidden group bg-white border border-primary/20 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
               <Shield size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic mb-2 text-foreground">Guardian Auth</h1>
            
            {/* Login Type Switcher */}
            <div className="flex bg-secondary/20 p-1 rounded-xl mt-4 w-full">
              <button 
                onClick={() => setLoginType("officer")}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${loginType === 'officer' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Police Officer
              </button>
              <button 
                onClick={() => setLoginType("citizen")}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${loginType === 'citizen' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Citizen
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {loginType === "officer" ? (
              <>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Officer Badge ID</label>
                  <input 
                    type="text" 
                    required
                    placeholder="GN-XXXX-XXXX"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full bg-secondary/10 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white outline-none transition-all placeholder:text-muted-foreground/30"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Assigned Station</label>
                  <input 
                    type="text" 
                    required
                    placeholder="CENTRAL PRECINCT 01"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    className="w-full bg-secondary/10 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white outline-none transition-all placeholder:text-muted-foreground/30"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Citizen Access ID</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/10 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Access Protocol</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-secondary/10 border border-primary/10 rounded-2xl px-5 py-4 text-sm font-medium focus:border-primary/50 focus:bg-white outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  Initiate Session
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-secondary/20 pt-8">
            {loginType === "citizen" && (
              <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                New user? <Link to="/signup" className="text-primary hover:underline font-extrabold">Register Citizen Profile</Link>
              </p>
            )}
            {loginType === "officer" && (
                <p className="text-muted-foreground/60 text-[10px] font-black tracking-widest uppercase italic">
                    Restricted Personnel Access Only
                </p>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
            <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">End-to-End Encryption</span>
            <div className="w-1 h-1 rounded-full bg-primary/30"></div>
            <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Secure Auth Platform</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
