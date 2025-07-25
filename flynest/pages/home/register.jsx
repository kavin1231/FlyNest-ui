import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Registering", formData);
    // Add your register logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blurred floating gradient circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-700 opacity-10 rounded-full filter blur-2xl animate-ping"></div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        data-aos="fade-up"
        className="w-full max-w-md bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white rounded-2xl p-8 shadow-2xl z-10"
      >
        <h2
          className="text-4xl font-bold text-center mb-8 text-yellow-400"
          data-aos="zoom-in"
        >
          Create an Account
        </h2>

        {/* Full Name */}
        <label className="block mb-5">
          <span className="text-gray-300">Full Name</span>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded-md bg-slate-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition hover:border-yellow-400"
            placeholder="John Doe"
          />
        </label>

        {/* Email */}
        <label className="block mb-5">
          <span className="text-gray-300">Email Address</span>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded-md bg-slate-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition hover:border-yellow-400"
            placeholder="you@example.com"
          />
        </label>

        {/* Password */}
        <label className="block mb-5">
          <span className="text-gray-300">Password</span>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded-md bg-slate-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition hover:border-yellow-400"
            placeholder="********"
          />
        </label>

        {/* Confirm Password */}
        <label className="block mb-6">
          <span className="text-gray-300">Confirm Password</span>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full mt-1 p-3 rounded-md bg-slate-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition hover:border-yellow-400"
            placeholder="********"
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:from-yellow-500 hover:to-yellow-700 transition duration-300"
        >
          Register
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Login here
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
