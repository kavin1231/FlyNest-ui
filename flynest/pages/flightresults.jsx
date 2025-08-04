import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, Plane, Calendar, Clock, ArrowLeft } from "lucide-react";
import axios from "axios";
import FlightCard from "../components/flightCard.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import Header from "../components/Header.jsx";

const FlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: "price", // price, duration, departure
    timeRange: "all", // all, morning, afternoon, evening
  });

  // Check if user came from search with a selected flight
  const { selectedFlight, searchData, fromSearch } = location.state || {};

  useEffect(() => {
    // If user came from search with a selected flight, show only that flight
    if (fromSearch && selectedFlight) {
      console.log("Showing selected flight from search:", selectedFlight);
      setFlights([selectedFlight]);
      setFilteredFlights([selectedFlight]);
      setLoading(false);
      return;
    }

    // Otherwise, fetch all flights
    const fetchAllFlights = async () => {
      try {
        setLoading(true);
        setError("");

        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "https://flynest.onrender.com";
        console.log("Fetching all flights from:", `${backendUrl}/api/flights`);

        // Try the customer endpoint first (no auth required)
        let res;
        try {
          // First try the dedicated customer endpoint
          console.log("Trying customer endpoint...");
          res = await axios.get(`${backendUrl}/api/flights/customer/all`, {
            timeout: 30000,
          });
          console.log("Customer endpoint success:", res.data);
        } catch (customerError) {
          console.log(
            "Customer endpoint failed:",
            customerError.response?.status || customerError.message
          );
          console.log("Trying public search endpoint...");
          try {
            // Fallback to public search endpoint (no filters)
            res = await axios.get(`${backendUrl}/api/flights`, {
              timeout: 30000,
            });
            console.log("Public endpoint success:", res.data);
          } catch (publicError) {
            console.log(
              "Public endpoint failed:",
              publicError.response?.status || publicError.message
            );
            throw publicError; // Re-throw the last error
          }
        }

        console.log("All flights response:", res.data);

        const flightData = res.data || [];
        setFlights(flightData);
        setFilteredFlights(flightData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching flights:", err);

        let errorMessage = "Failed to load flights. Please try again later.";

        if (err.code === "ECONNABORTED") {
          errorMessage =
            "Request timed out. Please check your connection and try again.";
        } else if (err.response) {
          errorMessage = `Server error: ${err.response.status}. ${
            err.response.data?.message || "Please try again later."
          }`;
        } else if (err.request) {
          errorMessage =
            "No response from server. Please check your connection.";
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchAllFlights();
  }, [fromSearch, selectedFlight]);

  // Apply filters and sorting (only if not showing a specific selected flight)
  useEffect(() => {
    if (fromSearch && selectedFlight) {
      // Don't apply filters when showing a specific selected flight
      return;
    }

    let filtered = [...flights];

    // Time range filter
    if (filters.timeRange !== "all") {
      filtered = filtered.filter((flight) => {
        try {
          const departureTime = new Date(flight.departureTime);
          if (isNaN(departureTime.getTime())) {
            return true; // Include flight if time parsing fails
          }

          const hour = departureTime.getHours();
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
        } catch (e) {
          return true;
        }
      });
    }

    // Sort flights
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price":
          const priceA =
            typeof a.price === "string"
              ? parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
              : a.price;
          const priceB =
            typeof b.price === "string"
              ? parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
              : b.price;
          return priceA - priceB;
        case "duration":
          try {
            const durationA =
              new Date(a.arrivalTime) - new Date(a.departureTime);
            const durationB =
              new Date(b.arrivalTime) - new Date(b.departureTime);
            return durationA - durationB;
          } catch (e) {
            return 0;
          }
        case "departure":
          try {
            return new Date(a.departureTime) - new Date(b.departureTime);
          } catch (e) {
            return 0;
          }
        default:
          return 0;
      }
    });

    setFilteredFlights(filtered);
  }, [flights, filters, fromSearch, selectedFlight]);

  const handleSelectFlight = (flight) => {
    console.log("Selected flight:", flight);
    navigate("/passengers", { state: { flight } });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleBackToSearch = () => {
    navigate(-1); // Go back to previous page
  };

  const handleViewAllFlights = () => {
    // Clear the location state and reload to show all flights
    navigate("/flight-results", { replace: true });
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner message="Loading available flights..." />;
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
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Try Again
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

        {/* Page Header */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-4">
                {fromSearch && selectedFlight
                  ? "Your Selected Flight"
                  : "All Available Flights"}
              </h1>
              <p className="text-gray-300 text-lg">
                {fromSearch && selectedFlight
                  ? "Review your flight selection and proceed to booking"
                  : "Browse all flights and book your next journey"}
              </p>
              {fromSearch && searchData && (
                <div className="mt-4 text-sm text-gray-400">
                  Search: {searchData.from} → {searchData.to} |{" "}
                  {searchData.departure}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              {fromSearch && selectedFlight && (
                <button
                  onClick={handleBackToSearch}
                  className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </button>
              )}

              {fromSearch && selectedFlight && (
                <button
                  onClick={handleViewAllFlights}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition-colors"
                >
                  View All Flights
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters and Sorting - Only show if not displaying a specific selected flight */}
        {!(fromSearch && selectedFlight) && (
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
                    })
                  }
                  className="px-4 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors text-sm"
                >
                  Reset Filters
                </button>
              </div>

              <div className="text-sm text-gray-400">
                {filteredFlights.length} flight
                {filteredFlights.length !== 1 ? "s" : ""} available
              </div>
            </div>
          </motion.div>
        )}

        {/* Flight Results */}
        {filteredFlights.length > 0 ? (
          <div className="space-y-6">
            {filteredFlights.map((flight, index) => (
              <motion.div
                key={flight._id || flight.id || index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <FlightCard
                  flight={flight}
                  onSelect={() => handleSelectFlight(flight)}
                  isSelected={fromSearch && selectedFlight}
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
                Try adjusting your filter criteria
              </p>
              <button
                onClick={() =>
                  setFilters({
                    sortBy: "price",
                    timeRange: "all",
                  })
                }
                className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Reset Filters
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
                No flights have been added yet. Check back later!
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Refresh
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FlightResults;
