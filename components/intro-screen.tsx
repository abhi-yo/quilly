"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface IntroScreenProps {
  onComplete?: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setCurrentStep(1), 1500);
    const timer3 = setTimeout(() => setCurrentStep(2), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleEnter = () => {
    setCurrentStep(3);
    setTimeout(() => {
      onComplete?.();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Radial Gradients */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.4) 0%, transparent 50%), 
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), 
              radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)
            `,
          }} />
        </div>
        
        {/* Geometric Accent */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/5 rounded-full" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/5 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/10 rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white/10 rounded-full" />
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        <AnimatePresence mode="wait">
          {showContent && (
            <>
              {/* Logo Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  duration: 1.2  
                }}
                className="mb-4"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
                  <PenTool className="w-10 h-10 text-black" strokeWidth={1.5} />
                </div>
              </motion.div>

              {/* App Name */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-3"
              >
                <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight leading-none">
                  Blog
                </h1>
              </motion.div>

              {/* Tagline Sequence */}
              <div className="h-16 flex items-center justify-center mb-8">
                <AnimatePresence mode="wait">
                  {currentStep >= 1 && (
                    <motion.p
                      key="tagline"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                      className="text-xl md:text-2xl text-gray-400 font-light tracking-wide"
                    >
                      Where stories come to life
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Button */}
              <AnimatePresence mode="wait">
                {currentStep >= 2 && (
                  <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} 
                  >
                    <Button
                      onClick={handleEnter}
                      className="group relative bg-gradient-to-b from-white via-gray-50 to-gray-100 text-black hover:from-gray-50 hover:via-gray-100 hover:to-gray-200 text-lg px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-2xl shadow-black/20 border border-gray-200/50 hover:shadow-3xl hover:shadow-black/30 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/60 before:via-transparent before:to-transparent before:pointer-events-none"
                    >
                      Enter
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{ 
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              scale: 0 
            }}
            animate={{ 
              scale: [0, 1, 0],
              y: [null, Math.random() * dimensions.height]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Exit Transition */}
      <AnimatePresence>
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black z-20"
          />
        )}
      </AnimatePresence>
    </div>
  );
} 