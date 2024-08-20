import React from 'react';
import { motion } from 'framer-motion';

const MobileLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-custom-bg">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-t-4 border-t-custom-box-text border-custom-box-bg rounded-full"
      ></motion.div>
    </div>
  );
};

export default MobileLoader;
