import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import uploadImage from "../helpers/uploadImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import loginicons from "./pfpik.gif";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
    tag: "",
    telegramNumber: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    password.length >= 6;

  const isValidTelegram = (number) =>
    /^(\+?\d{7,15})$/.test(number);

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.info("Uploading image... ⏳");
      const uploadedImage = await uploadImage(file);
      setData((prev) => ({
        ...prev,
        profilePic: uploadedImage.url,
      }));
      toast.success("Profile picture uploaded successfully! 📸");
    } catch (error) {
      toast.error("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(data.email)) {
      return toast.error("📧 Enter a valid email address.");
    }

    if (!isValidPassword(data.password)) {
      return toast.error("🔐 Password must be at least 6 characters.");
    }

    if (data.password !== data.confirmPassword) {
      return toast.error("❌ Passwords do not match.");
    }

    if (data.telegramNumber && !isValidTelegram(data.telegramNumber)) {
      return toast.error("📞 Invalid Telegram number format.");
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
      if (response.ok) {
        toast.success("🎉 Signup successful! ₦900 bonus awarded. Verify your email.");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        toast.error(responseData?.message || "Signup failed.");
      }
    } catch (error) {
      toast.error("🚫 Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-700 p-4">
      <div className="bg-white w-full max-w-md p-8 shadow-xl rounded-2xl border border-gray-200">
        <div className="w-24 h-24 mx-auto overflow-hidden bg-gray-100 border border-gray-300 rounded-full">
          <img
            src={data.profilePic || loginicons}
            alt="Profile Icon"
            className="w-full h-full object-cover"
          />
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPic}
              className="w-full p-2 border border-gray-300 bg-gray-50 text-sm rounded"
            />
          </div>

          <InputField label="Name" name="name" value={data.name} onChange={handleOnChange} required />
          <InputField label="Tag" name="tag" value={data.tag} onChange={handleOnChange} placeholder="e.g. #Director" />
          <InputField label="Telegram Number" name="telegramNumber" value={data.telegramNumber} onChange={handleOnChange} />
          <InputField label="Email" name="email" type="email" value={data.email} onChange={handleOnChange} required />

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

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Signing Up... ⏳" : "Sign Up 🚀"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>

        <Link
          to="/contact-us"
          className="mt-2 block text-center text-sm text-gray-500 hover:text-gray-800"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
};

// 🔹 Modular Reusable Input Field
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full p-2 bg-gray-50 border border-gray-300 text-sm rounded"
    />
  </div>
);

// 🔹 Modular Reusable Password Field
const PasswordField = ({ label, name, value, onChange, show, toggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center p-2 bg-gray-50 border border-gray-300 rounded">
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
