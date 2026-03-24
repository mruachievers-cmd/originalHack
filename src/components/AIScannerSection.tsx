import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, AlertTriangle, User, FileWarning } from "lucide-react";

const AIScannerSection = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setResult(false);
    setTimeout(() => {
      setScanning(false);
      setResult(true);
    }, 3000);
  };

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">AI Detection</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Criminal Identification System</h2>
          <p className="text-muted-foreground mt-3">AI-powered facial recognition for real-time suspect identification</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Camera Frame */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="aspect-[4/3] rounded-xl bg-secondary relative overflow-hidden flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary" />

              {/* Scan line */}
              {scanning && (
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              )}

              {/* Face placeholder */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground/30" />
                </div>
                {scanning && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>

              {/* Status bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  {scanning ? "SCANNING..." : "READY"}
                </span>
                <span className="text-xs font-mono text-primary">CAM-01</span>
              </div>
            </div>

            <button
              onClick={handleScan}
              disabled={scanning}
              className="mt-4 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ScanFace className="w-5 h-5" />
              {scanning ? "Scanning..." : "Scan Person"}
            </button>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ScanFace className="w-5 h-5 text-primary" />
              Scan Results
            </h3>

            <AnimatePresence mode="wait">
              {!result && !scanning && (
                <motion.div key="empty" className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <ScanFace className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Click "Scan Person" to begin</p>
                </motion.div>
              )}

              {scanning && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full"
                  />
                  <p className="text-sm text-muted-foreground mt-4">Analyzing facial features...</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                    <span className="text-sm text-danger font-medium">Match Found — Wanted Individual</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Name", value: "John Doe (Example)" },
                      { label: "Status", value: "Wanted", accent: true },
                      { label: "Criminal Record", value: "Theft / Assault" },
                      { label: "Last Seen", value: "Downtown Area, 2 days ago" },
                      { label: "Confidence", value: "94.7%" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className={`text-sm font-medium ${item.accent ? "text-danger" : ""}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <FileWarning className="w-4 h-4 text-warning" />
                    <span className="text-xs text-muted-foreground">This is a demo simulation only</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIScannerSection;
