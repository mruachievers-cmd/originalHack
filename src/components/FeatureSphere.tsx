import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Scan, ShieldAlert, Map, MessageSquareDot, FileText, ArrowUpRight } from 'lucide-react';

const features = [
  { id: 1, icon: <LayoutDashboard className="w-6 h-6" />, title: 'Police Dashboard', description: 'Real-time incident monitoring and unit dispatch command station.', color: 'emerald' },
  { id: 2, icon: <Scan className="w-6 h-6" />, title: 'AI Criminal Scanner', description: 'Facial recognition and criminal record matching via live CCTV feed.', color: 'blue' },
  { id: 3, icon: <ShieldAlert className="w-6 h-6" />, title: 'Women Safety SOS', description: 'One-tap emergency alerts with live location sharing to nearest units.', color: 'rose' },
  { id: 4, icon: <Map className="w-6 h-6" />, title: 'Smart Safety Map', description: 'Tactical heatmap and crime prediction using historical data logic.', color: 'cyan' },
  { id: 5, icon: <MessageSquareDot className="w-6 h-6" />, title: 'AI Chatbot', description: 'Intelligent assistant for FIR filing and basic legal procedures.', color: 'amber' },
  { id: 6, icon: <FileText className="w-6 h-6" />, title: 'FIR System', description: 'End-to-end digital FIR filing with cryptographic hash verification.', color: 'indigo' },
];

export const FeatureSphere = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group bg-white p-8 rounded-[2rem] border border-primary/10 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500 border border-primary/5 group-hover:border-primary/20`}>
                            {feature.icon}
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic">
                                {feature.title}
                            </h3>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300" />
                        </div>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                            {feature.description}
                        </p>
                    </div>

                    {/* Bottom indicator */}
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-transparent w-0 group-hover:w-full transition-all duration-700" />
                </motion.div>
            ))}
        </div>
    );
};
