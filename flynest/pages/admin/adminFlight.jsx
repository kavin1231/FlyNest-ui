import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminFlight = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingFlight, setEditingFlight] = useState(null);
  const [editForm, setEditForm] = useState({});
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
      const res = await axios.get(`${BackendUrl}/api/flights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(res.data);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError("Failed to fetch flights");
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
        toast.error("Failed to delete flight");
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
      toast.success("Flight updated");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFlight = () => navigate("/create-flight");

  const formatDateTime = (d) => new Date(d).toLocaleString();

  useEffect(() => {
    fetchFlights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white animate-pulse text-xl">
          Loading flights...
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
            <h1 className="text-3xl font-bold text-white">Flight Management</h1>
            <p className="text-slate-400">Manage all available flights</p>
          </div>
          <button
            onClick={handleAddFlight}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            + Add New Flight
          </button>
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        {flights.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700 text-slate-400">
            No flights found.
          </div>
        ) : (
          <div className="space-y-6">
            {flights.map((flight) => (
              <div
                key={flight._id}
                className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition"
              >
                {editingFlight === flight._id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="flightNumber"
                        value={editForm.flightNumber}
                        onChange={handleInputChange}
                        placeholder="Flight #"
                        className="input"
                      />
                      <input
                        name="airline"
                        value={editForm.airline}
                        onChange={handleInputChange}
                        placeholder="Airline"
                        className="input"
                      />
                      <input
                        name="departure"
                        value={editForm.departure}
                        onChange={handleInputChange}
                        placeholder="Departure"
                        className="input"
                      />
                      <input
                        name="arrival"
                        value={editForm.arrival}
                        onChange={handleInputChange}
                        placeholder="Arrival"
                        className="input"
                      />
                      <input
                        type="datetime-local"
                        name="departureTime"
                        value={editForm.departureTime}
                        onChange={handleInputChange}
                        className="input"
                      />
                      <input
                        type="datetime-local"
                        name="arrivalTime"
                        value={editForm.arrivalTime}
                        onChange={handleInputChange}
                        className="input"
                      />
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleInputChange}
                        className="input"
                      />
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleInputChange}
                        className="input"
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
                        className="input"
                      />
                      <input
                        type="number"
                        name="availableSeats"
                        value={editForm.availableSeats}
                        onChange={handleInputChange}
                        placeholder="Available Seats"
                        className="input"
                      />
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="input"
                      />
                      <input
                        name="image"
                        value={editForm.image}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                        className="input"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-bold text-white">
                        {flight.flightNumber} - {flight.airline}
                      </h2>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          flight.status === "scheduled"
                            ? "bg-green-600/30 text-green-400"
                            : flight.status === "cancelled"
                            ? "bg-red-600/30 text-red-400"
                            : "bg-yellow-600/30 text-yellow-400"
                        }`}
                      >
                        {flight.status}
                      </span>
                    </div>
                    <div className="text-slate-300 text-sm mb-3">
                      {flight.departure} → {flight.arrival}
                      <br />
                      Departure: {formatDateTime(flight.departureTime)}
                      <br />
                      Arrival: {formatDateTime(flight.arrivalTime)}
                      <br />
                      Date: {new Date(flight.date).toLocaleDateString()}
                    </div>
                    <div className="text-slate-400 text-sm mb-4">
                      Seats: {flight.availableSeats}/{flight.totalSeats} <br />
                      Price: ${flight.price}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(flight)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(flight._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
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
