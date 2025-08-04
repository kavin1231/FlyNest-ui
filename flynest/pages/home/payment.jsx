import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, AlertCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import LoadingSpinner from "./loadingSpinner.jsx";
import Header from "../../components/Header.jsx";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({
  clientSecret,
  flight,
  searchData,
  passengers,
  setError,
  setLoading,
  loading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe has not loaded. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // First, submit the payment element to validate the form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Form submission error:", submitError);
        setError(submitError.message || "Please fill in all payment details.");
        setLoading(false);
        return;
      }

      // Create booking first (before payment confirmation)
      const bookingResponse = await axios.post(
        `${BackendUrl}/api/bookings`,
        {
          flightId: flight._id,
          seatsBooked: searchData.seats,
          passengers: passengers.map((p) => ({
            name: `${p.firstName} ${p.lastName}`,
            age: p.age,
            passportNumber: p.phone,
          })),
          customerName:
            passengers[0]?.firstName + " " + passengers[0]?.lastName,
          customerAddress: "Customer Address",
          customerPhone: passengers[0]?.phone,
        },
        { headers: getAuthHeaders() }
      );

      const booking = bookingResponse.data;

      // Now confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Stripe payment error:", error);
        setError(error.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create Payment record in your database
        const paymentResponse = await axios.post(
          `${BackendUrl}/api/payments`,
          {
            bookingId: booking._id,
            paymentIntentId: paymentIntent.id,
            amount: flight.price * searchData.seats,
            method: "credit",
          },
          { headers: getAuthHeaders() }
        );

        // Navigate to confirmation WITHOUT updating status
        navigate("/confirmation", {
          state: {
            flight,
            searchData,
            passengers,
            booking: { ...booking, status: "pending" },
            payment: paymentResponse.data,
            paymentIntentId: paymentIntent.id,
          },
        });
      } else {
        setError("Payment was not completed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Payment processing error:", err);

      // More specific error handling
      if (err.response?.status === 401) {
        setError("Please log in to complete your booking.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 403) {
        setError("You don't have permission to make this booking.");
      } else if (err.response?.status === 404) {
        setError("Service not found. Please contact support.");
      } else {
        setError(
          err.response?.data?.error ||
            err.message ||
            "An error occurred while processing your payment. Please try again."
        );
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-800/30 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card"],
          }}
        />
      </div>
      <motion.button
        type="submit"
        disabled={!stripe || !elements || loading}
        whileHover={{ scale: !stripe || !elements || loading ? 1 : 1.05 }}
        whileTap={{ scale: !stripe || !elements || loading ? 1 : 0.95 }}
        className={`w-full py-4 gold-gradient text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-shadow text-lg ${
          !stripe || !elements || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading
          ? "Processing Payment..."
          : `Pay $${(flight.price * searchData.seats).toFixed(2)}`}
      </motion.button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchData, passengers } = location.state || {};
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Fetch PaymentIntent client secret from backend
  useEffect(() => {
    // Validation check first
    if (
      !flight ||
      !searchData ||
      !passengers ||
      !Number.isInteger(searchData.seats) ||
      searchData.seats <= 0
    ) {
      setError("Missing or invalid booking data. Redirecting to home...");
      setTimeout(() => navigate("/home", { replace: true }), 3000);
      return;
    }

    const fetchClientSecret = async () => {
      setLoading(true);
      setError("");

      try {
        console.log(
          "Fetching payment intent for amount:",
          flight.price * searchData.seats
        );

        const response = await axios.post(
          `${BackendUrl}/api/create-payment-intent`,
          {
            amount: flight.price * searchData.seats,
            currency: "usd",
            metadata: {
              flightId: flight._id,
              seats: searchData.seats,
              passengers: JSON.stringify(
                passengers.map((p) => ({
                  name: `${p.firstName} ${p.lastName}`,
                  age: p.age,
                }))
              ),
            },
          },
          { headers: getAuthHeaders() }
        );

        console.log("Payment intent response:", response.data);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);

        // More specific error handling
        if (err.response?.status === 401) {
          setError("Please log in to continue with payment.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 403) {
          setError("You don't have permission to create a payment.");
        } else {
          setError(
            err.response?.data?.error ||
              err.message ||
              "Failed to initialize payment. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [flight, searchData, passengers, navigate, BackendUrl]);

  // Validation check for rendering
  if (
    !flight ||
    !searchData ||
    !passengers ||
    !Number.isInteger(searchData.seats) ||
    searchData.seats <= 0 ||
    passengers.length !== searchData.seats
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="glassmorphism-card rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Invalid Booking Data
          </h2>
          <p className="text-gray-400 mb-6">
            Please complete the booking process. Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  if (loading && !clientSecret) {
    return <LoadingSpinner message="Loading payment form..." />;
  }

  const appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#f59e0b",
      colorBackground: "#1e293b",
      colorText: "#f1f5f9",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      borderRadius: "8px",
    },
  };

  const options = {
    clientSecret,
    appearance,
    loader: "auto",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <Header />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Payment</h1>
          <p className="text-gray-400">
            Complete your payment for {searchData.seats} passenger(s)
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
          >
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </p>
          </motion.div>
        )}

        {/* Flight Summary */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Flight Summary</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">
                {flight.airline} {flight.flightNumber}
              </p>
              <p className="text-gray-400">
                {flight.departure?.airport || flight.from} →{" "}
                {flight.arrival?.airport || flight.to}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">
                ${(flight.price * searchData.seats).toFixed(2)}
              </p>
              <p className="text-gray-400">{flight.class}</p>
            </div>
          </div>

          {/* Passenger Summary */}
          <div className="border-t border-slate-600 pt-4">
            <h3 className="text-lg font-medium mb-2">
              Passengers ({passengers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {passengers.map((passenger, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                  <p className="font-medium text-sm">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {passenger.age} years • {passenger.gender}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism-card rounded-2xl p-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Details
          </h2>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                clientSecret={clientSecret}
                flight={flight}
                searchData={searchData}
                passengers={passengers}
                setError={setError}
                setLoading={setLoading}
                loading={loading}
              />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <LoadingSpinner message="Initializing payment..." />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
