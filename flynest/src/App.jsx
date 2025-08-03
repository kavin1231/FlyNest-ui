import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import HomePage from "../pages/homePage";
import FlightResults from "../pages/flightresults";
import PassengerDetails from "../pages/home/passengerDetails";
import BookingConfirmation from "../pages/home/bookingConfirmation";
import AdminDashboard from "../pages/admin/adminDashboard";
import "./styles/globals.css";
import LoginPage from "../pages/home/login.jsx";
import RegisterPage from "../pages/home/register.jsx";
import AdminBookingsPage from "../pages/admin/bookingManagement.jsx";
import CustomerBookingsPage from "../pages/home/myFlightBookings.jsx";
import CreateFlight from "../pages/admin/createFlight.jsx";
import AdminFlight from "../pages/admin/adminFlight.jsx";
import AboutUsPage from "../pages/home/aboutusPage.jsx";
import PaymentPage from "../pages/home/payment.jsx";
import AdminPassengersPage from "../pages/admin/passengerManagement.jsx";
import ProfilePage from "../pages/home/profilePage.jsx";
import UserContactUs from "../pages/home/userContactUs.jsx";
import FlightLogos from "../pages/home/flightlogos.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/flights" element={<FlightResults />} />
            <Route path="/passengers" element={<PassengerDetails />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/bookings" element={<CustomerBookingsPage />} />
            <Route path="/admin-flights" element={<AdminFlight />} />
            <Route path="/admin/passengers" element={<AdminPassengersPage />} />
            <Route path="/create-flight" element={<CreateFlight />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/contactus" element={<UserContactUs/>} />
            <Route path="/airlines" element={<FlightLogos />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
