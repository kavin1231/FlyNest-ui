import React from "react";
import { motion } from "framer-motion";
import { Plane, Clock, MapPin } from "lucide-react";

const FlightCard = ({ flight, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glassmorphism-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Airline Info */}
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{flight.logo}</div>
          <div>
            <h3 className="font-semibold text-lg">{flight.airline}</h3>
            <p className="text-gray-400 text-sm">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex-1 flex items-center justify-center space-x-6">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-bold">{flight.departure.time}</div>
            <div className="text-lg font-medium">
              {flight.departure.airport}
            </div>
            <div className="text-sm text-gray-400">{flight.departure.city}</div>
          </div>

          {/* Flight Path */}
          <div className="flex flex-col items-center space-y-2 min-w-[200px]">
            <div className="text-sm text-gray-400">{flight.duration}</div>
            <div className="relative flex items-center">
              <div className="h-px bg-gray-600 flex-1"></div>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-2"
              >
                <Plane className="h-5 w-5 text-yellow-400 rotate-90" />
              </motion.div>
              <div className="h-px bg-gray-600 flex-1"></div>
            </div>
            <div className="text-sm text-gray-400">
              {flight.stops === 0
                ? "Nonstop"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-bold">{flight.arrival.time}</div>
            <div className="text-lg font-medium">{flight.arrival.airport}</div>
            <div className="text-sm text-gray-400">{flight.arrival.city}</div>
          </div>
        </div>

        {/* Price and Select */}
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            ${flight.price}
          </div>
          <div className="text-sm text-gray-400 mb-4">{flight.class}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className="px-8 py-3 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            Select Flight
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;