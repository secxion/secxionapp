// MODIFIED: Animated geometric lines + particle trails + input animation

import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import uploadImage from "../helpers/uploadImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import signupBackground from "./signupbk.png";
import "./Login.css";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <section className="fixed inset-0 flex items-center justify-center z-50 bg-cover bg-center" style={{ backgroundImage: `url(${signupBackground})` }}>
      {/* Animated Background Geometry */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:40px_40px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-lg p-8 shadow-2xl rounded-2xl border border-gray-300 bg-white bg-opacity-95">
        <div className="flex items-center justify-center mb-4 font-bold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
          <h1 className="font-extrabold tracking-wide">SXN</h1>
        </div>
        <h2 className="text-xl font-bold mb-6 text-center">Sign Up Wizard</h2>
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`h-2 flex-1 mx-1 rounded-full transition-all ${n <= step ? "bg-blue-600" : "bg-gray-300"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <InputField label="Name" name="name" value={data.name} onChange={handleOnChange} required />
                <InputField label="Tag" name="tag" value={data.tag} onChange={handleOnChange} />
                <div className="flex justify-end">
                  <button type="button" onClick={() => goToStep(2)} className="btn-next">Next →</button>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <InputField label="Email" name="email" type="email" value={data.email} onChange={handleOnChange} required />
                <div className="flex justify-between">
                  <button type="button" onClick={() => goToStep(1)} className="btn-back">← Back</button>
                  <button type="button" onClick={() => goToStep(3)} className="btn-next">Next →</button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <InputField label="Telegram Number" name="telegramNumber" value={data.telegramNumber} onChange={handleOnChange} />
                <div className="flex justify-between">
                  <button type="button" onClick={() => goToStep(2)} className="btn-back">← Back</button>
                  <button type="button" onClick={() => goToStep(4)} className="btn-next">Next →</button>
                </div>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <PasswordField label="Password" name="password" value={data.password} onChange={handleOnChange} show={showPassword} toggle={() => setShowPassword((prev) => !prev)} />
                <PasswordField label="Confirm Password" name="confirmPassword" value={data.confirmPassword} onChange={handleOnChange} show={showConfirmPassword} toggle={() => setShowConfirmPassword((prev) => !prev)} />
                <div className="flex justify-between">
                  <button type="button" onClick={() => goToStep(3)} className="btn-back">← Back</button>
                  <button type="button" onClick={() => goToStep(5)} className="btn-next">Next →</button>
                </div>
              </motion.div>
            )}
            {step === 5 && (
              <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input type="file" accept="image/*" onChange={handleUploadPic} className="w-full p-2 border border-gray-300 bg-gray-50 text-sm rounded" />
                </div>
                {data.profilePic && <img src={data.profilePic} alt="Preview" className="h-20 w-20 rounded-full object-cover mx-auto" />}
                <div className="flex items-center">
                  <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mr-2" />
                  <label htmlFor="terms" className="text-sm text-gray-700">I agree to the <Link to="/terms" className="text-blue-600 hover:underline">terms and conditions</Link></label>
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => goToStep(4)} className="btn-back">← Back</button>
                  <button type="submit" disabled={loading || uploading || !data.profilePic} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition disabled:opacity-50">
                    {loading ? "Signing Up..." : uploading ? "Uploading..." : "Sign Up 🚀"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </div>
      </div>
    </section>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", required = false }) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-2 border border-gray-300 text-sm rounded bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200"
    />
  </div>
);

const PasswordField = ({ label, name, value, onChange, show, toggle }) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center p-2 bg-gray-50 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-500 transition-all duration-200">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        required
        className="flex-1 bg-transparent outline-none text-sm"
      />
      <button type="button" onClick={toggle} className="text-gray-600 ml-2">
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>
);

export default SignUp;
