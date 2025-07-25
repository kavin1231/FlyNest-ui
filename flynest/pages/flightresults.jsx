import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Clock, Plane } from 'lucide-react';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const searchData = location.state || {};

  const mockFlights = [
    {
      id: 1,
      airline: 'Emirates',
      flightNumber: 'EK 203',
      departure: { time: '08:30', airport: 'LAX', city: 'Los Angeles' },
      arrival: { time: '22:45', airport: 'DXB', city: 'Dubai' },
      duration: '14h 15m',
      stops: 0,
      price: 1249,
      class: 'Economy',
      logo: '✈️',
    },
    {
      id: 2,
      airline: 'Qatar Airways',
      flightNumber: 'QR 739',
      departure: { time: '10:15', airport: 'LAX', city: 'Los Angeles' },
      arrival: { time: '23:30', airport: 'DXB', city: 'Dubai' },
      duration: '15h 45m',
      stops: 1,
      price: 1189,
      class: 'Economy',
      logo: '🛩️',
    },
    {
      id: 3,
      airline: 'British Airways',
      flightNumber: 'BA 285',
      departure: { time: '14:20', airport: 'LAX', city: 'Los Angeles' },
      arrival: { time: '08:15+1', airport: 'DXB', city: 'Dubai' },
      duration: '16h 25m',
      stops: 1,
      price: 1098,
      class: 'Economy',
      logo: '🛫',
    },
  ];

  const handleSelectFlight = (flight) => {
    setLoading(true);
    setTimeout(() => {
      navigate('/passengers', { state: { flight, searchData } });
    }, 2000);
  };

  if (loading) {
    return <LoadingSpinner message="Preparing your flight details..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-black text-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Flight Results</h1>
          <p className="text-gray-400 text-lg">
            {searchData.from} → {searchData.to} • {searchData.departure} • {searchData.passengers} passenger(s)
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 glassmorphism-card rounded-2xl p-6 bg-slate-800/40 backdrop-blur border border-slate-600"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
              <Filter className="h-4 w-4" />
              <span>All Filters</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
              <Clock className="h-4 w-4" />
              <span>Departure Time</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
              <Plane className="h-4 w-4" />
              <span>Airlines</span>
            </button>
            <div className="ml-auto text-sm text-gray-400">
              {mockFlights.length} flights found
            </div>
          </div>
        </motion.div>

        {/* Flight Cards */}
        <div className="space-y-6">
          {mockFlights.map((flight, index) => (
            <motion.div
              key={flight.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <FlightCard
                flight={flight}
                onSelect={() => handleSelectFlight(flight)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FlightResults;
