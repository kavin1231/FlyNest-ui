import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  KeyRound, 
  X, 
  Camera,
  Save,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Upload
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import mediaUpload from "../../utils/mediaUpload.jsx";

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${BackendUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUser(response.data);
      setEditData(response.data);
    } catch (err) {
      setError("Failed to load profile data");
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const imageUrl = await mediaUpload(file);
      
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BackendUrl}/api/users/upload-profile-picture`,
        { imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(prev => ({ ...prev, profilePicture: imageUrl }));
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.put(
        `${BackendUrl}/api/users/profile`,
        {
          firstname: editData.firstname,
          lastname: editData.lastname,
          phone: editData.phone,
          address: editData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data.user);
      setSuccess("Profile updated successfully!");
      setShowEditModal(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BackendUrl}/api/users/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setSuccess("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    }
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowPasswordModal(false);
    setError("");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    if (user) setEditData(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <div className="text-lg text-gray-300">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-300">Unable to load profile</div>
          {error && <div className="text-red-400 mt-2">{error}</div>}
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 gold-gradient text-slate-900 rounded-lg hover:shadow-lg transition-shadow"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-900 text-white"
    >
      <Header />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Alert Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-green-400">{success}</p>
                </div>
                <button onClick={() => setSuccess("")} className="text-green-400 hover:text-green-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-400">{error}</p>
                </div>
                <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Profile Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glassmorphism-card rounded-2xl p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-yellow-400/20 shadow-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-900 text-2xl font-bold" style={{ display: user.profilePicture ? 'none' : 'flex' }}>
                    {user.firstname?.[0]?.toUpperCase()}{user.lastname?.[0]?.toUpperCase()}
                  </div>
                </div>
                
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="h-6 w-6 text-white" />
                    )}
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {user.firstname} {user.lastname}
                </h1>
                <p className="text-gray-400 capitalize mb-4 flex items-center justify-center md:justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  {user.role}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center justify-center px-4 py-2 gold-gradient text-slate-900 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glassmorphism-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6 text-yellow-400">Personal Information</h2>
              <div className="space-y-4">
                <InfoRow 
                  icon={<Mail className="h-5 w-5" />} 
                  label="Email" 
                  value={user.email} 
                />
                <InfoRow 
                  icon={<Phone className="h-5 w-5" />} 
                  label="Phone" 
                  value={user.phone || "Not provided"} 
                />
                <InfoRow 
                  icon={<MapPin className="h-5 w-5" />} 
                  label="Address" 
                  value={user.address || "Not provided"} 
                />
              </div>
            </motion.div>

            {/* Account Information */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glassmorphism-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6 text-yellow-400">Account Information</h2>
              <div className="space-y-4">
                <InfoRow 
                  icon={<User className="h-5 w-5" />} 
                  label="Account Type" 
                  value={user.role} 
                />
                <InfoRow 
                  icon={<Shield className="h-5 w-5" />} 
                  label="Status" 
                  value={user.isBlocked ? "Blocked" : "Active"}
                  valueColor={user.isBlocked ? "text-red-400" : "text-green-400"}
                />
                <InfoRow 
                  icon={<CheckCircle className="h-5 w-5" />} 
                  label="Email Verified" 
                  value={user.emailVerified ? "Verified" : "Not Verified"}
                  valueColor={user.emailVerified ? "text-green-400" : "text-yellow-400"}
                />
                <InfoRow 
                  icon={<Calendar className="h-5 w-5" />} 
                  label="Member Since" 
                  value={new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glassmorphism-card rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={editData.firstname || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, firstname: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-400 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editData.lastname || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, lastname: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-400 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editData.phone || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-400 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={editData.address || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-400 text-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="flex items-center px-4 py-2 gold-gradient text-slate-900 rounded-lg hover:shadow-lg transition-shadow"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glassmorphism-card rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Current Password", key: "currentPassword" },
                { label: "New Password", key: "newPassword" },
                { label: "Confirm New Password", key: "confirmPassword" }
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                  </label>
                  <input
                    type="password"
                    value={passwordData[key]}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-yellow-400 text-white"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex items-center px-4 py-2 gold-gradient text-slate-900 rounded-lg hover:shadow-lg transition-shadow"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

const InfoRow = ({ icon, label, value, valueColor = "text-gray-300" }) => (
  <div className="flex items-center gap-4">
    <div className="text-yellow-400 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`font-medium ${valueColor}`}>{value}</p>
    </div>
  </div>
);