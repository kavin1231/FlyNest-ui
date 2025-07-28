import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        window.location.href = "/";
        return;
      }
      try {
        const response = await axios.get(`${BackendUrl}/api/bookings/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch {
        setError("Failed to fetch your bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const getStatusBadge = (status) => {
    const cfg = {
      preparing: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        label: "Preparing",
      },
      confirmed: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        label: "Confirmed",
      },
      cancelled: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Cancelled",
      },
      declined: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Declined",
      },
    }[status] || {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      label: status,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
      >
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center animate-pulse text-white">
          Loading your bookings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <Header />
      <div className="max-w-5xl mx-auto px-6 mt-20">
        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-slate-400 mb-8">Here are your flight bookings</p>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
                <div>
                  <p className="text-slate-400 text-xs">Booking ID</p>
                  <p className="font-semibold">
                    #{booking.bookingId || booking._id.slice(-8)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Flight</p>
                  <p className="font-semibold">
                    {booking.flightDetails?.flightNumber}
                    <br />
                    <span className="text-slate-300 text-sm">
                      {booking.flightDetails?.departure} →{" "}
                      {booking.flightDetails?.arrival}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Seats</p>
                  <p className="font-semibold">{booking.seatsBooked}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Created</p>
                  <p className="font-semibold text-sm">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-slate-300 text-xs">
                    {new Date(booking.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 items-center">
                <span className="text-slate-400 text-sm">Status:</span>
                {getStatusBadge(booking.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
