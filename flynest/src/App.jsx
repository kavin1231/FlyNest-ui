import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HomePage from "../pages/homePage";
import FlightResults from "../pages/flightresults";
import PassengerDetails from "../pages/home/passengerDetails";
import BookingConfirmation from "../pages/home/bookingConfirmation";
import AdminDashboard from "../pages/admin/adminDashboard";
import "./styles/globals.css";
import LoginPage from "../pages/home/login.jsx";
import RegisterPage from "../pages/home/register.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/flights" element={<FlightResults />} />
            <Route path="/passengers" element={<PassengerDetails />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
