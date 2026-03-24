import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";

const quickQuestions = [
  "How to file a complaint?",
  "Where is the nearest police station?",
  "What to do in emergency?",
  "How to track my FIR status?",
];

const responses: Record<string, string> = {
  "How to file a complaint?": "You can file a complaint through our digital system above. Fill in your details, describe the incident, upload evidence, and submit. An FIR number will be generated instantly.",
  "Where is the nearest police station?": "Based on your location, the nearest police station is Central District HQ, approximately 1.2 km away. You can view all stations on our Smart Safety Map.",
  "What to do in emergency?": "In an emergency: 1) Press the SOS button for immediate alert. 2) Call 112 for emergency services. 3) Share your live location with trusted contacts. 4) Stay in a safe place until help arrives.",
  "How to track my FIR status?": "You can track your FIR status using the FIR number provided at submission. Visit the complaint tracker section or contact your assigned officer directly.",
};

type Message = { role: "user" | "bot"; text: string };

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! I'm Guardian Net AI Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    const botResponse = responses[text] || "Thank you for your question. Our team will get back to you shortly. For immediate assistance, please call 112.";
    const botMsg: Message = { role: "bot", text: botResponse };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  };

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">AI Support</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Police & Citizen Support</h2>
          <p className="text-muted-foreground mt-3">AI-powered chatbot for instant assistance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">Guardian Net AI</div>
              <div className="text-xs text-primary">Online</div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick questions */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-full glass hover:bg-card/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Type your question..."
            />
            <button
              onClick={() => handleSend(input)}
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatbotSection;
