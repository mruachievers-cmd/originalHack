import { motion } from "framer-motion";
import { AlertTriangle, FileText, Siren, Activity, TrendingUp, Bell } from "lucide-react";

const stats = [
  { icon: Siren, label: "Active Alerts", value: "12", trend: "+3", color: "text-danger" },
  { icon: FileText, label: "Complaints Today", value: "47", trend: "+8", color: "text-primary" },
  { icon: AlertTriangle, label: "Crime Reports", value: "156", trend: "-5", color: "text-warning" },
  { icon: Activity, label: "Response Rate", value: "94%", trend: "+2%", color: "text-[hsl(var(--success))]" },
];

const alerts = [
  { text: "Emergency reported near Central Market", time: "2 min ago", severity: "high" },
  { text: "Suspicious activity detected on Cam-07", time: "5 min ago", severity: "medium" },
  { text: "FIR #2847 assigned to Officer Sharma", time: "12 min ago", severity: "low" },
  { text: "SOS alert from Women Safety Module", time: "18 min ago", severity: "high" },
];

const DashboardPreview = () => (
  <section className="section-padding">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">Dashboard</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">Police Command Center</h2>
        <p className="text-muted-foreground mt-3">Real-time overview for law enforcement</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-6 max-w-5xl mx-auto"
      >
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-secondary rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-xs text-[hsl(var(--success))] flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> {s.trend}
                </span>
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Live Notifications</span>
          </div>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    a.severity === "high" ? "bg-danger" : a.severity === "medium" ? "bg-warning" : "bg-primary"
                  }`}
                />
                <span className="text-sm flex-1">{a.text}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default DashboardPreview;
