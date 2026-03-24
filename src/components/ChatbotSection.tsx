import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, X, Plus, Image as ImageIcon, Mic } from "lucide-react";

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

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  }, [messages, isTyping, isOpen]);

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
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 0, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[calc(100vw-48px)] max-w-[400px] h-[550px] max-h-[70vh] glass-strong rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden bg-[#020617]/95 backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 p-2 shadow-lg shadow-primary/20 flex items-center justify-center">
                  <Bot className="w-full h-full text-white" />
                </div>
                <div>
                  <div className="font-black text-sm uppercase tracking-widest">Guardian AI</div>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">ACTIVE SESSION</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white transition-colors">
                 <X size={16} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                      m.role === "bot" 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-white/5 border-white/10 text-muted-foreground"
                    }`}>
                      {m.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    
                    <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          m.role === "user"
                            ? "bg-primary text-white rounded-tr-none font-medium"
                            : "bg-white/5 border border-white/5 text-foreground rounded-tl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[7px] font-black text-muted-foreground uppercase mt-1.5 tracking-widest opacity-50">
                        {m.role === "bot" ? "GUARDIAN ENGINE" : "AUTHORIZED USER"}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-300"></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls Area */}
            <div className="p-4 bg-white/5 border-t border-white/5 space-y-3">
              {/* Quick Suggestions */}
              <div className="flex pr-2 overflow-x-auto gap-2 scrollbar-hide pb-1">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isTyping}
                    className="text-[9px] whitespace-nowrap font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex gap-2 items-center">
                 <div className="flex gap-1">
                   <button className="p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white transition-colors">
                     <Plus size={16} />
                   </button>
                 </div>
                 
                 <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-secondary border border-white/5 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-all text-xs"
                    placeholder="Inquire with Guardian Net..."
                  />
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_20px_rgba(0,168,232,0.4)] hover:scale-110 transition-transform relative z-[100]"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && (
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;

