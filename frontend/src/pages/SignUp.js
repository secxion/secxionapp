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
      [name]: value.trim(),
    }));
  };

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

    if (data.password !== data.confirmPassword) {
      return toast.error("🔒 Passwords do not match!");
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
        toast.success("🎉 Thank You For Signing Up! ₦900 signup bonus awarded. Please verify your email..");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={data.name}
              onChange={handleOnChange}
              required
              className="w-full p-2 bg-gray-50 border border-gray-300 text-sm rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
            <input
              type="text"
              name="tag"
              placeholder="e.g. #Director, #CryptoTrader"
              value={data.tag}
              onChange={handleOnChange}
              className="w-full p-2 bg-gray-50 border border-gray-300 text-sm rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telegram Number</label>
            <input
              type="text"
              name="telegramNumber"
              placeholder="Enter your Telegram number"
              value={data.telegramNumber}
              onChange={handleOnChange}
              className="w-full p-2 bg-gray-50 border border-gray-300 text-sm rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleOnChange}
              required
              className="w-full p-2 bg-gray-50 border border-gray-300 text-sm rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center p-2 bg-gray-50 border border-gray-300 rounded">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={data.password}
                onChange={handleOnChange}
                required
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-600 ml-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="flex items-center p-2 bg-gray-50 border border-gray-300 rounded">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-gray-600 ml-2"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

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

export default SignUp;
