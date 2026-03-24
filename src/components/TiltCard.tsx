import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const lx = (e.clientX - rect.left) / rect.width - 0.5;
    const ly = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(lx);
    y.set(ly);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative perspective-[1500px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8, rotateX: 0, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 5, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      <div 
        className="relative z-10 transition-shadow duration-500 rounded-3xl"
        style={{ transform: 'translateZ(80px)' }} // Lift everything inside more significantly
      >
        {children}
        
        {/* Glow effect on hover */}
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 blur-xl z-[-1] pointer-events-none"
          />
        )}
      </div>

      {/* Depth Shadow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-1/5 bg-cyan-500/10 blur-[60px] filter saturate-[1.5] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
};
