import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import uploadImage from "../helpers/uploadImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "./Login.css";
import signupBackground from "./signupbk.png";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [clock, setClock] = useState(new Date());

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("signupData");
    return saved
      ? JSON.parse(saved)
      : {
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: "",
        tag: "",
        telegramNumber: "",
      };
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("signupData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;
  const isValidTelegram = (number) => /^(\+?\d{7,15})$/.test(number);

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      toast.info("Uploading image... ⏳");
      const uploadedImage = await uploadImage(file);
      setData((prev) => ({ ...prev, profilePic: uploadedImage.url }));
      toast.success("Profile picture uploaded successfully! 📸");
    } catch (error) {
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const goToStep = (s) => setStep(s);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name) return setStep(1);
    if (!data.email || !isValidEmail(data.email)) return setStep(2);
    if (!data.telegramNumber || !isValidTelegram(data.telegramNumber)) return setStep(3);
    if (!isValidPassword(data.password) || data.password !== data.confirmPassword) return setStep(4);
    if (!data.profilePic) return toast.error("Please upload a profile picture.");
    if (!agreedToTerms) return toast.error("You must agree to terms.");

    setLoading(true);

    try {
      const response = await fetch(SummaryApi.signUP.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        localStorage.removeItem("signupData");
        toast.success("🎉 Signup successful! ₦900 bonus awarded. Verify your email.");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        if (responseData.message?.toLowerCase().includes("email")) setStep(2);
        toast.error(responseData?.message || "Signup failed.");
      }
    } catch (error) {
      toast.error("🚫 Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <section
      className="fixed inset-0 flex flex-col justify-between z-50 bg-cover bg-center"
      style={{ backgroundImage: `url(${signupBackground})` }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full animate-pulse bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Sign Up Form Box */}
      <div className="relative z-10 flex items-center justify-center grow px-4">
        <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-8 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link
              to="/"
              className="font-bold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wide"
            >
              <div className="logo-wrapper">
                <h1 className="text-3xl logo-text font-extrabold tracking-wide">SXN</h1>
                <div className="logo-accent" />
              </div>
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Create Your Account
          </h2>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    n <= step 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {n}
                </div>
                {n < 5 && (
                  <div
                    className={`h-1 w-full mt-2 rounded-full transition-all duration-300 ${
                      n < step ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  variants={stepVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Personal Information
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Let's start with your basic details
                    </p>
                  </div>
                  
                  <InputField 
                    label="Full Name" 
                    name="name" 
                    value={data.name} 
                    onChange={handleOnChange} 
                    placeholder="Enter your full name"
                    required 
                  />
                  <InputField 
                    label="Tag (Optional)" 
                    name="tag" 
                    value={data.tag} 
                    onChange={handleOnChange} 
                    placeholder="Your unique tag"
                  />
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      onClick={() => goToStep(2)} 
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  variants={stepVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Email Address
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll use this to verify your account
                    </p>
                  </div>
                  
                  <InputField 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    value={data.email} 
                    onChange={handleOnChange} 
                    placeholder="Enter your email address"
                    required 
                  />
                  
                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => goToStep(1)} 
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => goToStep(3)} 
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  variants={stepVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Contact Information
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your Telegram number
                    </p>
                  </div>
                  
                  <InputField 
                    label="Telegram Number" 
                    name="telegramNumber" 
                    value={data.telegramNumber} 
                    onChange={handleOnChange} 
                    placeholder="+1234567890"
                  />
                  
                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => goToStep(2)} 
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => goToStep(4)} 
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4" 
                  variants={stepVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Secure Your Account
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create a strong password (minimum 6 characters)
                    </p>
                  </div>
                  
                  <PasswordField 
                    label="Password" 
                    name="password" 
                    value={data.password} 
                    onChange={handleOnChange} 
                    show={showPassword} 
                    toggle={() => setShowPassword((prev) => !prev)} 
                  />
                  <PasswordField 
                    label="Confirm Password" 
                    name="confirmPassword" 
                    value={data.confirmPassword} 
                    onChange={handleOnChange} 
                    show={showConfirmPassword} 
                    toggle={() => setShowConfirmPassword((prev) => !prev)} 
                  />
                  
                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => goToStep(3)} 
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => goToStep(5)} 
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div 
                  key="step5" 
                  variants={stepVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit" 
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Final Step
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add a profile picture and agree to terms
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Profile Picture
                    </label>
                    <div className="flex flex-col items-center space-y-4">
                      {data.profilePic && (
                        <div className="relative">
                          <img 
                            src={data.profilePic} 
                            alt="Preview" 
                            className="h-24 w-24 rounded-full shadow-lg" 
                          />
                          <div className="absolute inset-0 h-24 w-24">
                            <div className="h-full w-full bg-white dark:bg-gray-900"></div>
                          </div>
                          <img 
                            src={data.profilePic} 
                            alt="Preview" 
                            className="absolute inset-1 h-22 w-22 rounded object-cover mx-auto" 
                          />
                        </div>
                      )}
                      
                      <label className="cursor-pointer">
                        <div className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {uploading ? "Uploading..." : "Choose Profile Picture"}
                          </span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleUploadPic} 
                          className="hidden" 
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      I agree to the{" "}
                      <Link 
                        to="/terms" 
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link 
                        to="/privacy" 
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button 
                      type="button" 
                      onClick={() => goToStep(4)} 
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploading || !data.profilePic || !agreedToTerms}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                      {loading ? "Creating Account..." : uploading ? "Uploading..." : "Create Account 🚀"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center text-xs text-white p-4 bg-black/40 backdrop-blur-sm">
        <div className="flex justify-center items-center space-x-4">
          <Link to="/contact" className="hover:underline">Contact Us</Link>
          <span>|</span>
          <span>© 2025 secxion.com</span>
        </div>
        <div className="mt-2 text-white/80">
          {clock.toLocaleDateString()} • {clock.toLocaleTimeString()}
        </div>
      </footer>
    </section>
  );
};

const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  required = false 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
    />
  </div>
);

const PasswordField = ({ label, name, value, onChange, show, toggle }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        required
        className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
      />
      <button 
        type="button" 
        onClick={toggle} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
      >
        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  </div>
);

export default SignUp;