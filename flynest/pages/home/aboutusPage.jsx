import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/Header";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Heading */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About FlyNest
        </motion.h1>

        {/* Content */}
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-lg leading-relaxed text-gray-300">
            <strong>FlyNest</strong> is your trusted partner in modern air
            travel. Our mission is to simplify the flight booking process,
            giving you access to real-time schedules, transparent pricing, and
            seamless ticketing – all in one place.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            Founded with a passion for innovation and convenience, FlyNest
            brings together cutting-edge technology with a user-centric design.
            Whether you're flying for business or leisure, we strive to make
            your journey smooth and stress-free.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            Our platform empowers customers and administrators alike, offering
            full control over bookings, real-time flight management, and secure
            user access.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold mb-2">Why Choose FlyNest?</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Real-time flight availability & secure bookings</li>
              <li>Modern and mobile-friendly interface</li>
              <li>Fast customer service and admin support</li>
              <li>Built with the latest MERN stack technology</li>
            </ul>
          </div>

          <div className="pt-6">
            <p className="italic text-sm text-gray-400 text-center">
              “Travel made simple. Book your next adventure with FlyNest.”
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsPage;
