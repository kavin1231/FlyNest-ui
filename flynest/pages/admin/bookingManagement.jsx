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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Booking ${status} successfully!`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? res.data.booking : b))
      );
    } catch (err) {
      toast.error(`Failed to ${status} booking`);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        label: "Pending"
      },
      confirmed: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        label: "Confirmed"
      },
      cancelled: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Cancelled"
      },
      declined: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        label: "Declined"
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
          <p className="text-slate-400">Manage all flight bookings and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </div>
              <div className="bg-yellow-400 p-3 rounded-xl">
                <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-400 p-3 rounded-xl">
                <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-white">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Cancelled/Declined</p>
                <p className="text-2xl font-bold text-white">
                  {bookings.filter(b => b.status === 'cancelled' || b.status === 'declined').length}
                </p>
              </div>
              <div className="bg-red-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
            <p className="text-slate-400 text-lg">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Booking ID</p>
                      <p className="text-white font-semibold">#{booking._id.slice(-8)}</p>
                    </div>
                    
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Flight</p>
                      <p className="text-white font-semibold">
                        {booking.flight ? (
                          <>
                            {booking.flight.flightNumber}
                            <br />
                            <span className="text-slate-300 text-sm">
                              {booking.flight.origin} → {booking.flight.destination}
                            </span>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm font-medium">Passengers</p>
                      <p className="text-white font-semibold">{booking.seats} seat(s)</p>
                      {booking.passengers?.length > 0 && (
                        <div className="mt-1">
                          {booking.passengers.slice(0, 2).map((p, index) => (
                            <p key={p._id} className="text-slate-300 text-xs">
                              {p.name || `Passenger ${index + 1}`}
                            </p>
                          ))}
                          {booking.passengers.length > 2 && (
                            <p className="text-slate-400 text-xs">
                              +{booking.passengers.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-slate-400 text-sm font-medium">Created</p>
                      <p className="text-white font-semibold text-sm">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-slate-300 text-xs">
                        {new Date(booking.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm">Status:</span>
                      {getStatusBadge(booking.status)}
                    </div>

                    {isAdmin && booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                          onClick={() => updateBookingStatus(booking._id, "confirmed")}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Accept
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                          onClick={() => updateBookingStatus(booking._id, "declined")}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Decline
                        </button>
                      </div>
                    )}

                    {isAdmin && booking.status !== 'pending' && (
                      <div className="flex gap-2">
                        {booking.status !== 'confirmed' && (
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                            onClick={() => updateBookingStatus(booking._id, "confirmed")}
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                            onClick={() => updateBookingStatus(booking._id, "cancelled")}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}