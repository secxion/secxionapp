import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const [step, setStep] = useState("select");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newValue, setNewValue] = useState("");
  const navigate = useNavigate(); 

  const handleRequestCode = async () => {
    try {
      const res = await fetch(SummaryApi.requestReset.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setStep("verify");
      } else toast.error(result.message);
    } catch (err) {
      toast.error("Error requesting code.");
    }
  };

  const handleSubmitReset = async () => {
    try {
      const res = await fetch(SummaryApi.confirmReset.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newValue, type }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);

        // ✅ Clear user session
        localStorage.clear();
        sessionStorage.clear();

        // Optional: clear cookies (if any token is stored via cookies)
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // ✅ Redirect after short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        setStep("done");
      } else toast.error(result.message);
    } catch (err) {
      toast.error("Reset failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Account Details</h2>

      {step === "select" && (
        <>
          <label className="block mb-2">What would you like to reset?</label>
          <select
            className="w-full mb-4 p-2 border"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="password">Password</option>
            <option value="telegram">Telegram Number</option>
            <option value="email">Email (Manual)</option>
          </select>

          {(type === "password" || type === "telegram") && (
            <>
              <input
                type="email"
                placeholder="Enter your account email"
                className="w-full p-2 border mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-full bg-blue-500 text-white py-2 rounded"
                onClick={handleRequestCode}
              >
                Send Code
              </button>
            </>
          )}

          {type === "email" && (
            <p className="text-sm mt-4 text-gray-600">
              Please contact support to change your email:
              <br />
              - Visit <a href="/report" className="text-blue-600 underline">/report</a>
              <br />
              - Or email: <span className="font-semibold">secxionapp@gmail.com</span>
            </p>
          )}
        </>
      )}

      {step === "verify" && (
        <>
          <p className="text-sm text-gray-700 mb-2">Code sent to: {email}</p>
          <input
            type="text"
            placeholder="Enter the verification code"
            className="w-full p-2 border mb-4"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type={type === "password" ? "password" : "text"}
            placeholder={`Enter new ${type}`}
            className="w-full p-2 border mb-4"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <button
            className="w-full bg-green-500 text-white py-2 rounded"
            onClick={handleSubmitReset}
          >
            Confirm Reset
          </button>
        </>
      )}

      {step === "done" && (
        <div className="text-center text-green-600 font-medium">
          {type === "password" ? "Password" : "Telegram number"} reset successfully!
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        </div>
      )}
    </div>
  );
};

export default Reset;
