'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const dotVariants = {
  animate: {
    opacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'easeInOut',
      staggerChildren: 0.2,
    },
  },
};

const thinkingStates = [
  'Retrieving Documents',
  'Computing',
  'Vectorizing Query',
  'Processing'
];

export default function ThinkingBubble() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % thinkingStates.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="bg-[#111111] px-4 py-2 rounded-2xl text-xs flex items-center gap-2">
        <Loader2 className="animate-spin h-3 w-3 text-neutral-400" />
        <motion.span
          key={currentTextIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-neutral-400"
        >
          {thinkingStates[currentTextIndex]}
        </motion.span>
        <motion.div className="flex gap-1 ml-1" variants={dotVariants} animate="animate">
          <motion.span className="text-neutral-400">.</motion.span>
          <motion.span className="text-neutral-400">.</motion.span>
          <motion.span className="text-neutral-400">.</motion.span>
        </motion.div>
      </div>
    </div>
  );
}
