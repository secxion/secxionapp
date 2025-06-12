import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import SummaryApi from "../common";
import Context from "../Context";
import Logo from "../Assets/1.svg";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchUserDetails } = useContext(Context);
  const navigate = useNavigate();

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
      const res = await fetch(SummaryApi.sliderVerification.url, {
        method: SummaryApi.sliderVerification.method,
        credentials: "include"
      });

      if (!res.ok) throw new Error();

      const { target, signature } = await res.json();
      setTargetValue(target);
      setSliderSignature(signature);
      setSliderValue(0);
      setIsVerified(false);
    } catch {
      toast.error("Failed to load verification challenge.");
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
        slider: {
          value: sliderValue,
          signature: sliderSignature,
        },
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
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white border border-gray-300 p-6 sm:p-8 w-full max-w-md rounded-2xl shadow-xl">
        <div className="flex justify-center mb-5">
          <Link to="/">
            <img src={Logo} alt="Secxion Logo" className="w-24 h-auto" />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
          <p className="text-sm text-gray-500 mt-1">Login to your account</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onLoginClick}>
          <div>
            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              id="email" name="email" type="email" value={data.email} onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                id="password" name="password" type={showPassword ? "text" : "password"} value={data.password} onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-gray-100 p-3 pr-12 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <Link to="/reset" className="block text-right text-sm text-blue-600 hover:underline mt-1">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              formSubmitting
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
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
                className="mt-2 text-blue-600 hover:underline font-medium"
              >
                {resending ? "Resending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>

        <div className="mt-6 text-center text-xs text-gray-400">
          <Link to="/contact-us" className="hover:text-blue-500 transition-colors">
            Contact Us
          </Link>
          <span className="mx-2">|</span>
          <a href="https://secxion.com" className="hover:underline" target="_blank" rel="noopener noreferrer">
            © {new Date().getFullYear()} secxion.com
          </a>
        </div>
      </div>

      {/* Slider Verification */}
      {verificationVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl border shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">Human Verification</h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Slide to match: <span className="font-semibold text-blue-600">{targetValue}</span>
            </p>

            <input
              type="range" min="0" max="100" value={sliderValue} onChange={handleSliderChange}
              className="w-full h-2 accent-blue-500 mb-4"
            />

            <div className="text-center text-sm mb-3">
              <span className="text-gray-500">Current: </span>
              <span className="font-semibold">{sliderValue}</span>
            </div>

            <button
              onClick={handleVerificationComplete}
              disabled={!isVerified}
              className={`w-full py-2 rounded-md font-semibold transition ${
                isVerified ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isVerified ? "Verify & Login" : "Slide to Verify"}
            </button>

            <button
              onClick={() => setVerificationVisible(false)}
              className="mt-3 w-full text-sm text-gray-500 hover:text-blue-600"
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
