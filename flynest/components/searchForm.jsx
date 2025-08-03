import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { MapPin, Users, Calendar, Search } from "lucide-react";

const FlightSearchUI = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); // Add this hook

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departure: "",
    return: "",
    passengers: 1,
    class: "Economy",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const airports = [
    { code: "SRILANKA", name: "Bandaranaike International", city: "Sri Lanka" },
    { code: "INDIA", name: "Indira Gandhi International", city: "India" },
    { code: "DUBAI", name: "Dubai International", city: "Dubai" },
    { code: "LONDON", name: "Heathrow", city: "London" },
    { code: "JAPAN", name: "Narita", city: "Japan" },
    { code: "FRANCE", name: "Charles de Gaulle", city: "France" },
    {
      code: "LOS ANGELES",
      name: "Los Angeles International",
      city: "Los Angeles",
    },
    { code: "NEW YORK", name: "John F. Kennedy", city: "New York" },
    { code: "QATAR", name: "Hamad International", city: "Qatar" },
  ];

  // Add this function to handle booking navigation
  const handleBookNow = (flight) => {
    // Navigate to bookings page with flight data as state
    navigate('/passengers', {
      state: {
        flight: flight,
        searchData: formData
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.from || !formData.to || !formData.departure) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.from === formData.to) {
      setError("Departure and arrival destinations cannot be the same");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        from: formData.from,
        to: formData.to,
        date: formData.departure,
      });

      console.log("Search URL:", `${BackendUrl}/api/flights?${params}`);

      const response = await fetch(`${BackendUrl}/api/flights?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const flights = await response.json();
      console.log("Search Results:", flights);

      setSearchResults(flights);

      if (flights.length === 0) {
        setError(
          "No flights found for your search criteria. Please try different dates or destinations."
        );
      }
    } catch (err) {
      console.error("Flight search error:", err);

      // Better error handling
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        setError(`Search failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return timeString;
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
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, departure: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]} // Prevent past dates
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
                    onChange={(e) =>
                      setFormData({ ...formData, return: e.target.value })
                    }
                    min={
                      formData.departure ||
                      new Date().toISOString().split("T")[0]
                    } // Must be after departure
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
                      <p className="text-sm text-gray-400 mt-1">
                        {formatDate(flight.date)}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {formatTime(flight.departureTime)}
                      </p>
                      <p className="text-gray-300">{flight.departure}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {formatTime(flight.arrivalTime)}
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
                      <button 
                        onClick={() => handleBookNow(flight)}
                        className="px-6 py-2 gold-gradient text-slate-900 font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
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