import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LockKeyhole,
  UsersRound,
  BookText,
  Contact2,
  LogIn,
  UserPlus,
  RefreshCcw,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-900 to-black text-white font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-blue-800 bg-black bg-opacity-40 backdrop-blur-lg">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <img
            src="/logo.svg"
            alt="Secxion Logo"
            className="h-10 w-10 rounded-full shadow-lg"
          />
          <h1 className="text-xl font-bold tracking-wide">Secxion</h1>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm justify-center">
          <Link to="/about-us">About</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact-us">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/sign-up">Sign Up</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center px-4 py-16 md:py-24 max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your One-Stop Platform for Gift Cards and Digital Transactions
        </motion.h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8 px-2">
          Secxion is a secure, fast, and user-friendly web application built to simplify how you sell gift cards and other online financial transactions.
          Whether you’re looking to sell your favorite brands’ digital gift cards, exchange crypto vouchers, or make seamless payments online, Secxion is your trusted partner in the digital economy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/sign-up">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 py-3 text-black text-lg shadow-md w-full sm:w-auto">
              <UserPlus className="mr-2 h-5 w-5" /> Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-2xl px-6 py-3 text-black text-lg shadow-md w-full sm:w-auto">
              <LogIn className="mr-2 h-5 w-5" /> Enter Office
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-20 bg-gray-900 bg-opacity-70">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<ShieldCheck />}
            title="🔐 Secure Transactions"
            text="Our platform is built with advanced security protocols to ensure all your transactions are encrypted and protected."
          />
          <FeatureCard
            icon={<UsersRound />}
            title="🌍 Wide Range of Gift Cards"
            text="From Amazon and Steam to iTunes, Visa, and more — instantly browse or sell a wide selection of international and local gift cards."
          />
          <FeatureCard
            icon={<LockKeyhole />}
            title="🔒 Privacy by Default"
            text="No compromise on privacy. Your identity and data are protected at every step."
          />
          <FeatureCard
            icon={<BookText />}
            title="📚 Clear Terms"
            text="Transparent policies and legal terms for both users and admins."
          />
          <FeatureCard
            icon={<Contact2 />}
            title="🤝 Support Ready"
            text="Reach out via our Contact Us page for help, inquiries, or partnership."
          />
          <FeatureCard
            icon={<RefreshCcw />}
            title="Account Recovery"
            text="Forgot credentials? Use the Reset feature to get back on track."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 p-6 border-t border-blue-900 px-4">
        <p className="mb-2">🛡️ Built for Trust. Designed for You.</p>
        <p className="mb-2">
          Secxion is developed by <strong>BMXII</strong>, combining fintech innovation with rock-solid cybersecurity.
        </p>
        <p>&copy; {new Date().getFullYear()} Secxion. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-3 text-blue-400 mb-4 text-xl">
        {icon}
        <span className="font-bold">{title}</span>
      </div>
      <p className="text-gray-300 text-sm">{text}</p>
    </motion.div>
  );
}
