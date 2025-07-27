import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const isAdmin = localStorage.getItem("role") === "admin";

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        window.location.href = "/";
        return;
      }
      try {
        const response = await axios.get(`${BackendUrl}/api/bookings/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const res = await axios.patch(
        `${BackendUrl}/api/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking ${status} successfully!`);
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? res.data.booking || res.data : b))
      );
    } catch {
      toast.error(`Failed to ${status} booking`);
    }
  };

  const getStatusBadge = status => {
    const cfg = {
      preparing: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Preparing" },
      confirmed: { bg: "bg-green-500/20", text: "text-green-400", label: "Confirmed" },
      cancelled: { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled" },
      declined: { bg: "bg-red-500/20", text: "text-red-400", label: "Declined" },
    }[status] || {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      label: status,
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center animate-pulse text-white">Loading bookings...</div>
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
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
        <p className="text-slate-400 mb-8">Manage all flight bookings and their status</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-white">
          {["Total", "Preparing", "Confirmed", "Cancelled", "Declined"].map(label => (
            <div
              key={label}
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex justify-between items-center"
            >
              <div>
                <p className="text-slate-400 text-sm">{label} Bookings</p>
                <p className="text-2xl font-bold">
                  {label === "Total"
                    ? bookings.length
                    : bookings.filter(b => b.status === label.toLowerCase()).length}
                </p>
              </div>
              <div className="bg-yellow-400 p-3 rounded-xl">
                <span className="w-6 h-6 block" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {bookings.map(booking => (
            <div
              key={booking._id}
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 text-white">
                  <div>
                    <p className="text-slate-400 text-xs">Booking ID</p>
                    <p className="font-semibold">#{booking.bookingId || booking._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Flight</p>
                    <p className="font-semibold">
                      {booking.flightDetails?.flightNumber}
                      <br />
                      <span className="text-slate-300 text-sm">
                        {booking.flightDetails?.departure} → {booking.flightDetails?.arrival}
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

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-slate-400 text-sm">Status:</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  {isAdmin && booking.status === "preparing" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking._id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, "declined")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
