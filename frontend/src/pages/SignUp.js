import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaFaEyeSlash } from "react-icons/fa";
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
    // Attempt to load saved data from localStorage, or initialize with empty strings
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

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("signupData", JSON.stringify(data));
  }, [data]);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Effect to log step changes - this is crucial for debugging
  useEffect(() => {
    console.log("Current form step state:", step);
  }, [step]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;
  // Regex for Telegram number: optional '+' followed by 7 to 15 digits
  const isValidTelegram = (number) => /^(\+?\d{7,15})$/.test(number); 

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    // Check file size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) { 
      toast.error("File size exceeds 2MB limit. Please choose a smaller image.");
      return;
    }

    setUploading(true);
    try {
      toast.info("Uploading image... ⏳");
      const uploadedImage = await uploadImage(file);
      setData((prev) => ({ ...prev, profilePic: uploadedImage.url }));
      toast.success("Profile picture uploaded successfully! 📸");
    } catch (error) {
      console.error("Upload error:", error); // Log detailed error
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const goToStep = (s) => setStep(s);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation before API call
    if (!data.name) {
      toast.error("Please enter your name.");
      return setStep(1);
    }
    if (!data.email || !isValidEmail(data.email)) {
      toast.error("Please enter a valid email address.");
      return setStep(2);
    }
    if (data.telegramNumber && !isValidTelegram(data.telegramNumber)) { // Telegram is optional, but if provided, validate
      toast.error("Please enter a valid Telegram number (7-15 digits, optional leading +).");
      return setStep(3);
    }
    if (!isValidPassword(data.password)) {
      toast.error("Password must be at least 6 characters long.");
      return setStep(4);
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return setStep(4);
    }
    if (!data.profilePic) {
      toast.error("Please upload a profile picture.");
      return setStep(5);
    }
    if (!agreedToTerms) {
      toast.error("You must agree to the terms and conditions to sign up.");
      return setStep(5);
    }

    setLoading(true);

      try {
      const response = await fetch(SummaryApi.signUP.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("Backend Response Data (Raw):", responseData); // KEEP THIS LOG!

      if (response.ok) {
        localStorage.removeItem("signupData");
        toast.success("🎉 Signup successful! Check your email inbox or spam for verification.");
        setTimeout(() => navigate("/login"), 2500); 
      } else {
        const backendMessage = responseData.message ? String(responseData.message).toLowerCase() : "";
        
        console.log("Processed Backend Message:", backendMessage);

        if (backendMessage.includes("email already exists") || (backendMessage.includes("user with email") && backendMessage.includes("already exists"))) {
          toast.error("This email is already registered. Please use a different email or log in.");
          setStep(2);
          console.log("Setting step to 2 for email error.");
        }
        else if (
            backendMessage.includes("display name") &&
            (backendMessage.includes("already exists") || backendMessage.includes("already taken"))
        ) {
          toast.error(responseData.message); // Display the specific name error
          setStep(1); // Direct user back to name step
          console.log("Setting step to 1 for name error (generic check matched).");
        }
        else if (backendMessage.includes("password")) {
          toast.error("Password issue: " + responseData.message);
          setStep(4);
          console.log("Setting step to 4 for password error.");
        } else {
          toast.error(responseData?.message || "Signup failed. Please try again.");
          console.log("Handling generic signup error or unhandled backend message.");
        }
      }
    } catch (error) {
      console.error("Network or API error:", error);
      toast.error("🚫 Signup failed due to a network error. Please check your connection and try again.");
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
      <div className="relative z-10 flex items-center justify-center grow px-4 py-8"> {/* Added py-8 for better spacing on smaller screens */}
        <div className="bg-white dark:bg-gray-800 w-full max-w-lg p-8 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-opacity-95 backdrop-blur-md">
          {/* Logo */}
          <div className="flex justify-center mb-5">
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

          <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Sign Up Wizard</h2>
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`h-2 flex-1 mx-1 rounded-full transition-all ${
                  n <= step ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <InputField label="Display Name" name="name" value={data.name} onChange={handleOnChange} required placeholder="Your unique username or display name" />
                  <InputField label="Tag (Optional)" name="tag" value={data.tag} onChange={handleOnChange} placeholder="e.g., ProTrader, CryptoEnthusiast" />
                  <div className="flex justify-between mt-6">
                    <div /> {/* Empty div for alignment */}
                    <button type="button" onClick={() => goToStep(2)} className="btn-next">Next →</button>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <InputField label="Email" name="email" type="email" value={data.email} onChange={handleOnChange} required placeholder="you@example.com" />
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(1)} className="btn-back">← Back</button>
                    <button type="button" onClick={() => goToStep(3)} className="btn-next">Next →</button>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <InputField label="Telegram Number (Optional)" name="telegramNumber" value={data.telegramNumber} onChange={handleOnChange} placeholder="+1234567890 (optional)" />
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(2)} className="btn-back">← Back</button>
                    <button type="button" onClick={() => goToStep(4)} className="btn-next">Next →</button>
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <PasswordField label="Password" name="password" value={data.password} onChange={handleOnChange} show={showPassword} toggle={() => setShowPassword((prev) => !prev)} />
                  <PasswordField label="Confirm Password" name="confirmPassword" value={data.confirmPassword} onChange={handleOnChange} show={showConfirmPassword} toggle={() => setShowConfirmPassword((prev) => !prev)} />
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(3)} className="btn-back">← Back</button>
                    <button type="button" onClick={() => goToStep(5)} className="btn-next">Next →</button>
                  </div>
                </motion.div>
              )}
              {step === 5 && (
                <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture</label>
                    {/* File input also gets a bold blue border */}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUploadPic} 
                      className="w-full p-2 border-2 border-blue-600 bg-gray-50 text-sm rounded 
                                 dark:bg-gray-700 dark:border-blue-600 dark:text-white 
                                 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                                 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                                 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800" 
                    />
                  </div>

                  {data.profilePic && (
                    <div className="flex justify-center my-4">
                       <img src={data.profilePic} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover shadow-lg border-2 border-blue-500" />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <div       className="flex items-center px-1 bg-gray-50 border-2 border-blue-600 rounded focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700 dark:border-blue-600"
><input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-500"
                    /></div>
                    
                    <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                      I agree to the{" "}
                      <Link to="/terms" className="text-blue-600 hover:underline dark:text-blue-400">terms and conditions</Link>
                    </label>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(4)} className="btn-back">← Back</button>
                    <button
                      type="submit"
                      disabled={loading || uploading || !data.profilePic || !agreedToTerms} 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      {loading ? "Signing Up..." : uploading ? "Uploading..." : "Sign Up 🚀"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium dark:text-blue-400">
              Login
            </Link>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center text-xs text-white p-3 bg-black/30 backdrop-blur-sm shadow-inner sm:shadow-none">
        Contact Us | © 2025 secxion.com
        <br />
        {clock.toLocaleDateString()} {clock.toLocaleTimeString()}
      </footer>
    </section>
  );
};

// Reusable InputField component
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <div className="flex items-center p-2 bg-gray-50 border-2 border-blue-600 rounded focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700 dark:border-blue-600"
>
      <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      // Applied classes for bolder blue border in both light and dark modes
      className="w-full p-2 bg-gray-50 border-2 border-blue-600 text-sm rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-blue-600 dark:text-white dark:placeholder-gray-400"
    /></div>
    
  </div>
);

// Reusable PasswordField component
const PasswordField = ({ label, name, value, onChange, show, toggle }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <div 
      className="flex items-center p-2 bg-gray-50 border-2 border-blue-600 rounded focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-700 dark:border-blue-600"
    >
      <input
        id={name}
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        required
        className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
      <button type="button" onClick={toggle} className="text-gray-600 dark:text-gray-400 ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  </div>
);

export default SignUp;