import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash, Search } from "lucide-react";

export default function AdminPassengersPage() {
  const [passengers, setPassengers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [q, setQ] = useState("");

  const token = localStorage.getItem("token");
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      else if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      }
    } catch (e) {
      console.warn("Failed to parse user:", e);
    }
  }, [token]);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchPassengers = async () => {
      if (!token) {
        window.location.href = "/";
        return;
      }
      try {
        const res = await axios.get(`${BackendUrl}/api/passengers/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPassengers(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching passengers:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Unauthorized. Please log in with an admin account.");
        } else {
          setError(
            err.response?.data?.error || "Failed to fetch passenger list"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPassengers();
  }, [token, BackendUrl]);

  useEffect(() => {
    if (!q) {
      setFiltered(passengers);
      return;
    }
    const lower = q.toLowerCase();
    setFiltered(
      passengers.filter((p) => {
        return (
          `${p.firstname} ${p.lastname}`.toLowerCase().includes(lower) ||
          (p.email || "").toLowerCase().includes(lower) ||
          (p.passportNumber || "").toLowerCase().includes(lower) ||
          (p.phone || "").toLowerCase().includes(lower)
        );
      })
    );
  }, [q, passengers]);

  const deletePassenger = async (id) => {
    if (!isAdmin) {
      toast.error("Only admins can delete passengers");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this passenger?"))
      return;

    try {
      await axios.delete(`${BackendUrl}/api/passengers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Passenger deleted");
      setPassengers((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete passenger error:", err);
      toast.error("Failed to delete passenger");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center animate-pulse text-white">
          Loading passenger data...
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
      <div className="max-w-7xl mx-auto px-6 mt-0">
        <h1 className="text-3xl font-bold text-white mb-2">
          Passenger Management
        </h1>
        <p className="text-slate-400 mb-8">View and manage all passengers</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-white">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Passengers</p>
              <p className="text-2xl font-bold">{passengers.length}</p>
            </div>
            <div className="bg-yellow-400 p-3 rounded-xl">
              <span className="w-6 h-6 block" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-1 items-center bg-slate-800 rounded-lg border border-slate-700 px-4">
            <Search className="h-5 w-5 text-gray-300 mr-2" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, passport, phone"
              className="w-full bg-transparent border-none outline-none py-3 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
            <p className="text-slate-400 text-lg">No passengers found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 text-white">
                    <div>
                      <p className="text-slate-400 text-xs">Name</p>
                      <p className="font-semibold">
                        {p.firstname} {p.lastname}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Email / Phone</p>
                      <p className="font-semibold">{p.email}</p>
                      <p className="text-slate-300 text-sm">{p.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Passport</p>
                      <p className="font-semibold">{p.passportNumber}</p>
                      <p className="text-slate-300 text-sm">Age: {p.age}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Gender / Owner</p>
                      <p className="font-semibold">{p.gender}</p>
                      <p className="text-slate-300 text-sm">
                        User ID: {p.userId?.toString().slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start sm:items-center">
                    <button
                      onClick={() => deletePassenger(p._id)}
                      disabled={!isAdmin}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg ${
                        isAdmin
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-300 flex flex-wrap gap-4">
                  <div>
                    <span className="text-slate-400">Created:</span>{" "}
                    {new Date(p.createdAt).toLocaleDateString()}{" "}
                    <span className="text-xs">
                      {new Date(p.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Updated:</span>{" "}
                    {new Date(p.updatedAt).toLocaleDateString()}
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
