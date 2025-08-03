import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";

// Consistent token accessor using localStorage (matches your booking system)
const getToken = () => {
  return localStorage.getItem("token");
};

// Get user data from localStorage
const getUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());
  const [user, setUser] = useState(() => getUser());
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user && user.role === "admin";

  // All nav items for logged-in users
  const loggedInNavItems = [
    { name: "Home", path: "/home" },
    { name: "Flights", path: "/flights" },
    { name: "About", path: "/about" },
    { name: "Bookings", path: "/bookings" },
    { name: "Airlines", path: "/airlines" },
    // Add admin-only navigation
    ...(isAdmin ? [{ name: "Admin Panel", path: "/admin" }] : []),
  ];

  // Public nav items when not logged in
  const guestNavItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  // Choose nav items based on login status
  const navItems = isLoggedIn ? loggedInNavItems : guestNavItems;

  // Update login state and user data when route changes
  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    
    setIsLoggedIn(!!token);
    setUser(userData);
    
    console.log("Header auth check:", { 
      token: !!token, 
      user: userData, 
      isAdmin: userData?.role === "admin" 
    });
  }, [location]);

  // Listen for storage changes (useful if user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        const token = getToken();
        const userData = getUser();
        setIsLoggedIn(!!token);
        setUser(userData);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // Navigate to profile page
      navigate("/profile");
    } else {
      // Navigate to login page
      navigate("/");
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to={isLoggedIn ? "/home" : "/"}
            className="flex items-center space-x-2"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 gold-gradient rounded-full"
            >
              <img
                src="/flynestlogo.png"
                alt="Logo"
                className="h-6 w-6 object-contain"
              />
            </motion.div>
            <span className="text-2xl font-bold text-white">FlyNest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User info when logged in */}
            {isLoggedIn && user && (
              <div className="text-gray-300 text-sm">
                Welcome, {user.firstname || user.name || "User"}
                {isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-yellow-500 text-black text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileClick}
              aria-label="Profile"
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <User className="h-5 w-5" />
            </motion.button>
            
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-6 py-2 gold-gradient text-slate-900 font-semibold rounded-full hover:shadow-lg transition-shadow"
              >
                Log Out
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-6 py-2 gold-gradient text-slate-900 font-semibold rounded-full hover:shadow-lg transition-shadow"
              >
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? "auto" : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {/* User info in mobile menu */}
            {isLoggedIn && user && (
              <div className="px-3 py-2 text-gray-300 text-sm border-b border-gray-700">
                Welcome, {user.firstname || user.name || "User"}
                {isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-yellow-500 text-black text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
            )}
            
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 transition-colors ${
                  location.pathname === item.path
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-700 space-y-2">
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-full mb-2"
                >
                  Profile
                </button>
              )}
              
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 gold-gradient text-slate-900 font-semibold rounded-full"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full px-6 py-3 gold-gradient text-slate-900 font-semibold rounded-full"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;