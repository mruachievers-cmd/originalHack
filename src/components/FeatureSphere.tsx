import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, ContactShadows, PresentationControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Scan, ShieldAlert, Map, MessageSquareDot, FileText } from 'lucide-react';
import * as THREE from 'three';

const features = [
  { id: 1, icon: <LayoutDashboard className="w-8 h-8" />, title: 'Police Dashboard', description: 'Real-time incident monitoring and unit dispatch command station.' },
  { id: 2, icon: <Scan className="w-8 h-8" />, title: 'AI Criminal Scanner', description: 'Facial recognition and criminal record matching via live CCTV feed.' },
  { id: 3, icon: <ShieldAlert className="w-8 h-8" />, title: 'Women Safety SOS', description: 'One-tap emergency alerts with live location sharing to nearest units.' },
  { id: 4, icon: <Map className="w-8 h-8" />, title: 'Smart Safety Map', description: 'Tactical heatmap and crime prediction using historical data analysis.' },
  { id: 5, icon: <MessageSquareDot className="w-8 h-8" />, title: 'AI Chatbot', description: 'Intelligent assistant for FIR filing and basic legal procedures.' },
  { id: 6, icon: <FileText className="w-8 h-8" />, title: 'FIR System', description: 'End-to-end digital FIR filing with cryptographic hash verification.' },
];

const FeatureIcon = ({ feature, index, total, onSelect, activeIndex }: any) => {
  const meshRef = useRef<THREE.Group>(null!);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3.5;

  useFrame((state) => {
    // Keep icons horizontal relative to the camera
    meshRef.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group 
      ref={meshRef} 
      position={[Math.sin(angle) * radius, Math.cos(angle) * 0.5, Math.cos(angle) * radius]}
      onClick={() => onSelect(index)}
    >
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={activeIndex === index ? "#00d7ff" : "#0A1F44"} 
          emissive={activeIndex === index ? "#00d7ff" : "#000000"}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Html center transform distanceFactor={10}>
        <div className={`p-4 rounded-full transition-all duration-300 pointer-events-none ${activeIndex === index ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(0,215,255,0.4)] border border-cyan-400/50' : 'bg-slate-900/50 text-slate-400 border border-slate-700'}`}>
          {feature.icon}
        </div>
      </Html>
    </group>
  );
};

const SphereCore = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const [activeIndex, setActiveIndex] = useState(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.2; // Slow manual rotation
    
    // Calculate which one is in front (+ Math.PI for adjustment)
    const normalizedRotation = (-groupRef.current.rotation.y % (Math.PI * 2)) + (Math.PI * 2);
    const index = Math.round((normalizedRotation % (Math.PI * 2)) / (Math.PI * 2) * features.length) % features.length;
    
    if (index !== activeIndex) {
        setActiveIndex(index);
    }
  });

  return (
    <group ref={groupRef}>
      {features.map((f, i) => (
        <FeatureIcon 
          key={f.id} 
          feature={f} 
          index={i} 
          total={features.length} 
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      ))}
      {/* Core Energy Sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color="#00A8E8" 
          emissive="#00d7ff" 
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

export const FeatureSphere = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative w-full min-h-[600px] flex flex-col lg:flex-row items-center justify-center bg-[#050B18]/50 rounded-[3rem] overflow-hidden border border-slate-800 backdrop-blur-sm group p-4 lg:p-12 gap-8">
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative z-0">
                <Canvas camera={{ position: [0, 2, 12], fov: 40 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d7ff" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#ff0080" />
                    
                    <PresentationControls 
                        global 
                        rotation={[0.13, 0.1, 0]} 
                        polar={[-0.4, 0.2]} 
                        azimuth={[-1, 1.75]} 
                        snap
                    >
                        <SphereCore />
                    </PresentationControls>
                    <ContactShadows resolution={512} scale={30} position={[0, -5, 0]} blur={2} opacity={0.2} color="#00d7ff" />
                </Canvas>
            </div>

            {/* Feature Card UI */}
            <div className="w-full lg:w-1/2 h-full z-10 flex items-center justify-center lg:justify-start">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={features[activeIndex].id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,168,232,0.1)] flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg"
                    >
                        <div className="p-5 rounded-3xl bg-cyan-500/10 text-cyan-400 mb-8 border border-cyan-500/20">
                            {features[activeIndex].icon}
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase italic">
                            {features[activeIndex].title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed text-xl font-medium">
                            {features[activeIndex].description}
                        </p>
                        
                        <div className="mt-8 flex items-center gap-3 text-cyan-500/60 text-xs font-bold uppercase tracking-widest">
                           <div className="w-12 h-[1px] bg-cyan-500/30"></div>
                           Active Feature
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Guide Text */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase pointer-events-none group-hover:text-cyan-400 transition-all duration-500">
               Interactive Neural Core
            </div>
        </div>
    );
};
