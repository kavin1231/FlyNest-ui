import React, { useState, useEffect, useMemo } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/Header";

const UserContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
    priority: "medium",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [userContacts, setUserContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedContact, setExpandedContact] = useState(null);

  // Memoize these values to prevent unnecessary re-renders
  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => {
    return token ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  }, [token]);
  const BackendUrl = useMemo(() => {
    return import.meta.env.VITE_BACKEND_URL || "http://localhost:3010";
  }, []);

  const categories = [
    { value: "general", label: "General Inquiry", icon: "❓" },
    { value: "booking", label: "Booking Support", icon: "✈️" },
    { value: "payment", label: "Payment Issues", icon: "💳" },
    { value: "flight", label: "Flight Information", icon: "🛫" },
    { value: "complaint", label: "Complaint", icon: "⚠️" },
    { value: "suggestion", label: "Suggestion", icon: "💡" },
    { value: "technical", label: "Technical Support", icon: "🔧" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "high", label: "High", color: "text-orange-400" },
    { value: "urgent", label: "Urgent", color: "text-red-400" },
  ];

  // Pre-fill form with user data if logged in - Fixed with proper dependencies
  useEffect(() => {
    if (user && user.email && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        email: user.email,
      }));
    }
  }, [user?.email, user?.firstname, user?.lastname]); // Only depend on specific user properties

  // Fetch user contacts - Fixed with proper dependencies
  useEffect(() => {
    if (token) {
      fetchUserContacts();
    }
  }, [token]); // Only depend on token

  const fetchUserContacts = async () => {
    if (!token) return;
    setLoading(true);

    console.log("🔍 Attempting to fetch user contacts...");
    console.log("🔗 Backend URL:", BackendUrl);
    console.log("🎫 Token present:", !!token);

    try {
      const url = `${BackendUrl}/api/contacts/user`;
      console.log("📞 Making request to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📋 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response body:", errorText);

        if (response.status === 403) {
          console.log("🚫 Access denied - user may not be a customer");
          setUserContacts([]);
          return;
        }
        if (response.status === 404) {
          console.log("🔍 Endpoint not found - check if routes are registered");
          setUserContacts([]);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Success! Received data:", data);
      setUserContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("💥 Failed to fetch user contacts:", error);
      setUserContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Basic client-side validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    console.log("📝 Submitting contact form...");
    console.log("📊 Form data:", formData);
    console.log("🔗 Backend URL:", BackendUrl);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Add auth header if user is logged in
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("🎫 Including auth token");
      }

      const url = `${BackendUrl}/api/contacts`;
      console.log("📞 Making POST request to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          category: formData.category,
          priority: formData.priority,
        }),
      });

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Contact submitted successfully:", responseData);

        setSubmitStatus("success");
        setFormData({
          name: user
            ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
            : "",
          email: user ? user.email : "",
          subject: "",
          message: "",
          category: "general",
          priority: "medium",
        });

        // Refresh user contacts if logged in
        if (token) {
          setTimeout(fetchUserContacts, 1000);
        }
      } else {
        const errorData = await response.text();
        console.error("❌ Contact submission failed:", errorData);
        console.error("📊 Response status:", response.status);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("💥 Failed to submit contact:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        label: "Pending",
      },
      "in-progress": {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        label: "In Progress",
      },
      resolved: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        label: "Resolved",
      },
      closed: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Closed" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-green-400",
      medium: "text-yellow-400",
      high: "text-orange-400",
      urgent: "text-red-400",
    };
    return colors[priority] || "text-gray-400";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: "❓",
      booking: "✈️",
      payment: "💳",
      flight: "🛫",
      complaint: "⚠️",
      suggestion: "💡",
      technical: "🔧",
    };
    return icons[category] || "❓";
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <Header />
      <div className="max-w-6xl mt-15 mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-gray-400">Get in touch with our support team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-white">
                <MessageSquare className="mr-3 h-6 w-6 text-yellow-400" />
                Send us a Message
              </h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-green-400">
                    Message sent successfully! We'll get back to you soon.
                  </span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-red-400">
                    Failed to send message. Please try again later.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white"
                    >
                      {categories.map((cat) => (
                        <option
                          key={cat.value}
                          value={cat.value}
                          className="bg-slate-700"
                        >
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white"
                    >
                      {priorities.map((priority) => (
                        <option
                          key={priority.value}
                          value={priority.value}
                          className="bg-slate-700"
                        >
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-white placeholder-gray-400"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none text-white placeholder-gray-400"
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-slate-900 py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-yellow-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-900 border-t-transparent" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Previous Messages */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    info@flynest.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    123 Aviation Blvd, Sky City
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    24/7 Support Available
                  </span>
                </div>
              </div>
            </div>

            {/* Previous Messages (if logged in) */}
            {token && (
              <motion.div
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <User className="mr-2 h-5 w-5 text-yellow-400" />
                  Your Messages
                </h3>
                {loading ? (
                  <div className="text-center py-4 text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-400 border-t-transparent mx-auto mb-2"></div>
                    Loading...
                  </div>
                ) : userContacts.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userContacts.map((contact) => (
                      <div
                        key={contact._id}
                        className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {getCategoryIcon(contact.category)}
                            </span>
                            <h4 className="font-medium text-sm text-white">
                              {contact.subject}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs font-medium ${getPriorityColor(
                                contact.priority
                              )}`}
                            >
                              {contact.priority.toUpperCase()}
                            </span>
                            {getStatusBadge(contact.status)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setExpandedContact(
                                expandedContact === contact._id
                                  ? null
                                  : contact._id
                              )
                            }
                            className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                          >
                            {expandedContact === contact._id ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {contact.adminResponse && (
                          <div className="mb-2">
                            <div className="text-xs text-green-400 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Response received
                            </div>
                          </div>
                        )}

                        {expandedContact === contact._id && (
                          <div className="border-t border-slate-600/50 pt-3 mt-3 space-y-3">
                            <div>
                              <h5 className="text-xs font-medium text-gray-300 mb-1">
                                Your Message:
                              </h5>
                              <p className="text-xs text-gray-400 bg-slate-800/50 p-2 rounded">
                                {contact.message}
                              </p>
                            </div>

                            {contact.adminResponse && (
                              <div>
                                <h5 className="text-xs font-medium text-green-400 mb-1">
                                  Admin Response:
                                </h5>
                                <p className="text-xs text-gray-300 bg-green-500/10 border border-green-500/20 p-2 rounded">
                                  {contact.adminResponse}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Responded on{" "}
                                  {new Date(
                                    contact.respondedAt
                                  ).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No previous messages</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContactUs;
