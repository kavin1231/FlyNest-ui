import axios from "axios";

import React, { useState } from "react";
import { MapPin, Users, Calendar, Search } from "lucide-react";

const FlightSearchUI = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL; // ✅ Must be here

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
    passengers: 1,
    class: "Economy",
  });

  // ... rest of the code

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const airports = [
    { code: "LAX", name: "Los Angeles", city: "Los Angeles, CA" },
    { code: "DXB", name: "Dubai International", city: "Dubai, UAE" },
    { code: "JFK", name: "John F. Kennedy", city: "New York, NY" },
    { code: "LHR", name: "Heathrow", city: "London, UK" },
    { code: "NRT", name: "Narita", city: "Tokyo, Japan" },
    { code: "CDG", name: "Charles de Gaulle", city: "Paris, France" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.from || !formData.to || !formData.departure) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${BackendUrl}/api/flights`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const allFlights = response.data;

      console.log("All Flights:", allFlights);
      console.log("Search Criteria:", formData);

      const filteredFlights = allFlights.filter((flight) => {
        const matchesFrom = flight.departure
          .toLowerCase()
          .includes(formData.from.toLowerCase());
        const matchesTo = flight.arrival
          .toLowerCase()
          .includes(formData.to.toLowerCase());
        const matchesDate = flight.date.slice(0, 10) === formData.departure;

        console.log(`Flight ${flight.flightNumber}`, {
          matchesFrom,
          matchesTo,
          matchesDate,
          flightDate: flight.date,
        });

        return matchesFrom && matchesTo && matchesDate;
      });

      setSearchResults(filteredFlights);

      if (filteredFlights.length === 0) {
        setError("No flights found for your search criteria");
      }
    } catch (err) {
      setError("Error searching flights: " + err.message);
      console.error("Flight search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <style>{`
        .glassmorphism-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .gold-gradient {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
        }
        .pulse-gold {
          animation: pulse-gold 2s infinite;
        }
        @keyframes pulse-gold {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(251, 191, 36, 0);
          }
        }
      `}</style>
      {/* Your Original Search Form */}
      <section className="relative -mt-32 z-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="glassmorphism-card rounded-3xl p-8 shadow-2xl transform transition-all duration-800">
            {/* Class Selection */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-slate-700 rounded-full p-1">
                {["Economy", "Business Class", "First Class"].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setFormData({ ...formData, class: cls })}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.class === cls
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                {/* From */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    From
                  </label>
                  <select
                    value={formData.from}
                    onChange={(e) =>
                      setFormData({ ...formData, from: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                    onChange={(e) =>
                      setFormData({ ...formData, departure: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                    onChange={(e) =>
                      setFormData({ ...formData, return: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-8 py-3 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center pulse-gold transform hover:scale-105 active:scale-95 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Search className="h-5 w-5 mr-2" />
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Passengers */}
              <div className="mt-6 flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-300">
                  <Users className="inline h-4 w-4 mr-1" />
                  Passengers:
                </label>
                <select
                  value={formData.passengers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passengers: parseInt(e.target.value),
                    })
                  }
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Passenger" : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Available Flights ({searchResults.length})
            </h2>
            <div className="space-y-6">
              {searchResults.map((flight) => (
                <div
                  key={flight._id}
                  className="glassmorphism-card rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {flight.airline || "Airline"}
                      </h3>
                      <p className="text-gray-300">{flight.flightNumber}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {flight.departureTime}
                      </p>
                      <p className="text-gray-300">{flight.departure}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {flight.arrivalTime}
                      </p>
                      <p className="text-gray-300">{flight.arrival}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-400">
                        ${flight.price}
                      </p>
                      <p className="text-gray-300 mb-4">
                        {flight.availableSeats} seats left
                      </p>
                      <button className="px-6 py-2 gold-gradient text-slate-900 font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FlightSearchUI;
