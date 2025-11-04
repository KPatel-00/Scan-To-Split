import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import heroAnimation from '../../animations/hero-scan-receipt.json';

const gentleLand = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 25,
};

export function HeroAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...gentleLand,
        delay: 0.1, // Stagger after text content
      }}
      className="flex items-center justify-center"
    >
      <div className="relative w-full max-w-[600px]">
        <Lottie
          animationData={heroAnimation}
          loop={true}
          autoplay={true}
          className="w-full h-auto"
          style={{
            maxWidth: 600,
            height: 'auto',
          }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet',
            className: 'hero-lottie-animation',
          }}
        />
        
        {/* Decorative gradient overlay for premium feel */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(circle at center, transparent 40%, hsl(var(--background)) 100%)',
            opacity: 0.3,
          }}
        />
      </div>
    </motion.div>
  );
}
