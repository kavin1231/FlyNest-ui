import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  User,
} from 'lucide-react';
import BoardingPass from '../../components/boardingPass';
import Header from '../../components/Header';

const BookingConfirmation = () => {
  const location = useLocation();
  const { flight, searchData, passengers } = location.state || {};
  const [showBoardingPass, setShowBoardingPass] = useState(false);

  const bookingReference = `SK${Math.random()
    .toString(36)
    .substr(2, 6)
    .toUpperCase()}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBoardingPass(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ✅ Fixed Header with proper z-index and background */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black shadow-md">
        <Header />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      >
        <div className="max-w-4xl mx-auto">
          {/* ✅ Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 1, ease: 'linear' },
                scale: { duration: 0.5, repeat: 1, repeatType: 'reverse' },
              }}
              className="inline-block"
            >
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            </motion.div>

            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Booking Confirmed!
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-gray-400 mb-2"
            >
              Your flight has been successfully booked
            </motion.p>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-lg text-yellow-400 font-semibold"
            >
              Booking Reference: {bookingReference}
            </motion.p>
          </motion.div>

          {/* ✅ Booking Details */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="glassmorphism-card rounded-2xl p-8 mb-8 border border-slate-700 bg-slate-900/50 backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Flight Info */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-yellow-400" />
                  Flight Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Airline:</span>
                    <span>
                      {flight?.airline} {flight?.flightNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Route:</span>
                    <span>
                      {flight?.departure.airport} → {flight?.arrival.airport}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Departure:</span>
                    <span>{flight?.departure.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Arrival:</span>
                    <span>{flight?.arrival.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Class:</span>
                    <span>{flight?.class}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-yellow-400" />
                  Passenger Information
                </h3>
                <div className="space-y-3">
                  {passengers?.map((passenger, index) => (
                    <div
                      key={index}
                      className="border-b border-slate-700 pb-2 last:border-b-0"
                    >
                      <p className="font-medium">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{passenger.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow"
              >
                <Download className="h-5 w-5" />
                <span>Download Ticket</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>Share Booking</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                <span>Add to Calendar</span>
              </motion.button>
            </div>
          </motion.div>

          {/* ✅ Animated Boarding Pass */}
          {showBoardingPass && (
            <motion.div
              initial={{ y: 100, opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <BoardingPass
                flight={flight}
                passenger={passengers?.[0]}
                bookingReference={bookingReference}
                searchData={searchData}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default BookingConfirmation;
