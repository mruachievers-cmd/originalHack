import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, CheckCircle, MapPin, User, MessageSquare } from "lucide-react";

const ComplaintForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const firNumber = `FIR-${Date.now().toString().slice(-8)}`;

  return (
    <section id="complaint" className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Report</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Citizen Complaint System</h2>
          <p className="text-muted-foreground mt-3">File your complaint digitally with instant FIR generation</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-6 md:p-8 space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <input
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="Incident location"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4" /> Complaint Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                  placeholder="Describe the incident in detail..."
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 px-5 py-3 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Evidence</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all glow-cyan flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Submit Complaint
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="fir"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Complaint Submitted!</h3>
              <p className="text-muted-foreground mb-6">Your FIR has been generated successfully</p>
              <div className="glass rounded-xl p-6 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">FIR Number</span>
                  <span className="text-sm font-mono text-primary font-semibold">{firNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm">{form.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm">{form.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm text-primary font-medium">Under Review</span>
                </div>
              </div>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", location: "", description: "" }); }}
                className="mt-6 px-6 py-2.5 rounded-lg glass text-sm font-medium hover:bg-card/80 transition-colors"
              >
                File Another Complaint
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ComplaintForm;
