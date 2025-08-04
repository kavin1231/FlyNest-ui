import React, { useState } from "react";
import { Plane, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  // Use React state instead of localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleLinkClick = (path) => (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
    } else {
      // In a real app, this would navigate to the path
      console.log(`Navigating to: ${path}`);
    }
  };

  // Quick link component that handles authentication
  const QuickLink = ({ to, children }) => {
    return (
      <button
        onClick={handleLinkClick(to)}
        className="block text-gray-400 hover:text-white transition-colors text-sm text-left w-full bg-transparent border-none p-0 cursor-pointer"
        aria-label={`Navigate to ${children}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Demo Authentication Toggle */}
      <div className="bg-blue-600 text-white p-4 text-center">
        <button
          onClick={() => setIsAuthenticated(!isAuthenticated)}
          className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 transition-colors"
        >
          {isAuthenticated ? "Log Out" : "Log In"} (Demo)
        </button>
        <p className="mt-2 text-sm">
          Current status: {isAuthenticated ? "Logged In" : "Not Logged In"}
        </p>
      </div>

      {/* Login Message */}
      {showLoginMessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-center">
          <p>Please log in to access this page. You would be redirected to login in a real app.</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to FlyNest</h1>
          <p className="text-gray-600 mb-6">
            This is a demo page showing the footer component below. Try clicking the footer links 
            with different authentication states to see how the protection works.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">When Logged Out:</h3>
              <p className="text-blue-700 text-sm">
                Footer links show a login prompt message and don't navigate
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-800 mb-2">When Logged In:</h3>
              <p className="text-green-700 text-sm">
                Footer links work normally (in console for this demo)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <footer className="bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                <Plane className="h-6 w-6 text-yellow-400" />
                <span className="text-xl font-bold text-white">FlyNest</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for seamless flight bookings and unforgettable travel experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                <QuickLink to="/flights">Flights</QuickLink>
                <QuickLink to="/bookings">My Bookings</QuickLink>
                <QuickLink to="/about">About Us</QuickLink>
                <QuickLink to="/contactus">Contact Us</QuickLink>
                {!isAuthenticated && (
                  <p className="text-xs text-yellow-300 mt-2">
                    Please log in to access these pages. You will be redirected to login when clicking.
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-right">
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@flynest.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-gray-400">&copy; 2024 FlyNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;