import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, Users } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "../../components/loadingSpinner.jsx";
import Header from "../../components/Header.jsx";

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [flight, setFlight] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  // Initialize passengers array based on seats booked
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState("");

  // Load data from multiple sources
  useEffect(() => {
    const loadFlightData = async () => {
      let flightData = null;
      let searchInfo = null;

      console.log("Loading flight data...");
      console.log("Location state:", location.state);

      // Method 1: Try location state first
      if (location.state?.selectedFlight) {
        flightData = location.state.selectedFlight;
        searchInfo = location.state.searchData || location.state.searchInfo;
        console.log("Data loaded from location.state (selectedFlight):", {
          flightData,
          searchInfo,
        });
      } else if (location.state?.flight) {
        flightData = location.state.flight;
        searchInfo = location.state.searchData;
        console.log("Data loaded from location.state (flight):", {
          flightData,
          searchInfo,
        });
      }

      // Method 2: Try sessionStorage
      if (!flightData) {
        try {
          const storedFlight = sessionStorage.getItem("selectedFlight");
          const storedSearch = sessionStorage.getItem("searchData");

          if (storedFlight) {
            flightData = JSON.parse(storedFlight);
            console.log("Flight data loaded from sessionStorage");
          }
          if (storedSearch) {
            searchInfo = JSON.parse(storedSearch);
            console.log("Search data loaded from sessionStorage");
          }
        } catch (error) {
          console.error("Error parsing sessionStorage data:", error);
        }
      }

      // Method 3: Try localStorage as fallback
      if (!flightData) {
        try {
          const storedFlight = localStorage.getItem("selectedFlight");
          const storedSearch = localStorage.getItem("searchData");

          if (storedFlight) {
            flightData = JSON.parse(storedFlight);
            console.log("Flight data loaded from localStorage");
          }
          if (storedSearch) {
            searchInfo = JSON.parse(storedSearch);
            console.log("Search data loaded from localStorage");
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }

      // Method 4: Try to get flight by ID from URL params
      const urlParams = new URLSearchParams(location.search);
      const flightId = urlParams.get("flightId");

      if (!flightData && flightId) {
        try {
          console.log("Fetching flight by ID:", flightId);
          const response = await axios.get(
            `${BackendUrl}/api/flights/${flightId}`
          );
          flightData = response.data;
          console.log("Flight data loaded from API:", flightData);

          // Create default search info if not available
          if (!searchInfo) {
            searchInfo = {
              seats: 1,
              passengers: 1,
              from: flightData.departure,
              to: flightData.arrival,
              date: flightData.date,
              class: "Economy",
            };
          }
        } catch (error) {
          console.error("Error fetching flight by ID:", error);
        }
      }

      if (flightData) {
        setFlight(flightData);

        // If no search data, create default
        if (!searchInfo) {
          searchInfo = {
            seats: 1,
            passengers: 1,
            from: flightData.departure,
            to: flightData.arrival,
            date: flightData.date,
            class: "Economy",
          };
        }

        setSearchData(searchInfo);

        // Store in both sessionStorage and localStorage for persistence
        sessionStorage.setItem("selectedFlight", JSON.stringify(flightData));
        sessionStorage.setItem("searchData", JSON.stringify(searchInfo));

        // Initialize passengers array
        const seatsCount = searchInfo?.seats || searchInfo?.passengers || 1;
        console.log("Initializing passengers for seats:", seatsCount);

        setPassengers(
          Array.from({ length: seatsCount }, (_, index) => ({
            id: index + 1,
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            gender: "male",
          }))
        );
      } else {
        console.log("No flight data found in any source");
      }

      setDataLoading(false);
    };

    loadFlightData();
  }, [location.state, location.search, BackendUrl]);

  // Enhanced user data retrieval function
  const getUserData = () => {
    // Debug all localStorage keys
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log(
      "Auth token:",
      localStorage.getItem("token") || localStorage.getItem("authToken")
    );

    // Try different possible keys for user data
    const possibleUserKeys = ["user", "userData", "currentUser", "authUser"];

    for (const key of possibleUserKeys) {
      const userData = localStorage.getItem(key);
      console.log(`Checking ${key}:`, userData);

      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          console.log(`Parsed ${key}:`, parsed);

          if (parsed && (parsed.id || parsed._id || parsed.userId)) {
            return {
              ...parsed,
              id: parsed.id || parsed._id || parsed.userId,
            };
          }
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
        }
      }
    }

    // If no user data found in localStorage, try to decode from JWT token
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (token) {
      try {
        // Decode JWT token to get user info
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const decoded = JSON.parse(jsonPayload);
        console.log("Decoded JWT:", decoded);

        if (decoded.userId) {
          return {
            id: decoded.userId,
            _id: decoded.userId,
            email: decoded.email,
            firstname: decoded.firstname,
            lastname: decoded.lastname,
            role: decoded.role,
            phone: decoded.phone,
          };
        }
      } catch (e) {
        console.error("Error decoding JWT:", e);
      }
    }

    return null;
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Create passenger via API - Updated to match your backend
  const createPassengerAPI = async (passengerData) => {
    try {
      console.log("Creating passenger with data:", passengerData);

      // Get user data
      const user = getUserData();
      if (!user) {
        throw new Error("User information not found. Please log in again.");
      }

      const response = await axios.post(
        `${BackendUrl}/api/passengers`,
        {
          firstname: passengerData.firstName,
          lastname: passengerData.lastName,
          email: passengerData.email,
          phone: passengerData.phone,
          dateOfBirth: passengerData.dateOfBirth,
          age: calculateAge(passengerData.dateOfBirth),
          passportNumber: `PP${Date.now()}${Math.random()
            .toString(36)
            .substr(2, 4)}`.toUpperCase(),
          gender: passengerData.gender,
          userId: user.id || user._id,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Passenger created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating passenger:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get user data with enhanced error handling
      const user = getUserData();
      console.log("User data retrieved:", user);

      if (!user) {
        // Try to fetch user data from API as a last resort
        try {
          const response = await axios.get(`${BackendUrl}/api/users`, {
            headers: getAuthHeaders(),
          });
          console.log("User data from API:", response.data);

          // Store user data for future use
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (apiError) {
          console.error("Failed to fetch user from API:", apiError);
          throw new Error("User information not found. Please log in again.");
        }
      }

      // Validate all required fields
      for (let i = 0; i < passengers.length; i++) {
        const passenger = passengers[i];
        if (
          !passenger.firstName ||
          !passenger.lastName ||
          !passenger.email ||
          !passenger.phone ||
          !passenger.dateOfBirth
        ) {
          throw new Error(
            `Please fill in all required fields for Passenger ${i + 1}`
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(passenger.email)) {
          throw new Error(`Please enter a valid email for Passenger ${i + 1}`);
        }

        // Validate age (must be at least 1 year old)
        const age = calculateAge(passenger.dateOfBirth);
        if (age < 1) {
          throw new Error(`Passenger ${i + 1} must be at least 1 year old`);
        }
      }

      // Create passengers via API and collect their IDs
      const createdPassengers = [];
      for (let passenger of passengers) {
        try {
          const createdPassenger = await createPassengerAPI(passenger);
          createdPassengers.push({
            ...passenger,
            _id: createdPassenger._id || createdPassenger.id,
            apiId: createdPassenger._id || createdPassenger.id,
            age: calculateAge(passenger.dateOfBirth),
            passportNumber: createdPassenger.passportNumber,
            name: `${passenger.firstName} ${passenger.lastName}`,
          });
        } catch (apiError) {
          console.error("Failed to create passenger via API:", apiError);
          // Continue with local passenger data if API fails
          createdPassengers.push({
            ...passenger,
            _id: `temp_${Date.now()}_${passenger.id}`,
            apiId: `temp_${Date.now()}_${passenger.id}`,
            age: calculateAge(passenger.dateOfBirth),
            passportNumber: `PP${Date.now()}${passenger.id}`,
            name: `${passenger.firstName} ${passenger.lastName}`,
          });
        }
      }

      // Store passenger data for persistence
      sessionStorage.setItem("passengers", JSON.stringify(createdPassengers));

      // Prepare booking data for payment page
      const bookingData = {
        flightId: flight._id,
        seatsBooked: passengers.length,
        passengers: createdPassengers.map((p) => ({
          name: p.name,
          age: p.age,
          passportNumber: p.passportNumber,
        })),
        totalAmount: flight.price * passengers.length,
        customerName: `${createdPassengers[0].firstName} ${createdPassengers[0].lastName}`,
        customerPhone: createdPassengers[0].phone,
        customerAddress: "To be provided",
      };

      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

      // Navigate to payment page with all data
      navigate("/payment", {
        state: {
          flight,
          searchData,
          passengers: createdPassengers,
          bookingData,
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
      setError(
        error.response?.data?.error || error.message || "An error occurred"
      );
      setLoading(false);
    }
  };

  const updatePassenger = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  // Show loading while checking for data
  if (dataLoading) {
    return <LoadingSpinner message="Loading flight data..." />;
  }

  if (loading) {
    return <LoadingSpinner message="Creating passenger records..." />;
  }

  // Show missing data error with debug info
  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="glassmorphism-card rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Missing Flight Data
          </h2>
          <p className="text-gray-400 mb-6">
            We couldn't find your flight information. This might happen if you:
          </p>
          <ul className="text-gray-400 text-sm mb-6 text-left space-y-2">
            <li>• Refreshed the page</li>
            <li>• Navigated directly to this URL</li>
            <li>• Your session expired</li>
            <li>• Flight wasn't selected properly</li>
          </ul>
          <p className="text-gray-400 mb-6">
            Please start your booking from the flight search.
          </p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Clear any stored data and go to flights page
                sessionStorage.clear();
                localStorage.removeItem("selectedFlight");
                localStorage.removeItem("searchData");
                localStorage.removeItem("passengers");
                navigate("/flights");
              }}
              className="w-full px-6 py-3 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow"
            >
              Browse Flights
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="w-full px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
            >
              Go to Home
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const seatsCount = searchData?.seats || searchData?.passengers || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        <Header />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Passenger Details</h1>
          <p className="text-gray-400">
            Please provide passenger information for {seatsCount} passenger(s)
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Flight Summary */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Flight Summary</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                {flight?.airline || "Airlines"} {flight?.flightNumber}
              </p>
              <p className="text-gray-400">
                {flight?.departure} → {flight?.arrival}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(flight?.date).toLocaleDateString()} • {seatsCount}{" "}
                passenger(s)
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">
                ${((flight?.price || 0) * seatsCount).toFixed(2)}
              </p>
              <p className="text-gray-400">${flight?.price || 0} per person</p>
            </div>
          </div>
        </motion.div>

        {/* Passenger Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism-card rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit}>
            {passengers.map((passenger, index) => (
              <div key={passenger.id} className="mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold">
                    Passenger {index + 1}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={passenger.firstName}
                      onChange={(e) =>
                        updatePassenger(index, "firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={passenger.lastName}
                      onChange={(e) =>
                        updatePassenger(index, "lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={passenger.email}
                      onChange={(e) =>
                        updatePassenger(index, "email", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={passenger.phone}
                      onChange={(e) =>
                        updatePassenger(index, "phone", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={passenger.dateOfBirth}
                      onChange={(e) =>
                        updatePassenger(index, "dateOfBirth", e.target.value)
                      }
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Users className="inline h-4 w-4 mr-1" />
                      Gender *
                    </label>
                    <select
                      value={passenger.gender}
                      onChange={(e) =>
                        updatePassenger(index, "gender", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Show calculated age */}
                {passenger.dateOfBirth && (
                  <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                    <p className="text-sm text-gray-400">
                      Age:{" "}
                      <span className="text-white font-medium">
                        {calculateAge(passenger.dateOfBirth)} years old
                      </span>
                    </p>
                  </div>
                )}

                {/* Add separator between passengers */}
                {index < passengers.length - 1 && (
                  <hr className="mt-8 border-slate-600" />
                )}
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`w-full py-4 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow text-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Passengers..." : "Continue to Payment"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PassengerDetails;
