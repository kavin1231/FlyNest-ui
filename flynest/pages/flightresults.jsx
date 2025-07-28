import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Filter,
  Clock,
  Plane,
  ArrowRight,
  Calendar,
  Users,
} from "lucide-react";
import axios from "axios";
import FlightCard from "../components/FlightCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: "price", // price, duration, departure
    timeRange: "all", // all, morning, afternoon, evening
    maxPrice: null,
  });

  const searchData = location.state || {};

  useEffect(() => {
    const fetchFlights = async () => {
      if (!searchData.from || !searchData.to || !searchData.departure) {
        setError("Missing search criteria. Please search again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flights`,
          {
            params: {
              from: searchData.from,
              to: searchData.to,
              date: searchData.departure,
            },
          }
        );

        const flightData = res.data || [];
        setFlights(flightData);
        setFilteredFlights(flightData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Failed to load flights. Please try again later.");
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchData]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...flights];

    // Time range filter
    if (filters.timeRange !== "all") {
      filtered = filtered.filter((flight) => {
        const hour = new Date(flight.departureTime).getHours();
        switch (filters.timeRange) {
          case "morning":
            return hour >= 6 && hour < 12;
          case "afternoon":
            return hour >= 12 && hour < 18;
          case "evening":
            return hour >= 18 || hour < 6;
          default:
            return true;
        }
      });
    }

    // Price filter
    if (filters.maxPrice) {
      filtered = filtered.filter((flight) => flight.price <= filters.maxPrice);
    }

    // Sort flights
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          const durationA = new Date(a.arrivalTime) - new Date(a.departureTime);
          const durationB = new Date(b.arrivalTime) - new Date(b.departureTime);
          return durationA - durationB;
        case "departure":
          return new Date(a.departureTime) - new Date(b.departureTime);
        default:
          return 0;
      }
    });

    setFilteredFlights(filtered);
  }, [flights, filters]);

  const handleSelectFlight = (flight) => {
    setLoading(true);
    setTimeout(() => {
      navigate("/passengers", { state: { flight, searchData } });
    }, 1500);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner message="Searching for the best flights..." />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-black text-white text-center px-6"
      >
        <div className="bg-slate-800/40 backdrop-blur border border-slate-600 rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Oops!</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Start New Search
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-black text-white"
    >
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Search Summary */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            Available Flights
          </h1>
          <div className="bg-slate-800/40 backdrop-blur border border-slate-600 rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="font-semibold">{searchData.from}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="font-semibold">{searchData.to}</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">
                  {formatDate(searchData.departure)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">
                  {searchData.passengers || 1} passenger(s)
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 bg-slate-800/40 backdrop-blur border border-slate-600 rounded-2xl p-6"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Sort By */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="px-4 py-2 bg-slate-700 rounded-full text-white border border-slate-600 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="price">Sort by Price</option>
                <option value="departure">Sort by Departure</option>
                <option value="duration">Sort by Duration</option>
              </select>

              {/* Time Range */}
              <select
                value={filters.timeRange}
                onChange={(e) =>
                  handleFilterChange("timeRange", e.target.value)
                }
                className="px-4 py-2 bg-slate-700 rounded-full text-white border border-slate-600 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">All Times</option>
                <option value="morning">Morning (6AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 6PM)</option>
                <option value="evening">Evening (6PM - 6AM)</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={() =>
                  setFilters({
                    sortBy: "price",
                    timeRange: "all",
                    maxPrice: null,
                  })
                }
                className="px-4 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors text-sm"
              >
                Clear Filters
              </button>
            </div>

            <div className="text-sm text-gray-400">
              {filteredFlights.length} of {flights.length} flights
            </div>
          </div>
        </motion.div>

        {/* Flight Results */}
        {filteredFlights.length > 0 ? (
          <div className="space-y-6">
            {filteredFlights.map((flight, index) => (
              <motion.div
                key={flight._id || index}
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
        ) : flights.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-slate-800/40 backdrop-blur border border-slate-600 rounded-2xl p-8 max-w-md mx-auto">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No flights match your filters
              </h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria
              </p>
              <button
                onClick={() =>
                  setFilters({
                    sortBy: "price",
                    timeRange: "all",
                    maxPrice: null,
                  })
                }
                className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-slate-800/40 backdrop-blur border border-slate-600 rounded-2xl p-8 max-w-md mx-auto">
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No flights available
              </h3>
              <p className="text-gray-400 mb-4">
                No flights found for your selected route and date.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Search Different Route
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FlightResults;
