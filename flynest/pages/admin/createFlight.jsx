import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header2 from "../../components/Header2";
import { Plane, Save, X, AlertCircle } from "lucide-react";

const AddFlightForm = () => {
  const [form, setForm] = useState({
    flightNumber: "",
    airline: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: "",
    date: "",
    totalSeats: "",
    availableSeats: "",
    price: "",
    image: "",
    status: "scheduled",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.flightNumber.trim())
      newErrors.flightNumber = "Flight number is required";
    if (!form.airline.trim()) newErrors.airline = "Airline is required";
    if (!form.departure.trim())
      newErrors.departure = "Departure location is required";
    if (!form.arrival.trim())
      newErrors.arrival = "Arrival location is required";
    if (!form.departureTime)
      newErrors.departureTime = "Departure time is required";
    if (!form.arrivalTime) newErrors.arrivalTime = "Arrival time is required";
    if (!form.date) newErrors.date = "Flight date is required";
    if (!form.totalSeats || form.totalSeats <= 0)
      newErrors.totalSeats = "Total seats must be greater than 0";
    if (!form.availableSeats || form.availableSeats < 0)
      newErrors.availableSeats = "Available seats cannot be negative";
    if (!form.price || form.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (form.availableSeats > form.totalSeats)
      newErrors.availableSeats = "Available seats cannot exceed total seats";
    if (
      form.departureTime &&
      form.arrivalTime &&
      new Date(form.departureTime) >= new Date(form.arrivalTime)
    )
      newErrors.arrivalTime = "Arrival time must be after departure time";
    if (form.date && new Date(form.date) < new Date().setHours(0, 0, 0, 0))
      newErrors.date = "Flight date cannot be in the past";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BackendUrl}/api/flights`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Flight created successfully!");
      navigate("/admin-flights");
    } catch (err) {
      console.error("Error creating flight:", err);
      if (err.response?.status === 403) {
        toast.error("Admin access required");
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to create flight");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (fieldName) => `
    bg-slate-700 text-white p-4 rounded-xl border transition-all duration-200
    ${
      errors[fieldName]
        ? "border-red-500 focus:ring-2 focus:ring-red-400"
        : "border-slate-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
    }
    placeholder-slate-400 focus:outline-none
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6 text-white">
      <Header2 />
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-slate-800/40 backdrop-blur border border-slate-600 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Add New Flight
            </h2>
            <p className="text-slate-400">Fill in the flight details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Flight Number *
                </label>
                <input
                  name="flightNumber"
                  value={form.flightNumber}
                  onChange={handleChange}
                  placeholder="e.g., AA123"
                  className={inputClasses("flightNumber")}
                />
                {errors.flightNumber && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.flightNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Airline *
                </label>
                <input
                  name="airline"
                  value={form.airline}
                  onChange={handleChange}
                  placeholder="e.g., American Airlines"
                  className={inputClasses("airline")}
                />
                {errors.airline && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.airline}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Departure City *
                </label>
                <input
                  name="departure"
                  value={form.departure}
                  onChange={handleChange}
                  placeholder="e.g., NEW YORK"
                  className={inputClasses("departure")}
                />
                {errors.departure && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.departure}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Arrival City *
                </label>
                <input
                  name="arrival"
                  value={form.arrival}
                  onChange={handleChange}
                  placeholder="e.g., LOS ANGELES"
                  className={inputClasses("arrival")}
                />
                {errors.arrival && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.arrival}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Departure Time *
                </label>
                <input
                  name="departureTime"
                  type="datetime-local"
                  value={form.departureTime}
                  onChange={handleChange}
                  className={inputClasses("departureTime")}
                />
                {errors.departureTime && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.departureTime}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Arrival Time *
                </label>
                <input
                  name="arrivalTime"
                  type="datetime-local"
                  value={form.arrivalTime}
                  onChange={handleChange}
                  className={inputClasses("arrivalTime")}
                />
                {errors.arrivalTime && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.arrivalTime}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Flight Date *
                </label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClasses("date")}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.date}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Total Seats *
                </label>
                <input
                  name="totalSeats"
                  type="number"
                  min="1"
                  value={form.totalSeats}
                  onChange={handleChange}
                  placeholder="e.g., 180"
                  className={inputClasses("totalSeats")}
                />
                {errors.totalSeats && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.totalSeats}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Available Seats *
                </label>
                <input
                  name="availableSeats"
                  type="number"
                  min="0"
                  max={form.totalSeats || undefined}
                  value={form.availableSeats}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                  className={inputClasses("availableSeats")}
                />
                {errors.availableSeats && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.availableSeats}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Price ($) *
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g., 299.99"
                  className={inputClasses("price")}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.price}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Aircraft Image URL (Optional)
              </label>
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/aircraft-image.jpg"
                className={inputClasses("image")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Flight Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClasses("status")}
              >
                <option value="scheduled">Scheduled</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-600">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="flex-1 px-6 py-4 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Create Flight
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
            <p className="text-sm text-slate-400">
              <strong className="text-slate-300">Note:</strong> All fields
              marked with * are required. Make sure departure time is before
              arrival time, and available seats don't exceed total seats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFlightForm;
