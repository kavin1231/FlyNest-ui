import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import BasicNavbar from "../components/BasicNavbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <BasicNavbar />

      <div className="flex justify-center items-center px-4 py-20">
        <form
          onSubmit={handleSubmit}
          data-aos="fade-up"
          className="bg-slate-800/60 backdrop-blur-md border border-slate-600 rounded-2xl p-8 w-full max-w-md shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
            Login to Your Account
          </h2>

          <label className="block mb-4">
            <span className="text-gray-300">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md bg-slate-700 border border-gray-600 p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-300">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="mt-1 w-full rounded-md bg-slate-700 border border-gray-600 p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 rounded-full hover:from-yellow-500 hover:to-yellow-700 transition duration-300"
          >
            Login
          </button>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
