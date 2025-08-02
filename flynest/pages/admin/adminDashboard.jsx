import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plane,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import BookingsPage from "./bookingManagement";
import Header2 from "../../components/Header2";
import AdminFlight from "./adminFlight";
import AdminPassengersPage from "./passengerManagement";
import AdminContactUs from "./adminContactUs";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [recentBookings, setRecentBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([
    {
      icon: <Users className="h-8 w-8" />,
      label: "Total Passengers",
      value: "—",
      change: "",
    },
    {
      icon: <Plane className="h-8 w-8" />,
      label: "Active Flights",
      value: "—",
      change: "",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      label: "Bookings Today",
      value: "—",
      change: "",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      label: "Revenue",
      value: "—",
      change: "",
    },
  ]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Bookings" },
    { id: "flights", label: "Flights" },
    { id: "passengers", label: "Passengers" },
    { id: "contact us", label: "Contact Us" },
  ];

  const token = localStorage.getItem("token");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load user (from storage or token)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      }
    } catch (e) {
      console.warn("Failed to parse user:", e);
    }
  }, [token]);

  const isAdmin = user?.role === "admin";

  // Helper to compare same day in Asia/Colombo
  const isSameColomboDay = (dateA, dateB) => {
    try {
      const toColombo = (d) =>
        new Date(
          new Date(d).toLocaleString("en-US", { timeZone: "Asia/Colombo" })
        );
      const a = toColombo(dateA);
      const b = toColombo(dateB);
      return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
      );
    } catch {
      return false;
    }
  };

  // Fetch bookings and derive stats
  useEffect(() => {
    if (!token) return;
    const fetchRecent = async () => {
      setLoadingBookings(true);
      setBookingsError(null);
      try {
        const res = await axios.get(`${BackendUrl}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = Array.isArray(res.data) ? res.data : [];
        // Sort newest
        const sorted = all.slice().sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentBookings(sorted.slice(0, 10));

        // Compute stats
        const totalPassengers = all.reduce(
          (sum, b) => sum + (b.seatsBooked || 0),
          0
        );

        const activeFlightsSet = new Set(
          all
            .filter((b) => ["confirmed", "preparing"].includes(b.status))
            .map((b) => b.flightId?.toString())
            .filter(Boolean)
        );
        const activeFlights = activeFlightsSet.size;

        const now = new Date();
        const bookingsToday = all.filter((b) =>
          isSameColomboDay(b.bookingDate, now)
        ).length;

        const revenue = all
          .filter((b) => b.status === "confirmed")
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        setStats([
          {
            icon: <Users className="h-8 w-8" />,
            label: "Total Passengers",
            value: totalPassengers.toLocaleString(),
            change: "",
          },
          {
            icon: <Plane className="h-8 w-8" />,
            label: "Active Flights",
            value: activeFlights.toString(),
            change: "",
          },
          {
            icon: <Calendar className="h-8 w-8" />,
            label: "Bookings Today",
            value: bookingsToday.toString(),
            change: "",
          },
          {
            icon: <DollarSign className="h-8 w-8" />,
            label: "Revenue",
            value: `$${revenue.toFixed(2)}`,
            change: "",
          },
        ]);
      } catch (err) {
        console.error("Error fetching recent bookings:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setBookingsError("Unauthorized. Please log in with an admin account.");
        } else {
          setBookingsError("Failed to load recent bookings.");
        }
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchRecent();
  }, [token, BackendUrl]);

  const renderStatusBadge = (status) => {
    const label = (status || "").toLowerCase();
    const cfg =
      label === "confirmed"
        ? { bg: "bg-green-500/20", text: "text-green-400", display: "Confirmed" }
        : label === "preparing"
        ? { bg: "bg-yellow-500/20", text: "text-yellow-400", display: "Preparing" }
        : label === "cancelled" || label === "declined"
        ? {
            bg: "bg-red-500/20",
            text: "text-red-400",
            display: label.charAt(0).toUpperCase() + label.slice(1),
          }
        : { bg: "bg-gray-500/20", text: "text-gray-400", display: status || "Unknown" };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
      >
        {cfg.display}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <Header2 />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage flights, bookings, and passengers</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 glassmorphism-card rounded-2xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-yellow-400 text-slate-900"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="glassmorphism-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-400 text-slate-900 rounded-xl">
                  {stat.icon}
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change || "+0%"}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glassmorphism-card rounded-2xl p-8"
        >
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Recent Bookings</h2>
              {loadingBookings ? (
                <div className="text-center py-8 text-white">
                  Loading recent bookings...
                </div>
              ) : bookingsError ? (
                <div className="text-center py-8 text-red-400">
                  {bookingsError}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-400">
                          Booking ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">
                          Passenger
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">
                          Route
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking, index) => (
                        <motion.tr
                          key={booking._id || booking.bookingId || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                          className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-mono text-yellow-400">
                            #{booking.bookingId ||
                              (booking._id ? booking._id.slice(-8) : "N/A")}
                          </td>
                          <td className="py-4 px-4">
                            {booking.customerName || "—"}
                          </td>
                          <td className="py-4 px-4">
                            {booking.flightDetails?.departure} →{" "}
                            {booking.flightDetails?.arrival}
                          </td>
                          <td className="py-4 px-4 text-gray-400">
                            {booking.flightDetails?.date
                              ? new Date(
                                  booking.flightDetails.date
                                ).toLocaleDateString()
                              : booking.bookingDate
                              ? new Date(booking.bookingDate).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="py-4 px-4">
                            {renderStatusBadge(booking.status)}
                          </td>
                        </motion.tr>
                      ))}
                      {recentBookings.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-gray-400"
                          >
                            No recent bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="text-center py-12">
              <BookingsPage />
            </div>
          )}

          {activeTab === "flights" && (
            <div className="text-center py-12">
              <AdminFlight />
            </div>
          )}

          {activeTab === "passengers" && (
            <div className="text-center py-12">
              <AdminPassengersPage />
            </div>
          )}
          {activeTab === "contact us" && (
            <div className="text-center py-12">
              <AdminContactUs />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
