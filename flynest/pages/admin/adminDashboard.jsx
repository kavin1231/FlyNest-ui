import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plane, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: <Users className="h-8 w-8" />, label: 'Total Passengers', value: '12,847', change: '+12%' },
    { icon: <Plane className="h-8 w-8" />, label: 'Active Flights', value: '234', change: '+8%' },
    { icon: <Calendar className="h-8 w-8" />, label: 'Bookings Today', value: '89', change: '+23%' },
    { icon: <DollarSign className="h-8 w-8" />, label: 'Revenue', value: '$2.4M', change: '+15%' },
  ];

  const recentBookings = [
    { id: 'SK001', passenger: 'John Doe', route: 'LAX → DXB', date: '2024-01-15', status: 'Confirmed' },
    { id: 'SK002', passenger: 'Jane Smith', route: 'JFK → LHR', date: '2024-01-15', status: 'Pending' },
    { id: 'SK003', passenger: 'Mike Johnson', route: 'CDG → NRT', date: '2024-01-14', status: 'Confirmed' },
    { id: 'SK004', passenger: 'Sarah Wilson', route: 'DXB → LAX', date: '2024-01-14', status: 'Cancelled' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'flights', label: 'Flights' },
    { id: 'passengers', label: 'Passengers' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                    ? 'bg-yellow-400 text-slate-900'
                    : 'text-gray-400 hover:text-white'
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
                  {stat.change}
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
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Booking ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Passenger</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Route</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-4 px-4 font-mono text-yellow-400">{booking.id}</td>
                        <td className="py-4 px-4">{booking.passenger}</td>
                        <td className="py-4 px-4">{booking.route}</td>
                        <td className="py-4 px-4 text-gray-400">{booking.date}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Confirmed'
                              ? 'bg-green-500/20 text-green-400'
                              : booking.status === 'Pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bookings Management</h3>
              <p className="text-gray-400">Detailed booking management interface would go here</p>
            </div>
          )}

          {activeTab === 'flights' && (
            <div className="text-center py-12">
              <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flight Management</h3>
              <p className="text-gray-400">Flight scheduling and management interface would go here</p>
            </div>
          )}

          {activeTab === 'passengers' && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Passenger Management</h3>
              <p className="text-gray-400">Passenger information and management interface would go here</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;