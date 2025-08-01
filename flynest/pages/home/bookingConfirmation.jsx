import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  User,
  Plane,
  Clock,
  CreditCard,
} from 'lucide-react';
import BoardingPass from '../../components/boardingPass';
import Header from '../../components/Header';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchData, passengers, booking, payment, paymentIntentId } = location.state || {};
  const [showBoardingPass, setShowBoardingPass] = useState(false);

  // Generate booking reference from actual booking ID or create one
  const bookingReference = booking?.bookingId || `SK${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  useEffect(() => {
    // Show boarding pass after animation delay
    const timer = setTimeout(() => {
      setShowBoardingPass(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Debug: Log the received data
  useEffect(() => {
    console.log('Booking Confirmation Data:', {
      flight,
      searchData,
      passengers,
      booking,
      payment,
      paymentIntentId,
    });
  }, [flight, searchData, passengers, booking, payment, paymentIntentId]);

  // Redirect if no booking data
  useEffect(() => {
    if (!booking || !flight || !passengers) {
      console.error('Missing booking data, redirecting to home');
      const redirectTimer = setTimeout(() => navigate('/home', { replace: true }), 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [booking, flight, passengers, navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      // If it's already in HH:MM format, return as is
      if (typeof timeString === 'string' && timeString.includes(':')) return timeString;
      // Otherwise try to format as time
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  // Show loading/error state if no booking data
  if (!booking || !flight || !passengers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="glassmorphism-card rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            {booking ? 'Loading...' : 'Booking Data Missing'}
          </h2>
          <p className="text-gray-400 mb-6">
            {booking ? 'Loading your booking details...' : 'Redirecting to home...'}
          </p>
        </div>
      </div>
    );
  }

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

            {/* Payment Status */}
            {payment && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-4 inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg"
              >
                <CreditCard className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-green-400 text-sm">
                  Payment Confirmed • $
                  {(booking?.totalAmount || (flight?.price || 0) * (searchData?.seats || 0)).toFixed(2)}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* ✅ Booking Details */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="glassmorphism-card rounded-2xl p-8 mb-8 border border-slate-700 bg-slate-900/50 backdrop-blur"
          >
            <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flight Info */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-yellow-400" />
                  Flight Information
                </h3>
                <div className="space-y-4 bg-slate-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Airline:</span>
                    <span className="font-medium">
                      {flight?.airline || 'N/A'}{' '}
                      {flight?.flightNumber || booking?.flightDetails?.flightNumber || ''}
                    </span>
                  </div>

                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">From:</span>
                      <span className="font-medium">
                        {flight?.departure?.airport ||
                          booking?.flightDetails?.departure ||
                          flight?.from ||
                          searchData?.from ||
                          'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">To:</span>
                      <span className="font-medium">
                        {flight?.arrival?.airport ||
                          booking?.flightDetails?.arrival ||
                          flight?.to ||
                          searchData?.to ||
                          'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Departure Date:
                      </span>
                      <span className="font-medium">
                        {formatDate(
                          booking?.flightDetails?.date || flight?.departureDate || searchData?.departureDate
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Departure Time:
                      </span>
                      <span className="font-medium">
                        {formatTime(flight?.departure?.time || flight?.departureTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Arrival Time:
                      </span>
                      <span className="font-medium">
                        {formatTime(flight?.arrival?.time || flight?.arrivalTime)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Class:</span>
                      <span className="font-medium capitalize">
                        {flight?.class || searchData?.class || 'Economy'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Duration:</span>
                      <span className="font-medium">{flight?.duration || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Seats Booked:</span>
                      <span className="font-medium">
                        {booking?.seatsBooked || searchData?.seats || passengers?.length || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="font-bold text-yellow-400 text-lg">
                        $
                        {(booking?.totalAmount || (flight?.price || 0) * (searchData?.seats || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-yellow-400" />
                  Passenger Information
                  <span className="ml-2 text-sm bg-yellow-400 text-slate-900 px-2 py-1 rounded-full">
                    {passengers?.length || booking?.seatsBooked || 0}
                  </span>
                </h3>
                <div className="space-y-4">
                  {passengers && passengers.length > 0 ? (
                    passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="bg-slate-800/50 rounded-xl p-4 border-l-4 border-yellow-400"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">Passenger {index + 1}</h4>
                          <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                            {passenger.gender || 'N/A'}
                          </span>
                        </div>
                        <p className="font-medium text-yellow-400 mb-1">
                          {passenger.firstName || 'N/A'} {passenger.lastName || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">📧 {passenger.email || 'N/A'}</p>
                        <p className="text-sm text-gray-400 mb-1">📱 {passenger.phone || 'N/A'}</p>
                        <p className="text-sm text-gray-400 mb-1">
                          🎂 Age: {passenger.age || 'N/A'} years
                        </p>
                        {passenger.dateOfBirth && (
                          <p className="text-sm text-gray-400">
                            🗓️ DOB: {formatDate(passenger.dateOfBirth)}
                          </p>
                        )}
                      </div>
                    ))
                  ) : booking?.passengers ? (
                    booking.passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="bg-slate-800/50 rounded-xl p-4 border-l-4 border-yellow-400"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">Passenger {index + 1}</h4>
                        </div>
                        <p className="font-medium text-yellow-400 mb-1">
                          {passenger.name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">
                          🎂 Age: {passenger.age || 'N/A'} years
                        </p>
                        {passenger.passportNumber && (
                          <p className="text-sm text-gray-400">
                            📋 Passport/ID: {passenger.passportNumber}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <p className="text-gray-400">No passenger information available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Status */}
            <div className="border-t border-slate-700 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Booking Status</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking?.status === 'confirmed'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : booking?.status === 'preparing'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {booking?.status
                    ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                    : 'Confirmed'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">Booking Date</p>
                  <p className="font-medium">
                    {formatDate(booking?.bookingDate || booking?.createdAt)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Booking ID</p>
                  <p className="font-medium">{booking?._id?.slice(-8) || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Payment Status</p>
                  <p className="font-medium text-green-400">{payment ? 'Paid' : 'Completed'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow"
                onClick={() => window.print()}
              >
                <Download className="h-5 w-5" />
                <span>Download Ticket</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Flight Booking Confirmation',
                      text: `Flight booking confirmed! Reference: ${bookingReference}`,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="h-5 w-5" />
                <span>Share Booking</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 border border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                onClick={() => navigate('/bookings')}
              >
                <Calendar className="h-5 w-5" />
                <span>My Bookings</span>
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
                booking={booking}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default BookingConfirmation;
