import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import Context from "../Context";
import loginBackground from "./loginbk.png"; // Keep background image, adjust overlay
import thumbsUpGif from "./thumbsup.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for consistency
import LogoShimmer from "../Components/LogoShimmer";
import Navigation from '../Components/Navigation';


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
            <Navigation currentPage="signin" />

      {/* Overlay for dark mode compatibility on background - adjusted opacity for black theme */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Login Form Box - updated for black and yellow theme */}
      <div className="shape-lines relative bg-gray-900 bg-opacity-95 p-6 sm:p-8 w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 z-10">
        {/* Logo - updated gradient for black and yellow theme */}
        <div className="flex justify-center mb-5">
           <Link to="/" className="relative hidden md:flex items-center font-bold text-yellow-600 tracking-wide">
            <div className="bg-white flex py-1 flex-col justify-center">
                    <div className="relative py-2  sm:mx-auto ">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl border-4 border-yellow-700"></div> {/* Yellow border */}
                        <div className="relative px-4 p-1.5 bg-white shadow-lg rounded-2xl sm:p-1.5 border-4 border-yellow-700">
                            <div className="">
                                <div className="grid grid-cols-1">                        
                                    <LogoShimmer type="button" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Welcome Back!</h1> {/* Updated text color */}
          <p className="text-sm text-gray-300 mt-1">Login to your account</p> {/* Updated text color */}
        </div>

        <form className="flex flex-col gap-4" onSubmit={onLoginClick}>
          <div>
            <label htmlFor="email" className="block text-gray-200 font-extrabold mb-1">Email</label> {/* Updated text color */}
            <div className="relative flex items-center w-full rounded-lg border-2 border-yellow-600 bg-gray-800 focus-within:ring-2 focus-within:ring-yellow-500"> {/* Updated border and background */}
              <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full p-3 pr-12 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0" // Removed redundant border, updated text/placeholder
              required
              autoComplete="email"
            /></div>
            
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-200 font-extrabold mb-1">Password</label> {/* Updated text color */}
            <div className="relative flex items-center w-full p-1 rounded-lg border-2 border-yellow-600 bg-gray-800 focus-within:ring-2 focus-within:ring-yellow-500"> {/* Updated border and background */}
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-400" // Updated text/placeholder
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-yellow-500 hover:text-yellow-400" // Updated icon color
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />} {/* Using Lucide icons */}
              </button>
            </div>
            <Link to="/reset" className="block text-right text-sm text-yellow-500 hover:underline mt-1"> {/* Updated link color */}
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={formSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg 
                        ${formSubmitting
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed" // Updated disabled state
                            : "bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-gray-900" // Updated enabled state
                        }`}
          >
            {formSubmitting ? "Verifying..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center text-red-400 text-sm"> {/* Updated text color */}
            <p>{errorMessage}</p>
            {errorMessage.toLowerCase().includes("verify") && (
              <button
                onClick={handleResendVerificationEmail}
                disabled={resending}
                className="mt-2 text-yellow-500 hover:underline font-medium hover:text-yellow-400" // Updated link color
              >
                {resending ? "Resending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-gray-300 text-sm"> {/* Updated text color */}
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-yellow-500 hover:underline font-medium hover:text-yellow-400"> {/* Updated link color */}
            Sign up
          </Link>
        </p>

        <div className="mt-6 text-center text-xs text-gray-500"> {/* Updated text color */}
          <Link to="/contact-us" className="hover:text-yellow-400 transition-colors"> {/* Updated hover color */}
            Contact Us
          </Link>
          <span className="mx-2 text-gray-600">|</span> {/* Divider color adjusted */}
          <a href="https://secxion.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            © {new Date().getFullYear()} secxion.com
          </a>
        </div>
      </div>

      {/* Verification Modal - updated for black and yellow theme */}
      {verificationVisible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"> {/* Increased overlay opacity */}
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-gray-700 shadow-lg w-full max-w-sm text-gray-100"> {/* Updated background and border */}
            <h2 className="text-lg font-bold mb-2 text-center">Human Verification</h2>
            <div className="text-sm text-gray-300 mb-4 text-center space-y-3"> {/* Updated text color */}
              Slide to match <span className="font-semibold text-yellow-500 px-1 border-2 border-yellow-700 rounded-md">{targetValue}</span> {/* Updated text and border */}
              <div className="text-center text-sm mb-3">
              <span className="text-gray-400">Current: </span> {/* Updated text color */}
              <span className="font-bold text-yellow-400 px-1 ">{sliderValue}</span> {/* Updated text color */}
            </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-2 accent-yellow-500 mb-4 cursor-pointer" // Updated accent color
            />
            
            <button
              onClick={handleVerificationComplete}
              disabled={!isVerified || verifying}
              className={`w-full py-2 rounded-md font-semibold transition shadow-md hover:shadow-lg
                          ${isVerified
                              ? "bg-gradient-to-r from-yellow-600 to-yellow-800 text-gray-900 hover:from-yellow-700 hover:to-yellow-900" // Updated enabled state
                              : "bg-gray-700 text-gray-400 cursor-not-allowed" // Updated disabled state
                          }`}
            >
              {verifying ? "Logging in..." : "Verify & Login"}
            </button>
            <button
              onClick={() => {
                setVerificationVisible(false);
                setFormSubmitting(false);
              }}
              className="mt-3 w-full text-sm text-gray-400 hover:text-yellow-500" // Updated text and hover color
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
