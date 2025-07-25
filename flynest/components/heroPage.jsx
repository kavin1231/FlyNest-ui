import React from "react";
import { motion } from "framer-motion";

export default function HeroPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6">
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main content container */}
      <div className="relative z-10 text-center max-w-5xl w-full">
        {/* Heading */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12 px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            <span className="block">Find And Book</span>
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              A Great Experience
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Discover the world with SkyVoyage. Premium flights, exceptional
            service, and unforgettable journeys await you.
          </p>
        </motion.div>

        {/* Glassmorphism Box with Static Clouds & Big Airplane */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 5, ease: "easeOut" }}
          className="relative mx-auto max-w-4xl h-80 overflow-hidden rounded-3xl bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20"
        >
          {/* Static Cloud Background */}
          <img
            src="/cloudhero.jpg"
            alt="Clouds"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
          />

          {/* Enlarged Airplane */}
          <motion.img
            src="/planehero.png"
            alt="Airplane"
            className="absolute w-[120%] max-w-none left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
