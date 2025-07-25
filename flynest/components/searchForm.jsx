import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, Search } from 'lucide-react';

const SearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    class: 'Economy',
  });

  const airports = [
    { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles, CA' },
    { code: 'DXB', name: 'Dubai International', city: 'Dubai, UAE' },
    { code: 'JFK', name: 'John F. Kennedy', city: 'New York, NY' },
    { code: 'LHR', name: 'Heathrow', city: 'London, UK' },
    { code: 'NRT', name: 'Narita', city: 'Tokyo, Japan' },
    { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris, France' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <section className="relative -mt-32 z-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="glassmorphism-card rounded-3xl p-8 shadow-2xl"
        >
          {/* Class Selection */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-slate-700 rounded-full p-1">
              {['Economy', 'Business Class', 'First Class'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setFormData({ ...formData, class: cls })}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.class === cls
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              {/* From */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  From
                </label>
                <select
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                >
                  <option value="">Select departure</option>
                  {airports.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* To */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  To
                </label>
                <select
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                >
                  <option value="">Select destination</option>
                  {airports.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Departure
                </label>
                <input
                  type="date"
                  value={formData.departure}
                  onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              {/* Return Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Return
                </label>
                <input
                  type="date"
                  value={formData.return}
                  onChange={(e) => setFormData({ ...formData, return: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Search Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center pulse-gold"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </motion.button>
            </div>

            {/* Passengers */}
            <div className="mt-6 flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-300">
                <Users className="inline h-4 w-4 mr-1" />
                Passengers:
              </label>
              <select
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchForm;