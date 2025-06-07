import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LockKeyhole,
  LogIn,
  UserPlus,
  RefreshCcw,
} from "lucide-react";
import  Helmet  from "react-helmet";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fefaf5] text-gray-800 font-sans px-4 pt-2">
      <div className="w-full bg-white/40 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-4 mb-6">
        <div className="flex flex-col items-center gap-2">
          <Link to="/" className=" minecraft-font text-1xl md:flex items-center font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mr-4 tracking-wide">
                                  <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                                      SXN
                                  </h1>
                              </Link>
          <Helmet>
            <title>Secxion – Buy/Sell Gift Cards, Exchange Crypto Vouchers, and Make Digital Transactions</title>
            <meta name="description" content="Buy and sell gift cards, crypto vouchers and more on a secure and trusted platform." />
          </Helmet>
        </div>
      </div>

      <div className="w-full bg-white/40 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-4 mb-6 space-y-3 text-center text-blue-700 font-medium text-base">
        <NavCardLink to="/about-us">About</NavCardLink>
        <NavCardLink to="/terms">Terms</NavCardLink>
        <NavCardLink to="/privacy">Privacy</NavCardLink>
        <NavCardLink to="/contact-us">Contact</NavCardLink>
      </div>

      <div className="bg-white/40 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-6 mb-6 text-center">
        <motion.h2
          className="text-2xl font-extrabold leading-tight mb-4 text-gray-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your One-Stop Platform for Gift Cards & Digital Transactions
        </motion.h2>
        <p className="text-sm text-gray-700 mb-6">
          Secxion is a secure, fast, and user-friendly platform for buying/selling gift cards, exchanging crypto vouchers, and making seamless payments online.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/sign-up">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full font-semibold tracking-wide shadow-lg">
              <UserPlus className="mr-2 h-5 w-5" /> Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl w-full font-semibold tracking-wide shadow-lg">
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <FeatureCard
          icon={<ShieldCheck />}
          title="Secure Transactions"
          text="Experience business-class payment reliability with bank-grade encryption, real-time fraud protection, and instant crediting. Your assets move fast — and stay safe."
        />
        <FeatureCard
          title="🌍 Wide Range of Gift Cards"
          text="Amazon, Steam, iTunes, Visa, and more available instantly."
        />
        <FeatureCard
          icon={<LockKeyhole />}
          title="Privacy by Default"
          text="Your identity and data are fully protected by design."
        />
        <FeatureCard
          title="📚 Clear Terms"
          text="Transparent policies and legal clarity at every level."
        />
        <FeatureCard
          title="🤝 Support Ready"
          text="Contact us for help, inquiries, or partnerships anytime."
        />
        <FeatureCard
          icon={<RefreshCcw />}
          title="Account Recovery"
          text="Forgot credentials? Easily reset and get back on track."
        />
      </div>

      <footer className="text-center text-sm text-gray-500 mt-10 p-4">
        <p className="mb-1">🛡️ Built for Trust. Designed for You.</p>
        <p className="mb-1">
          Secxion is developed by <strong>BMXII</strong> — BoardMan12.
        </p>
        <p>&copy; {new Date().getFullYear()} Secxion. All rights reserved.</p>
      </footer>
    </div>
  );
}

function NavCardLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block bg-white/60 hover:bg-white/80 backdrop-blur-md text-blue-800 rounded-lg px-4 py-2 shadow-md border border-blue-100 transition duration-300"
    >
      {children}
    </Link>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      className="bg-white/40 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-3 text-blue-600 font-semibold mb-2 text-lg">
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}
