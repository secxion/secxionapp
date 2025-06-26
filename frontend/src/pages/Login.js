import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import Context from "../Context";
import "./Login.css"; // Assuming this might contain global or base styles
import loginBackground from "./loginbk.png";
import thumbsUpGif from "./thumbsup.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for consistency

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
  const [verifying, setVerifying] = useState(false); 

  useEffect(() => {
    if (verificationVisible) fetchSliderTarget();
  }, [verificationVisible]);

  const fetchSliderTarget = async () => {
    try {
      const res = await fetch(SummaryApi.sliderVerification.url, {
        method: SummaryApi.sliderVerification.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch verification challenge.");
      const { target, signature } = await res.json();
      setTargetValue(target);
      setSliderSignature(signature);
      setSliderValue(0);
      setIsVerified(false);
    } catch (error) {
      console.error("Error fetching slider target:", error);
      toast.error("Failed to load verification challenge. Please try again.");
    }
  };

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    setIsVerified(Math.abs(val - targetValue) <= 3); // Allow a small tolerance
  };

  const handleVerificationComplete = async () => {
    if (!isVerified) {
      toast.error("Please complete the verification challenge.");
      return;
    }
    setVerifying(true);
    setErrorMessage(""); // Clear previous errors

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

      if (response.ok && result.success) {
        setVerificationVisible(false);
        toast.success(
          <div className="flex items-center gap-2">
            <img src={thumbsUpGif} alt="success" className="w-6 h-6" />
            <span>{result.message || "Login Successful!"}</span>
          </div>
        );
        await fetchUserDetails(); // Ensure user details are fetched before navigating
        navigate("/home");
      } else {
        setErrorMessage(result.message || "Login failed. Please try again.");
        toast.error(result.message || "Verification failed. Please try again.");
        setVerificationVisible(true); 
        fetchSliderTarget(); 
      }
    } catch (error) {
      console.error("Login verification error:", error);
      setErrorMessage("An unexpected error occurred during login. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setFormSubmitting(false);
      setVerifying(false);
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
      result.success
        ? toast.success("Verification email sent successfully! Please check your inbox.")
        : toast.error(result.message || "Failed to resend verification email.");
    } catch (error) {
      console.error("Resend email error:", error);
      toast.error("Error resending verification email. Please try again.");
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
    if (!data.email || !data.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setErrorMessage(""); 
    setVerificationVisible(true); // Show the verification modal
    setFormSubmitting(true); 
  };

  return (
    <section
      className="login-page min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {/* Overlay for dark mode compatibility on background */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60 z-0"></div>

      {/* Login Form Box */}
      <div className="shape-lines relative bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 p-6 sm:p-8 w-full max-w-md rounded-2xl shadow-2xl dark:shadow-none dark:border dark:border-gray-700 z-10">
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

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome Back!</h1>
          <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">Login to your account</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onLoginClick}>
          <div>
            <label htmlFor="email" className="block text-gray-950 dark:text-gray-200 font-extrabold mb-1">Email</label>
            <div className="relative flex items-center w-full rounded-lg border-2 border-blue-600 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 
                            dark:bg-gray-700 dark:border-blue-600">
              <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full p-3 pr-12 rounded-lg border-2 border-blue-600 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         dark:bg-gray-700 dark:border-blue-600 dark:text-white dark:placeholder-gray-400"
              required
              autoComplete="email"
            /></div>
            
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-950 dark:text-gray-200 font-extrabold mb-1">Password</label>
            <div className="relative flex items-center w-full p-1 rounded-lg border-2 border-blue-600 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 
                            dark:bg-gray-700 dark:border-blue-600">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 
                           dark:text-white dark:placeholder-gray-400"
                required
                autoComplete="current-password"
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
            <Link to="/reset" className="block text-right text-sm text-red-600 hover:underline mt-1 dark:text-red-400">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg 
                        ${formSubmitting
                            ? "bg-blue-300 text-white cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
                        }`}
          >
            {formSubmitting ? "Verifying..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center text-red-500 dark:text-red-400 text-sm">
            <p>{errorMessage}</p>
            {errorMessage.toLowerCase().includes("verify") && (
              <button
                onClick={handleResendVerificationEmail}
                disabled={resending}
                className="mt-2 text-blue-600 hover:underline font-medium dark:text-blue-400 dark:hover:text-blue-300"
              >
                {resending ? "Resending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-gray-800 dark:text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-black hover:underline font-medium dark:text-white dark:hover:text-gray-200">
            Sign up
          </Link>
        </p>

        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          <Link to="/contact-us" className="hover:text-blue-500 transition-colors dark:hover:text-blue-400">
            Contact Us
          </Link>
          <span className="mx-2">|</span>
          <a href="https://secxion.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            © {new Date().getFullYear()} secxion.com
          </a>
        </div>
      </div>

      {verificationVisible && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 shadow-lg w-full max-w-sm text-gray-900 dark:text-gray-100">
            <h2 className="text-lg font-bold mb-2 text-center">Human Verification</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center space-y-3">
              Slide to match <span className="font-semibold text-blue-600 px-1 border-2 border-black dark:border-white">{targetValue}</span>
              <div className="text-center text-sm mb-3">
              <span className="text-gray-500 dark:text-gray-400">Current: </span>
              <span className="font-bold text-yellow-700 dark:text-yellow-400 px-1 ">{sliderValue}</span>
            </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 accent-blue-500 dark:accent-blue-400 mb-4 cursor-pointer"
            />
            
            <button
              onClick={handleVerificationComplete}
              disabled={!isVerified || verifying}
              className={`w-full py-2 rounded-md font-semibold transition shadow-md hover:shadow-lg
                          ${isVerified
                              ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                          }`}
            >
              {verifying ? "Logging in..." : "Verify & Login"}
            </button>
            <button
              onClick={() => {
                setVerificationVisible(false);
                setFormSubmitting(false); // Reset form submitting state on cancel
              }}
              className="mt-3 w-full text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
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