import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Plane, Edit3, Trash2, Plus, Search, Filter } from "lucide-react";

const AdminFlight = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingFlight, setEditingFlight] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchFlights = async () => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    try {
      setLoading(true);
      // Use the new admin endpoint to get all flights
      const res = await axios.get(`${BackendUrl}/api/flights/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(res.data);
    } catch (err) {
      console.error("Error fetching flights:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
        toast.error("Admin access required");
      } else {
        setError("Failed to fetch flights");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      try {
        await axios.delete(`${BackendUrl}/api/flights/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlights((prev) => prev.filter((f) => f._id !== id));
        toast.success("Flight deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        if (err.response?.status === 403) {
          toast.error("Admin access required");
        } else {
          toast.error("Failed to delete flight");
        }
      }
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight._id);
    setEditForm({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      departure: flight.departure,
      arrival: flight.arrival,
      departureTime: new Date(flight.departureTime).toISOString().slice(0, 16),
      arrivalTime: new Date(flight.arrivalTime).toISOString().slice(0, 16),
      date: new Date(flight.date).toISOString().slice(0, 10),
      totalSeats: flight.totalSeats,
      availableSeats: flight.availableSeats,
      price: flight.price,
      image: flight.image,
      status: flight.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingFlight(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${BackendUrl}/api/flights/${editingFlight}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFlights((prev) =>
        prev.map((f) => (f._id === editingFlight ? res.data : f))
      );
      setEditingFlight(null);
      toast.success("Flight updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error("Update failed");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFlight = () => navigate("/create-flight");

  const formatDateTime = (d) => new Date(d).toLocaleString();

  // Filter flights based on search term and status
  const filteredFlights = flights.filter((flight) => {
    const matchesSearch = 
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || flight.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          <div className="text-white text-xl">Loading flights...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md text-center border border-slate-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Access Error</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header and Add Flight Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Plane className="h-8 w-8 text-yellow-400" />
              Flight Management
            </h1>
            <p className="text-slate-400 mt-2">Manage all available flights</p>
          </div>
          <button
            onClick={handleAddFlight}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:-translate-y-1 hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Flight
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search flights (flight number, airline, route...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-slate-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredFlights.length} of {flights.length} flights
          </div>
        </div>

        {filteredFlights.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
            {flights.length === 0 ? (
              <>
                <Plane className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No flights found</h3>
                <p className="text-slate-400 mb-6">Get started by adding your first flight</p>
                <button
                  onClick={handleAddFlight}
                  className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  Add First Flight
                </button>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No matching flights</h3>
                <p className="text-slate-400">Try adjusting your search criteria</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFlights.map((flight) => (
              <div
                key={flight._id}
                className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors"
              >
                {editingFlight === flight._id ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Edit Flight</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="flightNumber"
                        value={editForm.flightNumber}
                        onChange={handleInputChange}
                        placeholder="Flight Number"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        name="airline"
                        value={editForm.airline}
                        onChange={handleInputChange}
                        placeholder="Airline"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        name="departure"
                        value={editForm.departure}
                        onChange={handleInputChange}
                        placeholder="Departure"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        name="arrival"
                        value={editForm.arrival}
                        onChange={handleInputChange}
                        placeholder="Arrival"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        type="datetime-local"
                        name="departureTime"
                        value={editForm.departureTime}
                        onChange={handleInputChange}
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        type="datetime-local"
                        name="arrivalTime"
                        value={editForm.arrivalTime}
                        onChange={handleInputChange}
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleInputChange}
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleInputChange}
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="delayed">Delayed</option>
                      </select>
                      <input
                        type="number"
                        name="totalSeats"
                        value={editForm.totalSeats}
                        onChange={handleInputChange}
                        placeholder="Total Seats"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        type="number"
                        name="availableSeats"
                        value={editForm.availableSeats}
                        onChange={handleInputChange}
                        placeholder="Available Seats"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <input
                        name="image"
                        value={editForm.image}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                        className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 md:col-span-2"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                          {flight.flightNumber} - {flight.airline}
                        </h2>
                        <div className="text-lg text-slate-300">
                          {flight.departure} → {flight.arrival}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          flight.status === "scheduled"
                            ? "bg-green-600/30 text-green-400"
                            : flight.status === "cancelled"
                            ? "bg-red-600/30 text-red-400"
                            : "bg-yellow-600/30 text-yellow-400"
                        }`}
                      >
                        {flight.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-6">
                      <div className="text-slate-300">
                        <span className="text-slate-400">Departure:</span><br />
                        {formatDateTime(flight.departureTime)}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Arrival:</span><br />
                        {formatDateTime(flight.arrivalTime)}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Date:</span><br />
                        {new Date(flight.date).toLocaleDateString()}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Seats:</span><br />
                        {flight.availableSeats}/{flight.totalSeats} available
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Price:</span><br />
                        ${flight.price}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(flight)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(flight._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFlight;