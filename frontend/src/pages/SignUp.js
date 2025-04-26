import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
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
                toast.success(responseData.message);
                navigate("/login");
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
        <section id="signup" className="container min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white p-6 w-full max-w-md rounded-2xl shadow-lg flex flex-col">

                 {/* Profile Picture Container */}
                <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-full bg-gray-200 border-4 border-white -mt-16">
                  <img src={data.profilePic || loginicons} alt="Profile Icon" className="w-full h-full object-cover" />
                </div>

                {/* Scrollable Form Container */}
                  <div className="overflow-y-auto max-h-[400px] mt-4 px-2">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                      <div>
                        <label className="block text-gray-700 font-semibold">Profile Picture: 📷</label>
                        <input type="file" accept="image/*" onChange={handleUploadPic} className="w-full p-2 border rounded-lg"/>
                      </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Name: 🌟</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={data.name}
                                onChange={handleOnChange}
                                required
                                className="w-full p-2 bg-gray-100 rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Tag:</label>
                            <input
                                type="text"
                                placeholder="Enter your tag"
                                name="tag"
                                value={data.tag}
                                onChange={handleOnChange}
                                className="w-full p-2 bg-gray-100 rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Telegram Number:</label>
                            <input
                                type="text"
                                placeholder="Enter your Telegram number"
                                name="telegramNumber"
                                value={data.telegramNumber}
                                onChange={handleOnChange}
                                className="w-full p-2 bg-gray-100 rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Email: 📧</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={data.email}
                                onChange={handleOnChange}
                                required
                                className="w-full p-2 bg-gray-100 rounded-lg outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Password: 🔑</label>
                            <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleOnChange}
                                    required
                                    className="w-full bg-transparent outline-none"
                                />
                                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-xl">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">Confirm Password: 🔒</label>
                            <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    name="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleOnChange}
                                    required
                                    className="w-full bg-transparent outline-none"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="text-xl">
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition transform hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? "Signing Up... ⏳" : "Sign Up 🚀"}
                        </button>
                    </form>
                </div>

                {/* Login Redirect */}
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>

                {/* Contact Us Button */}
                <Link to="/contact-us" className="mt-4 block text-center text-gray-600 hover:text-gray-800">
                    Contact Us
                </Link>
            </div>
        </section>
    );
};

export default SignUp;