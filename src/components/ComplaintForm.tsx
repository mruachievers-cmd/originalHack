import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, CheckCircle, MapPin, User, MessageSquare, ShieldCheck, Download, Printer, Share2, Info } from "lucide-react";

const ComplaintForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", description: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 1500);
  };

  const firNumber = `FIR-2026-${Math.floor(Math.random() * 90000) + 10000}`;
  const timestamp = new Date().toLocaleString();

  return (
    <section id="complaint" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 animate-float"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <ShieldCheck size={12} />
            E-GOVERNANCE PORTAL
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Digital <span className="text-gradient">FIR System</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Report incidents instantly and securely. Our AI-driven system generates an official FIR record within seconds.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid lg:grid-cols-5 gap-8 bg-white/5 border border-white/10 rounded-[2.5rem] p-4 md:p-8"
            >
              <div className="lg:col-span-3 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                          placeholder="Ex: Kavya Sri"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Incident Location</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          required
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                          placeholder="Ex: MG Road, Bengaluru"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Incident Description</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <textarea
                        required
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none resize-none transition-all"
                        placeholder="Please provide specific details about the event..."
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-4 text-center group hover:bg-white/[0.08] transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    <div className={`p-4 rounded-full bg-primary/10 text-primary ${isUploading ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`}>
                      <Upload size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{isUploading ? 'Uploading Evidence...' : 'Upload Evidence'}</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">Images, Video, or Audio (MAX 50MB)</div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-cyan-500 text-white font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <FileText className="w-5 h-5" />
                    GENERATE E-FIR
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-primary/10 border border-primary/20 rounded-[2rem] p-8 flex flex-col justify-center gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Info size={28} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Instant Verification</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every FIR filed through the Guardian Net portal is automatically time-stamped, geo-tagged, and encrypted to ensure the integrity of the evidence.
                </p>
                <div className="space-y-4 pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <CheckCircle size={16} className="text-primary" />
                    <span>Instant Digital Record</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <CheckCircle size={16} className="text-primary" />
                    <span>Real-time Officer Assignment</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <CheckCircle size={16} className="text-primary" />
                    <span>Legal ADMISSIBLE Evidence</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fir-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                 <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                   <CheckCircle size={40} />
                 </div>
                 <h3 className="text-3xl font-black mb-2 tracking-tight">E-FIR GENERATED</h3>
                 <p className="text-muted-foreground">Digital record has been securely stored in the central database.</p>
              </div>

              {/* Mock FIR Card */}
              <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden font-sans group">
                {/* Security Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
                
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-900/10 pb-6 mb-6 relative z-10">
                   <div className="flex items-center gap-3">
                     <ShieldCheck className="w-10 h-10 text-primary" />
                     <div>
                       <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60">GOVERNMENT OF INDIA</div>
                       <div className="text-lg font-black leading-tight">POLICE DEPARTMENT</div>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="text-[10px] font-black uppercase opacity-60">SERIAL NUMBER</div>
                     <div className="font-mono font-bold text-primary">{firNumber}</div>
                   </div>
                </div>

                {/* Content */}
                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-[10px] font-black uppercase opacity-50 mb-1">COMPLAINANT</div>
                      <div className="font-bold border-b border-slate-900/5 pb-2 uppercase">{form.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase opacity-50 mb-1">DATETIME OF REPORT</div>
                      <div className="font-bold border-b border-slate-900/5 pb-2 uppercase">{timestamp}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase opacity-50 mb-1">PLACE OF OCCURRENCE</div>
                    <div className="font-bold border-b border-slate-900/5 pb-2 uppercase">{form.location}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase opacity-50 mb-1">INCIDENT SUMMARY</div>
                    <p className="text-sm italic font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-900/5">
                      &quot;{form.description}&quot;
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="flex flex-col items-center">
                       <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center mb-2 border border-slate-900/10">
                         <div className="w-16 h-16 border-2 border-slate-900/20 rounded flex items-center justify-center rotate-3">
                           <span className="text-[8px] font-bold opacity-30 text-center uppercase">OFFICIAL SEAL</span>
                         </div>
                       </div>
                       <div className="text-[8px] font-black uppercase opacity-40">DIGITAL SIGNATURE ID: 8X7F2</div>
                    </div>
                    <div className="flex flex-col justify-end">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <span className="text-[10px] font-black uppercase">STATUS: VERIFIED</span>
                       </div>
                       <div className="text-[10px] font-black uppercase opacity-50">E-GOVERNANCE TOKEN: 4920-X12-Q</div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"><Download size={14}/></button>
                   <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"><Printer size={14}/></button>
                   <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"><Share2 size={14}/></button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button
                  className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                >
                  DOWNLOAD AS PDF
                </button>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", location: "", description: "" }); }}
                  className="px-8 py-3 rounded-2xl bg-primary text-white font-bold hover:brightness-110 transition-all"
                >
                  FILE NEW COMPLAINT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ComplaintForm;

