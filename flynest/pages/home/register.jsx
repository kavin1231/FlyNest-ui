import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Header from "../../components/Header.jsx";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const BackendUrl = import.meta.env.VITE_BACKEND_URL;

    const { firstname, lastname, email, password, confirmPassword } = formData;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading("Creating your account...");
    
    axios
      .post(`${BackendUrl}/api/users/`, {
        firstname,
        lastname,
        email,
        password,
      })
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success("Registration successful! Welcome aboard!");
        navigate("/");
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error(err?.response?.data?.error || "Registration failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className="flex min-h-screen w-full bg-cover bg-center bg-no-repeat items-center justify-center relative"
      style={{ backgroundImage: `url('/bglg.jpg')` }}
    >
      <Header />
      
      {/* Toast Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: 'red',
              secondary: 'black',
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
      
      <motion.img
        src="/planehero.png"
        alt="Airplane"
        className="absolute w-[80%] max-w-[80%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90 z-10"
        initial={{ x: "100vw", opacity: 0 }}
        animate={{
          x: [0, -20, 20, -20, 0],
          y: [0, -15, 15, -15, 0],
          rotate: [0, 2, -2, 2, 0],
          opacity: 1,
        }}
        transition={{
          x: { duration: 0 },
          opacity: { duration: 1.5 },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          },
          y: {
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <form
        onSubmit={handleOnSubmit}
        className="relative z-10 md:w-96 w-full max-w-sm flex flex-col items-center bg-black/30 backdrop-blur-md border border-white/50 p-8 rounded-2xl shadow-2xl mt-20"
        style={{
          boxShadow:
            "0 0 40px rgba(255, 255, 255, 0.1), 0 0 80px rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
        data-aos="fade-up"
      >
        <h2
          className="text-4xl text-white font-medium drop-shadow-lg"
          data-aos="zoom-in"
        >
          Sign up
        </h2>
        <p
          className="text-sm text-gray-200 mt-3 drop-shadow-md"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Create your account to get started
        </p>

        {[
          { label: "Firstname", name: "firstname", type: "text", delay: 200 },
          { label: "Lastname", name: "lastname", type: "text", delay: 250 },
          { label: "Email", name: "email", type: "email", delay: 300 },
          { label: "Password", name: "password", type: "password", delay: 400 },
          {
            label: "Confirm Password",
            name: "confirmPassword",
            type: "password",
            delay: 500,
          },
        ].map((field, idx) => (
          <div
            key={idx}
            className="w-full mt-4"
            data-aos="fade-up"
            data-aos-delay={field.delay}
          >
            <div className="flex items-center bg-transparent border border-white/40 h-12 hover:border-yellow-400 rounded-full overflow-hidden pl-6 gap-2">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.label}
                className="bg-transparent text-white placeholder-white-500 outline-none text-sm w-full h-full"
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
                required
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full h-11 rounded-full text-black font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          {isLoading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-gray-200 text-sm mt-4" data-aos-delay="700">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors duration-300"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}