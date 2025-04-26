import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../Context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: { "Content-Type": "application/json"
        
         },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUserDetails();
        navigate("/");
      } else {
        setErrorMessage(result.message || "Invalid credentials. Please try again.");
        toast.error(result.message);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <section className="w-screen h-screen flex items-center justify-center bg-gray-100 fixed top-0 left-0 overflow-hidden">
      <div className="bg-white p-8 w-full max-w-md rounded-xl shadow-lg">
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold text-white mb-6">
          S
        </div>

        <form className="w-full mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              className="w-full bg-gray-100 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                className="w-full bg-gray-100 p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <Link to="/reset" className="block text-right text-sm text-blue-500 hover:underline mt-1">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition duration-300"
            disabled={formSubmitting}
          >
            {formSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center text-red-600">{errorMessage}</div>
        )}

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
        </p>

        {/* Contact Us Button */}
        <Link to="/contact-us" className="mt-4 block text-center text-gray-600 hover:text-gray-800">
                    Contact Us
                </Link>

        {/* Bottom Links */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/about-us" className="text-gray-600 hover:text-gray-800 text-sm">
            About Us
          </Link>
          <Link to="/terms" className="text-gray-600 hover:text-gray-800 text-sm">
            Terms
          </Link>
          <Link to="/privacy" className="text-gray-600 hover:text-gray-800 text-sm">
            Privacy
          </Link>
        </div>

        {/* Copyright Notice */}
        <p className="mt-4 text-center text-gray-500 text-xs">
          <span className="align-baseline">©</span> 2025 secxion.com
        </p>
      </div>
    </section>
  );
};

export default Login;