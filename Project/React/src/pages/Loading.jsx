
import React, {  useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Loading = () => {
  const [textIndex, setTextIndex] = useState(0);
  const loadingTexts = [
    "Discover the Incredible India",
    "Personalized adventures",
    "Bookings powered by inexTrip"
  ];


  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=2070"
          className="w-full h-full object-cover blur-sm"
          alt="India Landscape"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="inline-block px-6 py-2 bg-indigo-600/20 backdrop-blur-md border border-indigo-400/30 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-xl">
            InexTrip-A Smart Trip Planning System
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[0.85] tracking-tighter">
            <span className="block mb-2">Trip </span>
            <span className="block bg-gradient-to-r from-indigo-400 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
              Planner
            </span>
          </h1>
        </motion.div>

        {/* Dynamic Messaging */}
        <div className="h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={textIndex}
              initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -30, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight max-w-2xl">
                {loadingTexts[textIndex]}
              </h3>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: textIndex === i ? 32 : 8,
                      backgroundColor: textIndex === i ? "#6366f1" : "rgba(255,255,255,0.2)"
                    }}
                    className="h-1.5 rounded-full transition-all duration-500"
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mt-16 w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-white/30" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Initializing Global Registry</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
