import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import Header from "../../components/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [rememberTouched, setRememberTouched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rememberTouched) {
      toast.error("Please confirm your 'Remember Me' preference.");
      return;
    }

    const BackendUrl = import.meta.env.VITE_BACKEND_URL;

    axios
      .post(`${BackendUrl}/api/users/login`, {
        email,
        password,
        rememberMe: remember,
      })
      .then((res) => {
        toast.success("Login successful!");
        const user = res.data.user;
        localStorage.setItem("token", res.data.token);

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "customer") {
          navigate("/home");
        }
      })
      .catch(() => {
        toast.error("Login failed. Please check your credentials.");
      });
  };

  return (
    <div
      className="flex min-h-screen w-full bg-cover bg-center bg-no-repeat items-center justify-center relative"
      style={{
        backgroundImage: `url('/bglg.jpg')`,
      }}
    >
      <Header />
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
          x: { duration: 0 }, // plane enters quickly
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

      <div className="absolute inset-0 bg-gradient bg-opacity-100 z-0"></div>
      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 md:w-96 w-full max-w-sm flex flex-col items-center bg-black/30 backdrop-blur-md border border-white/50 p-8 rounded-2xl shadow-2xl"
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
          Sign in
        </h2>
        <p
          className="text-sm text-gray-200 mt-3 drop-shadow-md"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Welcome back! Please sign in to continue
        </p>

        {/* Divider */}
        <div
          className="flex items-center gap-4 w-full my-5"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
          <p className="text-nowrap text-sm text-gray-200">
            or sign in with email
          </p>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>

        {/* Email Input */}
        <div
          className="flex items-center w-full bg-transparent border border-white/40 h-12 rounded-full overflow-hidden pl-6 gap-2 hover:border-yellow-400 transition-all duration-300 focus-within:border-yellow-400 focus-within:shadow-yellow-400/20"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-white placeholder-white/60 outline-none text-sm w-full h-full"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div
          className="flex items-center mt-6 w-full bg-transparent border border-white/40 h-12 rounded-full overflow-hidden pl-6 gap-2 hover:border-yellow-400 transition-all duration-300 focus-within:border-yellow-400 focus-within:shadow-yellow-400/20"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-white placeholder-white/60 outline-none text-sm w-full h-full"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Remember Me */}
        <div
          className="w-full flex items-center justify-between mt-8 text-white"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-yellow-400"
              checked={remember}
              onChange={(e) => {
                setRemember(e.target.checked);
                setRememberTouched(true);
              }}
            />
            Remember me
          </label>
          <a
            className="text-sm underline hover:text-yellow-400 transition-colors duration-300"
            href="#"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-8 w-full h-11 rounded-full text-black font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          Login
        </button>

        {/* Signup Link */}
        <p
          className="text-gray-200 text-sm mt-4"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          Don't have an account?{" "}
          <a
            className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors duration-300"
            href="/register"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
