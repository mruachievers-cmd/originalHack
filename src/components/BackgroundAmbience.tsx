import React from "react";
import { motion } from "framer-motion";

const BackgroundAmbience = () => {
  const images = [
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?auto=format&fit=crop&q=80&w=2000"
  ];

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Primary Gradient Overlay */}
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Floating Tactical Images */}
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: [0.03, 0.08, 0.03],
            scale: [1.1, 1.2, 1.1]
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{
            top: `${(i * 25) % 100}%`,
            left: `${(i * 35) % 100}%`,
            width: '60vw',
            height: '60vh',
            filter: 'blur(100px)',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay'
          }}
        />
      ))}

      {/* Modern Low Linear Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,background_100%)] opacity-60" />
    </div>
  );
};

export default BackgroundAmbience;
