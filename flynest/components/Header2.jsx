import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header2 = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 gold-gradient rounded-full"
            >
              <img
                src="/flynestlogo.png"
                alt="Logo"
                className="h-6 w-6 object-contain"
              />
            </motion.div>
            <span className="text-2xl font-bold text-white">FlyNest</span>
          </div>

          {/* Log Out Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-6 py-2 gold-gradient text-slate-900 font-semibold rounded-full hover:shadow-lg transition-shadow"
          >
            Log Out
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header2;