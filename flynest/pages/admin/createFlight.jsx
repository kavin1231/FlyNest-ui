import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header2 from "../../components/Header2";

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
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BackendUrl}/api/flights`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Flight created successfully!");
      navigate("/admin");
    } catch (err) {
      alert("Failed to create flight");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <Header2 />
      <div className="max-w-4xl mx-auto mt-20 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Add New Flight
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {[
            { name: "flightNumber", placeholder: "Flight Number" },
            { name: "airline", placeholder: "Airline" },
            { name: "departure", placeholder: "Departure" },
            { name: "arrival", placeholder: "Arrival" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400"
              required
            />
          ))}

          <input
            name="departureTime"
            type="datetime-local"
            value={form.departureTime}
            onChange={handleChange}
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            required
          />
          <input
            name="arrivalTime"
            type="datetime-local"
            value={form.arrivalTime}
            onChange={handleChange}
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            required
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600"
            required
          />
          <input
            name="totalSeats"
            type="number"
            value={form.totalSeats}
            onChange={handleChange}
            placeholder="Total Seats"
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400"
            required
          />
          <input
            name="availableSeats"
            type="number"
            value={form.availableSeats}
            onChange={handleChange}
            placeholder="Available Seats"
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 placeholder-slate-400 col-span-2"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="bg-slate-700 text-white p-3 rounded-lg border border-slate-600 col-span-2"
          >
            <option value="scheduled">Scheduled</option>
            <option value="delayed">Delayed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="col-span-2 flex justify-between mt-2">
            <button
              type="button"
              onClick={() => navigate("/admin-flights")}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Create Flight"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlightForm;
