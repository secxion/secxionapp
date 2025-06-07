import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../Context";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchUserDetails } = useContext(Context);
  const navigate = useNavigate();

  // Slider verification
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [sliderSignature, setSliderSignature] = useState("");

  useEffect(() => {
    if (verificationVisible) {
      fetchSliderTarget();
    }
  }, [verificationVisible]);

  const fetchSliderTarget = async () => {
    try {
      const res = await fetch("/api/slider-verification");
      const { target, signature } = await res.json();
      setTargetValue(target);
      setSliderSignature(signature);
      setSliderValue(0);
      setIsVerified(false);
    } catch {
      toast.error("Failed to load verification.");
    }
  };

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    setIsVerified(Math.abs(val - targetValue) <= 3);
  };

  const handleVerificationComplete = async () => {
    if (!isVerified) return;

    setFormSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sliderValue,
          targetValue,
          slider: { value: sliderValue, signature: sliderSignature },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUserDetails();
        navigate("/home");
      } else {
        setErrorMessage(result.message || "Invalid credentials. Please try again.");
        toast.error(result.message);
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setFormSubmitting(false);
      setVerificationVisible(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    setResending(true);
    try {
      const res = await fetch(SummaryApi.resendVEmail.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();
      result.success ? toast.success("Verification email sent.") : toast.error(result.message || "Failed to resend.");
    } catch {
      toast.error("Error resending verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLoginClick = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setVerificationVisible(true);
  };

  return (
    <section className="w-screen h-screen flex items-center justify-center bg-black fixed top-0 left-0 z-50">
      <div className="bg-gray-900 p-8 w-full max-w-md rounded-md shadow-lg text-white">
        <div className="text-center">
          <h1 className="minecraft-font justify-center md:flex items-center font-extrabold text-transparent text-2xl bg-clip-text tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            SXN
          </h1>
          <p className="text-gray-300 text-sm mt-2">Login to your Account</p>
        </div>

        <form className="w-full mt-6 flex flex-col gap-4" onSubmit={onLoginClick}>
          <div>
            <label htmlFor="email" className="block text-gray-300 font-semibold mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full bg-gray-800 p-3 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-400"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full bg-gray-800 p-3 pr-10 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-400"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <Link to="/reset" className="block text-right text-sm text-cyan-400 hover:underline mt-1">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className={`w-full py-3 rounded-md font-bold text-white transition duration-300 ${
              formSubmitting ? "bg-cyan-600 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {formSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center text-red-500 text-sm">
            <p>{errorMessage}</p>
            {errorMessage.toLowerCase().includes("verify") && (
              <button
                onClick={handleResendVerificationEmail}
                disabled={resending}
                className="mt-2 text-cyan-400 hover:underline text-sm"
              >
                {resending ? "Resending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-cyan-400 hover:underline font-medium">Sign up</Link>
        </p>

        <Link to="/contact-us" className="block mt-4 text-center text-gray-400 hover:text-cyan-400 text-sm">
          Contact Us
        </Link>

        <p className="mt-6 text-center text-gray-600 text-xs select-none">
          © 2025 <a href="https://secxion.com" className="hover:underline">secxion.com</a>
        </p>
      </div>

      {/* Slider Verification Modal */}
      {verificationVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60 p-4">
          <div className="bg-gray-900 p-6 rounded-md shadow-lg max-w-sm w-full text-white">
            <h2 className="text-xl font-bold mb-4 text-center">Verify You're Human</h2>
            <p className="text-sm mb-4 text-center">
              Slide the slider to <span className="font-bold text-cyan-400">{targetValue}</span> to verify.
            </p>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full accent-cyan-400 mb-4"
            />

            <div className="text-center mb-4">
              <span className="font-semibold">Your Value:</span> {sliderValue}
            </div>

            <button
              onClick={handleVerificationComplete}
              disabled={!isVerified}
              className={`w-full py-3 rounded-md font-bold transition ${
                isVerified ? "bg-cyan-500 hover:bg-cyan-600" : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              {isVerified ? "Verify & Login" : "Slide to Verify"}
            </button>

            <button
              onClick={() => setVerificationVisible(false)}
              className="mt-3 w-full py-2 text-center text-gray-400 hover:text-gray-200 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;
