import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, Users } from "lucide-react";
import LoadingSpinner from "../../components/loadingSpinner";

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { flight, searchData } = location.state || {};

  const [passengers, setPassengers] = useState([
    {
      id: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/confirmation", { state: { flight, searchData, passengers } });
    }, 2000);
  };

  const updatePassenger = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  if (loading) {
    return <LoadingSpinner message="Processing your booking..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Passenger Details</h1>
          <p className="text-gray-400">
            Please provide passenger information for your booking
          </p>
        </motion.div>

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
                {flight?.airline} {flight?.flightNumber}
              </p>
              <p className="text-gray-400">
                {flight?.departure.airport} → {flight?.arrival.airport}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">
                ${flight?.price}
              </p>
              <p className="text-gray-400">{flight?.class}</p>
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
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={passenger.firstName}
                      onChange={(e) =>
                        updatePassenger(index, "firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={passenger.lastName}
                      onChange={(e) =>
                        updatePassenger(index, "lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={passenger.email}
                      onChange={(e) =>
                        updatePassenger(index, "email", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={passenger.phone}
                      onChange={(e) =>
                        updatePassenger(index, "phone", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={passenger.dateOfBirth}
                      onChange={(e) =>
                        updatePassenger(index, "dateOfBirth", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Users className="inline h-4 w-4 mr-1" />
                      Gender
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
              </div>
            ))}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow text-lg"
            >
              Continue to Payment
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PassengerDetails;
