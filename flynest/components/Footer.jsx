import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, X } from 'lucide-react';

// Consistent token accessor using localStorage (matches your header system)
const getToken = () => {
  return localStorage.getItem("token");
};

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());
  const [toast, setToast] = useState({ show: false, message: '' });
  const location = useLocation();

  // Update login state when route changes (matches header behavior)
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, [location]);

  // Listen for storage changes (matches header behavior)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        const token = getToken();
        setIsLoggedIn(!!token);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };



  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg border border-slate-600 flex items-center space-x-3">
          <span className="text-sm">{toast.message}</span>
          <button 
            onClick={() => setToast({ show: false, message: '' })}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}



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
                {isLoggedIn ? (
                  <Link 
                    to="/flights" 
                    className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Flights
                  </Link>
                ) : (
                  <span 
                    onClick={() => showToast('Please login first to access this feature')}
                    className="block text-gray-500 cursor-not-allowed hover:text-gray-500 transition-colors text-sm"
                  >
                    Flights 🔒
                  </span>
                )}
                {isLoggedIn ? (
                  <Link 
                    to="/bookings" 
                    className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    My Bookings
                  </Link>
                ) : (
                  <span 
                    onClick={() => showToast('Please login first to access this feature')}
                    className="block text-gray-500 cursor-not-allowed hover:text-gray-500 transition-colors text-sm"
                  >
                    My Bookings 🔒
                  </span>
                )}
                <Link 
                  to="/about" 
                  className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                >
                  About Us
                </Link>
                {isLoggedIn ? (
                  <Link 
                    to="/contactus" 
                    className="block text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Contact Us
                  </Link>
                ) : (
                  <span 
                    onClick={() => showToast('Please login first to access this feature')}
                    className="block text-gray-500 cursor-not-allowed hover:text-gray-500 transition-colors text-sm"
                  >
                    Contact Us 🔒
                  </span>
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
            <p className="text-sm text-gray-400">
              &copy; 2024 FlyNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;