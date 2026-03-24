import { motion } from "framer-motion";
import { AlertTriangle, FileText, Siren, Activity, TrendingUp, Bell, Shield, MapPin, Search } from "lucide-react";

const stats = [
  { icon: Siren, label: "Active Alerts", value: "12", trend: "+3", color: "text-rose-500", glow: "shadow-rose-500/20" },
  { icon: FileText, label: "Complaints Today", value: "47", trend: "+8", color: "text-cyan-500", glow: "shadow-cyan-500/20" },
  { icon: AlertTriangle, label: "Crime Reports", value: "156", trend: "-5", color: "text-amber-500", glow: "shadow-amber-500/20" },
  { icon: Activity, label: "Response Rate", value: "94%", trend: "+2%", color: "text-emerald-500", glow: "shadow-emerald-500/20" },
];

const alerts = [
  { text: "Emergency reported near Central Market", time: "2 min ago", severity: "high", location: "Sector 4" },
  { text: "Suspicious activity detected on Cam-07", time: "5 min ago", severity: "medium", location: "Downtown" },
  { text: "FIR #2847 assigned to Officer Sharma", time: "12 min ago", severity: "low", location: "Station 1" },
  { text: "SOS alert from Women Safety Module", time: "18 min ago", severity: "high", location: "West Block" },
];

const DashboardPreview = () => (
  <section className="section-padding relative">
    <div className="absolute top-1/2 left-0 w-full h-96 bg-primary/5 blur-[150px] -z-10"></div>
    
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-widest mb-4">
          <Activity size={12} />
          LIVE COMMAND CENTER
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          Police Headquarters <span className="text-gradient">Real-time Feed</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Our proprietary command center interface gives law enforcement officers the tools they need for instant situational awareness.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="glass-strong rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden max-w-6xl mx-auto"
      >
        {/* Background grid decorative */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Top Header UI */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Shield className="text-primary w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">SYSTEM STATUS</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-bold text-sm">OPERATIONAL</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
             <div className="px-4 py-2 text-xs font-bold text-muted-foreground border-r border-white/10">MAR 24, 2026</div>
             <div className="px-4 py-2 text-xs font-bold text-primary">11:58:34 GMT+5:30</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`bg-white/5 border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/10 shadow-xl ${s.glow}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={10} /> {s.trend}
                </span>
              </div>
              <div className="text-3xl font-black mb-1">{s.value}</div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tactical Operational Mockup Image */}
        <div className="mb-12 relative rounded-[2rem] overflow-hidden border border-white/10 aspect-[21/9] group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Police Command Center" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Activity size={12} className="animate-pulse" /> Live Terminal 04
                    </div>
                </div>
            </div>
        </div>

        {/* Main Dashboard Body */}
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {/* Notifications feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <h4 className="font-black text-sm uppercase tracking-widest">LIVE INCIDENT FEED</h4>
              </div>
              <button className="text-[10px] font-black text-primary hover:underline">VIEW ALL FEED</button>
            </div>
            
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group"
                >
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      a.severity === "high" ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : 
                      a.severity === "medium" ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : 
                      "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{a.text}</div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1"><MapPin size={10} /> {a.location}</span>
                      <span>{a.time}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                    <Search size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right sidebar UI elements */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
              <h4 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={14} className="text-primary" /> ANALYTICS OVERVIEW
              </h4>
              <div className="space-y-6">
                {[
                  { label: "AI Scanner Accuracy", val: 98, color: "bg-cyan-500" },
                  { label: "Community Trust Score", val: 82, color: "bg-emerald-500" },
                  { label: "Incident Resolution", val: 89, color: "bg-indigo-500" },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span>{p.label}</span>
                      <span className="text-primary">{p.val}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.val}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${p.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-transparent border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                 <Shield size={60} />
               </div>
               <h4 className="font-black text-xs uppercase tracking-widest mb-2 relative z-10">ENCRYPTED CONNECTION</h4>
               <p className="text-[10px] text-muted-foreground leading-relaxed mb-4 relative z-10">All command center data is protected by military-grade AES-256 encryption protocol.</p>
               <div className="flex items-center gap-2 text-[10px] font-black text-primary relative z-10">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                 SECURE SESSION ACTIVE
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default DashboardPreview;

