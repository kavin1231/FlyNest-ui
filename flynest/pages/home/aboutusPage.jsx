import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plane,
  Shield,
  Clock,
  Users,
  Globe,
  Star,
  Eye,
  Coffee,
  Target,
  Zap,
  Heart,
} from "lucide-react";
import Header from "../../components/Header";

const AboutUsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mission");
  const [counter, setCounter] = useState({
    flights: 0,
    customers: 0,
    destinations: 0,
    satisfaction: 0,
  });
  const whoWeAreRef = useRef(null);

  // Counter animation
  useEffect(() => {
    const animateCounter = () => {
      const targets = {
        flights: 50000,
        customers: 100000,
        destinations: 500,
        satisfaction: 98,
      };
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounter({
          flights: Math.floor(targets.flights * progress),
          customers: Math.floor(targets.customers * progress),
          destinations: Math.floor(targets.destinations * progress),
          satisfaction: Math.floor(targets.satisfaction * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounter(targets);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateCounter, 500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToWhoWeAre = () => {
    if (whoWeAreRef.current) {
      whoWeAreRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const stats = [
    {
      icon: Plane,
      label: "Flights Booked",
      value: counter.flights,
      suffix: "+",
    },
    {
      icon: Users,
      label: "Happy Customers",
      value: counter.customers,
      suffix: "+",
    },
    {
      icon: Globe,
      label: "Destinations",
      value: counter.destinations,
      suffix: "+",
    },
    {
      icon: Star,
      label: "Satisfaction Rate",
      value: counter.satisfaction,
      suffix: "%",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description:
        "Your data is protected with enterprise-grade security and encryption.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Get instant notifications about flight changes and updates.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Search and book flights in seconds with our optimized platform.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Heart,
      title: "24/7 Support",
      description: "Our dedicated team is here to help you anytime, anywhere.",
      color: "from-red-500 to-red-600",
    },
  ];

  const teamMembers = [
    {
      name: "Kavin Fernando",
      role: "CEO & Founder",
      image: "/ceo photo.jpg",
      bio: "Aviation industry veteran with 15+ years of experience",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Tech innovator passionate about revolutionizing travel",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Customer Experience",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Customer service expert dedicated to seamless experiences",
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Full-stack developer building the future of travel tech",
    },
  ];

  const tabContent = {
    mission: {
      title: "Our Mission",
      icon: Target,
      content:
        "To democratize air travel by making flight booking accessible, transparent, and effortless for everyone. We believe that exploring the world should be simple, not stressful.",
    },
    vision: {
      title: "Our Vision",
      icon: Eye,
      content:
        "To become the world's most trusted and innovative flight booking platform, connecting people to their dreams and destinations with unparalleled ease and reliability.",
    },
    values: {
      title: "Our Values",
      icon: Coffee,
      content:
        "Innovation, transparency, customer-centricity, and sustainability drive everything we do. We're committed to making travel better for our customers and the planet.",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-20"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1200),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
              <Plane className="w-10 h-10 text-slate-900" />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About FlyNest
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Revolutionizing air travel with cutting-edge technology and
            unparalleled customer experience
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={scrollToWhoWeAre}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-semibold rounded-full hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
            <button
              onClick={() => navigate("/contactus")}
              className="px-8 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Contact Us
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={itemVariants}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-slate-900" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section
        className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"
        ref={whoWeAreRef}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Who We Are
          </motion.h2>

          <div className="flex flex-wrap justify-center mb-8 space-x-4">
            {Object.entries(tabContent).map(([key, tab]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === key
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                {React.createElement(tab.icon, {
                  className: "w-5 h-5 inline mr-2",
                })}
                {tab.title}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            className="from-yellow-400/10 to-transparent bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-8 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
              {React.createElement(tabContent[activeTab].icon, {
                className: "w-8 h-8 text-slate-900",
              })}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              {tabContent[activeTab].title}
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              {tabContent[activeTab].content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Why Choose FlyNest?
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="from-yellow-400/10 to-transparent bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                variants={itemVariants}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full mb-4`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="from-yellow-400/10 to-transparent bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300"
                variants={itemVariants}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-yellow-400/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {member.name}
                </h3>
                <p className="text-yellow-400 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Ready to Fly with Us?
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join millions of travelers who trust FlyNest for their journey
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => navigate("/flights")}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold rounded-full hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
            >
              Start Booking Now
            </button>
            <button
              onClick={() => navigate("/contactus")}
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
            >
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
