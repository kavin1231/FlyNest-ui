import React from 'react';
import { motion } from 'framer-motion';
import { Plane, QrCode } from 'lucide-react';

const BoardingPass = ({
  flight,
  passenger,
  bookingReference,
  searchData,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glassmorphism-card rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-slate-900">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">SkyVoyage</h2>
            <p className="text-slate-800">Boarding Pass</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{flight?.airline}</div>
            <div className="text-lg">{flight?.flightNumber}</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Passenger & Flight Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Passenger</p>
                <p className="text-xl font-bold">
                  {passenger?.firstName} {passenger?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Booking Ref</p>
                <p className="text-xl font-bold">{bookingReference}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">From</p>
                <p className="text-2xl font-bold">{flight?.departure.airport}</p>
                <p className="text-gray-300">{flight?.departure.city}</p>
              </div>
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Plane className="h-8 w-8 text-yellow-400" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">To</p>
                <p className="text-2xl font-bold">{flight?.arrival.airport}</p>
                <p className="text-gray-300">{flight?.arrival.city}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Date</p>
                <p className="font-bold">{searchData?.departure}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Time</p>
                <p className="font-bold">{flight?.departure.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Gate</p>
                <p className="font-bold">A12</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide">Seat</p>
                <p className="font-bold">14A</p>
              </div>
            </div>
          </div>

          {/* QR Code & Additional Info */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
              <QrCode className="h-24 w-24 text-slate-900" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 uppercase tracking-wide">Class</p>
              <p className="text-lg font-bold">{flight?.class}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 uppercase tracking-wide">Zone</p>
              <p className="text-lg font-bold">1</p>
            </div>
          </div>
        </div>

        {/* Perforated Edge Effect */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-600">
          <p className="text-center text-sm text-gray-400">
            Please arrive at the gate 45 minutes before departure
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BoardingPass;