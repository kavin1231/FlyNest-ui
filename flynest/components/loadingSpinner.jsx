import React from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export default LoadingSpinner;


const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Airplane */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="mb-8"
        >
          <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center">
            <Plane className="h-10 w-10 text-slate-900" />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl font-semibold mb-4"
        >
          {message}
        </motion.h2>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 gold-gradient"
          />
        </div>
      </div>
    </div>
  );
};
