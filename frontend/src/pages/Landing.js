import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  ShieldCheck,
  LockKeyhole,
  LogIn,
  UserPlus,
  RefreshCcw,
} from "lucide-react";
import Logo from "../Assets/1.svg";
import ScrollToTopButton from "../Components/ScrollToTopButton";
import StatCard from "../Components/StatCard";

export default function Landing() {
  return (
    <motion.div
      className="min-h-screen bg-[#fefaf5] text-gray-800 font-sans px-4 py-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Secxion – Buy/Sell Gift Cards, Exchange Crypto Vouchers, and Make Digital Transactions</title>
        <meta name="description" content="Buy and sell gift cards, crypto vouchers and more on a secure and trusted platform." />
      </Helmet>

      <header className="w-full max-w-5xl mx-auto bg-white/50 backdrop-blur-lg border border-gray-200/80 rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex justify-center items-center">
          <Link to="/">
            <img src={Logo} alt="Secxion Logo" className="h-12 w-auto" />
          </Link>
        </div>
      </header>

      <div className="w-full max-w-5xl mx-auto bg-white/40 backdrop-blur-lg border border-gray-200/80 rounded-2xl shadow-xl p-4 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <NavCardLink to="/about-us">About</NavCardLink>
          <NavCardLink to="/terms">Terms</NavCardLink>
          <NavCardLink to="/privacy">Privacy</NavCardLink>
          <NavCardLink to="/contact-us">Contact</NavCardLink>
        </div>
      </div>

      <main className="max-w-5xl mx-auto">
        <div className="bg-white/50 backdrop-blur-lg border border-gray-200/80 rounded-2xl shadow-xl p-6 mb-6 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Secure Hub for Digital Assets
          </motion.h1>
          <p className="text-base text-gray-700 mb-8 max-w-2xl mx-auto">
            Secxion is a fast and user-friendly platform for buying & selling gift cards, exchanging crypto vouchers, and making seamless payments online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up" className="w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full font-semibold tracking-wide shadow-lg px-8 py-6 text-base">
                <UserPlus className="mr-2 h-5 w-5" /> Get Started
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="bg-gray-800 hover:bg-black text-white rounded-xl w-full font-semibold tracking-wide shadow-lg px-8 py-6 text-base">
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ShieldCheck className="text-green-500" />}
            title="Secure Transactions"
            text="Experience enterprise-grade payment reliability with bank-level encryption and real-time fraud protection."
          />
          <FeatureCard
            icon={<LockKeyhole className="text-blue-500" />}
            title="Privacy by Design"
            text="Your identity and data are fully protected by design. We prioritize your privacy at every step."
          />
          <FeatureCard
            icon={<RefreshCcw className="text-purple-500" />}
            title="Instant Exchanges"
            text="Seamlessly convert your assets. From gift cards to crypto vouchers, our automated system ensures fast trades."
          />
          <FeatureCard
            title="🌍 Wide Range of Gift Cards"
            text="Access a global marketplace with Amazon, Steam, iTunes, Visa and more, available instantly."
          />
          <FeatureCard
            title="📚 Clear & Transparent Terms"
            text="We believe in clarity. Our policies are simple and honest so you understand everything."
          />
          <FeatureCard
            title="🤝 Dedicated Support"
            text="Our expert team is here to help — for inquiries, complaints or partnership support."
          />
        </div>

        {/* 🔢 Live Stats */}
        <section className="bg-white/50 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 mt-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Platform Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
            <StatCard label="Transactions Processed" value={9800} suffix="+" />
            <StatCard label="Verified Users" value={3500} suffix="+" />
            <StatCard label="Gift Cards Listed" value={120} suffix="+" />
          </div>
        </section>
      </main>

      <ScrollToTopButton />

      <footer className="text-center text-sm text-gray-600 mt-12 py-6">
        <p className="mb-1">🛡️ Built for Trust. Designed for You.</p>
        <p className="mb-1">Secxion is proudly developed by <strong>BMXII</strong>.</p>
        <p>&copy; {new Date().getFullYear()} Secxion. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}

function NavCardLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block bg-white/60 hover:bg-white/90 backdrop-blur-md text-blue-800 font-medium rounded-lg px-4 py-2 shadow-md hover:shadow-lg border border-blue-100/50 transition-all duration-300"
    >
      {children}
    </Link>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      className="bg-white/50 backdrop-blur-md border border-gray-200/80 rounded-2xl shadow-lg p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 font-bold text-gray-800 mb-3 text-lg">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-grow">{title}</span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}
