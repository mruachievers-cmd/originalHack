import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Sparkles, X, Plus, Image as ImageIcon, Mic } from "lucide-react";

const quickQuestions = [
  "How to file a digital FIR?",
  "Locate nearest precinct",
  "Women's safety protocols",
  "Check case milestone",
];

const responses: Record<string, string> = {
  "How to file a digital FIR?": "Initiating digital filing protocol... You can submit a formal complaint through our 'Citizen Complaint' module. Our AI will automatically categorize the incident and generate a crytographically signed FIR record for you.",
  "Locate nearest precinct": "Accessing geo-spatial data... Your nearest active command center is 'Sector-7 HQ' located at 12.4km from your current coordinates. Routing instructions have been sent to your primary device.",
  "Women's safety protocols": "Activating Sentinel Protocol briefing... In any threatening situation, use the SOS 'Life-Link' button. This triggers immediate GPS propagation, stealth recording, and dispatches the 3 closest mobile units.",
  "Check case milestone": "Querying investigative database... Please provide your 12-digit E-FIR tracking number to retrieve the current status, assigned officer details, and forensic progress updates.",
};

type Message = { role: "user" | "bot"; text: string; id: number };

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "bot", text: "Welcome to Guardian Net Intelligence. I am your tactical assistant. How can I facilitate your safety today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = responses[text] || "I have logged your query. Our secondary processing units are analyzing the request. For critical emergencies, please use the SOS module immediately.";
      const botMsg: Message = { id: Date.now() + 1, role: "bot", text: botResponse };
      setMessages((m) => [...m, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section id="support" className="section-padding relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            NEURAL ASSISTANT
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Intelligent <span className="text-gradient">Citizen Support</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Our advanced AI assistant provides instant answers to legal queries, safety protocols, and real-time status updates.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[600px] relative max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 p-2.5 shadow-lg shadow-primary/20">
                <Bot className="w-full h-full text-white" />
              </div>
              <div>
                <div className="font-black text-sm uppercase tracking-widest">Guardian AI</div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ACTIVE SESSION</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white transition-colors">
                 <Plus size={18} />
               </button>
               <button className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white transition-colors">
                 <X size={18} />
               </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                    m.role === "bot" 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "bg-white/5 border-white/10 text-muted-foreground"
                  }`}>
                    {m.role === "bot" ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  
                  <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-md px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        m.role === "user"
                          ? "bg-primary text-white rounded-tr-none font-medium"
                          : "bg-white/5 border border-white/5 text-foreground rounded-tl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[8px] font-black text-muted-foreground uppercase mt-2 tracking-widest opacity-50">
                      {m.role === "bot" ? "GUARDIAN ENGINE" : "AUTHORIZED USER"}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div className="bg-white/5 border border-white/5 px-5 py-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-300"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Area */}
          <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isTyping}
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex gap-3 items-center">
               <div className="flex gap-2">
                 <button className="p-3 rounded-2xl bg-white/5 text-muted-foreground hover:text-white transition-colors">
                   <Mic size={18} />
                 </button>
                 <button className="p-3 rounded-2xl bg-white/5 text-muted-foreground hover:text-white transition-colors">
                   <ImageIcon size={18} />
                 </button>
               </div>
               
               <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  className="w-full pl-6 pr-14 py-4 rounded-2xl bg-secondary border border-white/5 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Inquire with Guardian Net Intelligence..."
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-primary text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <Send className="w-4 h-4" />
                </button>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotSection;

