import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Corrected import for consistency
import { Link, useNavigate } from "react-router-dom";
import uploadImage from "../helpers/uploadImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import signupBackground from "./signupbk.png";
import LogoShimmer from "../Components/LogoShimmer";
import Navigation from '../Components/Navigation';


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
                  <Navigation currentPage="dashboard" />
      
      {/* Overlay for dark mode compatibility on background */}
      <div className="absolute inset-0 bg-black/70 z-0"></div> {/* Increased opacity for theme */}

      {/* Sign Up Form Box - Updated for black and yellow theme */}
      <div className="relative z-10 flex items-center justify-center mt-11 grow px-4 py-8">
        <div className="bg-gray-900 bg-opacity-95 w-full max-w-lg p-8 pt-4 py-2 shadow-2xl rounded-2xl border border-gray-700 backdrop-blur-md">
            <div className="flex items-center">
                        <a href="/" className="relative">
                           <div className=" flex py-1 flex-col justify-center">
                                                                          <div className="relative py-2  sm:mx-auto ">
                                                                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg transform rounded-3xl border-4 border-yellow-700"></div>
                                                                              <div className="relative px-4 p-1.5 bg-white shadow-lg rounded-2xl sm:p-1.5 border-4 border-yellow-700">
                                                                                  <div className="">
                                                                                      <div className="grid grid-cols-1">                    
                                                                                          <LogoShimmer type="button" />
                                                                                      </div>
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                      <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
                          
                        </a>
                      </div>

          <h2 className="text-xl font-bold mb-6 text-center text-gray-100">Sign Up Wizard</h2> {/* Updated text color */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`h-2 flex-1 mx-1 rounded-full transition-all ${
                  n <= step ? "bg-yellow-600" : "bg-gray-700" // Updated progress bar colors
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
                    <button type="button" onClick={() => goToStep(2)} className="btn-next bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-medium py-2 px-4 rounded transition">Next →</button> {/* Updated button styling */}
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <InputField label="Email" name="email" type="email" value={data.email} onChange={handleOnChange} required placeholder="you@example.com" />
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(1)} className="btn-back bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded transition">← Back</button> {/* Updated button styling */}
                    <button type="button" onClick={() => goToStep(3)} className="btn-next bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-medium py-2 px-4 rounded transition">Next →</button> {/* Updated button styling */}
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <InputField label="Telegram Number (Optional)" name="telegramNumber" value={data.telegramNumber} onChange={handleOnChange} placeholder="+1234567890 (optional)" />
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(2)} className="btn-back bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded transition">← Back</button> {/* Updated button styling */}
                    <button type="button" onClick={() => goToStep(4)} className="btn-next bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-medium py-2 px-4 rounded transition">Next →</button> {/* Updated button styling */}
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <PasswordField label="Password" name="password" value={data.password} onChange={handleOnChange} show={showPassword} toggle={() => setShowPassword((prev) => !prev)} />
                  <PasswordField label="Confirm Password" name="confirmPassword" value={data.confirmPassword} onChange={handleOnChange} show={showConfirmPassword} toggle={() => setShowConfirmPassword((prev) => !prev)} />
                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(3)} className="btn-back bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded transition">← Back</button> {/* Updated button styling */}
                    <button type="button" onClick={() => goToStep(5)} className="btn-next bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-medium py-2 px-4 rounded transition">Next →</button> {/* Updated button styling */}
                  </div>
                </motion.div>
              )}
              {step === 5 && (
                <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Profile Picture</label> {/* Updated text color */}
                    {/* File input also gets a bold yellow border */}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUploadPic} 
                      className="w-full p-2 border-2 border-yellow-600 bg-gray-800 text-sm rounded 
                                 text-gray-100 
                                 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                                 file:text-sm file:font-semibold file:bg-yellow-500 file:text-gray-900 
                                 hover:file:bg-yellow-600" // Updated colors for file input
                    />
                  </div>

                  {data.profilePic && (
                    <div className="flex justify-center my-4">
                       <img src={data.profilePic} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover shadow-lg border-2 border-yellow-500" /> {/* Updated border color */}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center px-1 bg-gray-800 border-2 border-yellow-600 rounded focus-within:ring-yellow-500 focus-within:border-yellow-500"> {/* Updated colors */}
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 text-yellow-600 border-gray-700 rounded focus:ring-yellow-500 bg-gray-800 checked:bg-yellow-500" // Updated checkbox colors
                      />
                    </div>
                    
                    <label htmlFor="terms" className="text-sm text-gray-300 leading-snug"> {/* Updated text color */}
                      I agree to the{" "}
                      <Link to="/terms" className="text-yellow-500 hover:underline">terms and conditions</Link> {/* Updated link color */}
                    </label>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => goToStep(4)} className="btn-back bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium py-2 px-4 rounded transition">← Back</button> {/* Updated button styling */}
                    <button
                      type="submit"
                      disabled={loading || uploading || !data.profilePic || !agreedToTerms} 
                      className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 text-sm font-medium py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed" // Updated button styling
                    >
                      {loading ? "Signing Up..." : uploading ? "Uploading..." : "Sign Up 🚀"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400"> {/* Updated text color */}
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 hover:underline font-medium"> {/* Updated link color */}
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Updated for black and yellow theme */}
      <footer className="relative z-10 text-center text-xs text-gray-400 p-3 bg-black/50 backdrop-blur-sm shadow-inner sm:shadow-none"> {/* Updated text color and background opacity */}
        Contact Us | © {new Date().getFullYear()} secxion.com
        <br />
        {clock.toLocaleDateString()} {clock.toLocaleTimeString()}
      </footer>
    </section>
  );
};

// Reusable InputField component - Updated for black and yellow theme
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label> {/* Updated text color */}
    <div className="flex items-center p-2 bg-gray-800 border-2 border-yellow-600 rounded focus-within:ring-yellow-500 focus-within:border-yellow-500"> {/* Updated background, border, and focus ring */}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-2 bg-transparent text-sm rounded focus:ring-0 focus:outline-none text-gray-100 placeholder-gray-400" // Removed redundant border, updated text/placeholder
      />
    </div>
  </div>
);

// Reusable PasswordField component - Updated for black and yellow theme
const PasswordField = ({ label, name, value, onChange, show, toggle }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label> {/* Updated text color */}
    <div 
      className="flex items-center p-2 bg-gray-800 border-2 border-yellow-600 rounded focus-within:ring-yellow-500 focus-within:border-yellow-500" // Updated background, border, and focus ring
    >
      <input
        id={name}
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        required
        className="flex-1 bg-transparent outline-none text-sm text-gray-100 placeholder-gray-400" // Updated text/placeholder
      />
      <button type="button" onClick={toggle} className="text-yellow-500 ml-2 p-1 rounded-full hover:bg-gray-700 transition-colors"> {/* Updated icon color and hover background */}
        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  </div>
);

export default SignUp;
