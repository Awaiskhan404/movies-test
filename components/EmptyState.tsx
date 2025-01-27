// components/EmptyState.tsx
import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center py-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className="font-montserrat text-[48px] font-semibold leading-[56px] text-center mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        Your movie list is empty
      </motion.h2>
      <motion.button 
        className="font-montserrat text-[16px] font-bold leading-[24px] text-center px-8 py-4 bg-[#2BD17E] text-white rounded-lg hover:bg-green-600 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add a new movie
      </motion.button>
    </motion.div>
  );
};

export default EmptyState;