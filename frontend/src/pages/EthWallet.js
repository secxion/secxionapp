import React, { useEffect, useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import QrScanner from "react-qr-scanner";
import { EthContext } from "../Context/EthContext";
import SummaryApi from "../common";

const COUNTDOWN_DURATION = 600;
const LOCAL_STORAGE_KEY = "ethWithdrawalCountdownEnd";
const LOCAL_STORAGE_STATUS_KEY = "ethWithdrawalStatus";
const LOCAL_STORAGE_MESSAGE_KEY = "ethWithdrawalSuccessMessage";
const MAX_ADDRESS_HISTORY = 3;

const EthWallet = () => {
  const { user } = useSelector((state) => state.user);
  const {
    ethRate,
    gasFee,
    nairaBalance,
    ethBalance,
    fetchEthRate,
    fetchGasFee,
    fetchWalletBalance,
  } = useContext(EthContext);

  const [ethAddress, setEthAddress] = useState("");
  const [addressHistory, setAddressHistory] = useState([]);
  const [nairaWithdrawAmount, setNairaWithdrawAmount] = useState("");
  const [displayEthEquivalent, setDisplayEthEquivalent] = useState("0.000000");
  const [displayEthToSend, setDisplayEthToSend] = useState("0.000000");
  const [exactEthEquivalent, setExactEthEquivalent] = useState(null);
  const [exactEthToSend, setExactEthToSend] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [withdrawalStatus, setWithdrawalStatus] = useState(null);
  const [rejectedNotice, setRejectedNotice] = useState("");
  const countdownRef = useRef(null);
  const statusIntervalRef = useRef(null);

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });

  const refreshWalletData = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      await fetchEthRate();
      await fetchWalletBalance(user._id || user.id);
      setLastUpdated(formatTime(new Date()));
    } catch (error) {
      setErrorMessage("Unable to load wallet data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const refreshGasFee = async () => {
    try {
      await fetchGasFee();
    } catch (error) {
      console.error("refreshGasFee error:", error);
    }
  };

  const resetLocalStorageIfNoRequests = async () => {
    try {
      const res = await fetch(`${SummaryApi.withdrawalStatus.url}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && (!data.status || data.status === "")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_STATUS_KEY);
        localStorage.removeItem(LOCAL_STORAGE_MESSAGE_KEY);
        setCountdown(0);
        setWithdrawalStatus(null);
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Error checking withdrawal reset status:", err);
    }
  };

  useEffect(() => {
    const storedEndTimestamp = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedStatus = localStorage.getItem(LOCAL_STORAGE_STATUS_KEY);
    const storedMessage = localStorage.getItem(LOCAL_STORAGE_MESSAGE_KEY);

    if (storedEndTimestamp) {
      const endTime = parseInt(storedEndTimestamp, 10);
      const now = Date.now();
      if (endTime > now) {
        const remainingSeconds = Math.floor((endTime - now) / 1000);
        setCountdown(remainingSeconds);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    if (storedStatus) {
      setWithdrawalStatus(storedStatus);
    }

    if (storedMessage) {
      setSuccessMessage(storedMessage);
    }

    refreshWalletData();
    refreshGasFee();
    resetLocalStorageIfNoRequests();

    const checkInitialWithdrawalStatus = async () => {
      try {
        const res = await fetch(`${SummaryApi.withdrawalStatus.url}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.status) {
  const normalizedStatus = data.status.toLowerCase();

  if (["paid", "processed"].includes(normalizedStatus)) {
    setWithdrawalStatus("paid");
    setSuccessMessage(`Transaction Successful! Your last withdrawal is ${normalizedStatus}.`);
    localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, "paid");
    localStorage.setItem(LOCAL_STORAGE_MESSAGE_KEY, `Transaction Successful! Your last withdrawal is ${normalizedStatus}.`);
    setCountdown(0);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } else if (normalizedStatus === "pending") {
    setWithdrawalStatus("pending");
    localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, "pending");
    setRejectedNotice("");
  } else if (normalizedStatus === "rejected") {
    setWithdrawalStatus("rejected");
    setSuccessMessage("");
    setRejectedNotice("Last pending transaction was rejected. Please try again or contact support.");
    localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, "rejected");
    localStorage.removeItem(LOCAL_STORAGE_MESSAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } else {
    setWithdrawalStatus(normalizedStatus);
  }
}

      } catch (err) {
        console.error("Error checking initial withdrawal status:", err);
      }
    };

    checkInitialWithdrawalStatus();
    const interval = setInterval(refreshWalletData, 60000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
 if (withdrawalStatus === "pending" || withdrawalStatus === "rejected") {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    statusIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${SummaryApi.withdrawalStatus.url}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.status) {
          const normalizedStatus = data.status.toLowerCase();
          if (["paid", "processed"].includes(normalizedStatus)) {
            setWithdrawalStatus("paid");
            setSuccessMessage(`Transaction Successful! Your withdrawal is ${normalizedStatus}.`);
            localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, "paid");
            localStorage.setItem(LOCAL_STORAGE_MESSAGE_KEY, `Transaction Successful! Your withdrawal is ${normalizedStatus}.`);
            setCountdown(0);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            clearInterval(countdownRef.current);
            clearInterval(statusIntervalRef.current);
          } else if (normalizedStatus === "pending") {
            setWithdrawalStatus("pending");
            localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, "pending");
            setRejectedNotice(""); // clear any previous rejection
          } else if (normalizedStatus === "rejected") {
            setWithdrawalStatus("rejected");
            setSuccessMessage("");
            setRejectedNotice("Last pending transaction was rejected. Please try again or contact support.");
            localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, "rejected");
            localStorage.removeItem(LOCAL_STORAGE_MESSAGE_KEY);
            setCountdown(0);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            clearInterval(countdownRef.current);
            clearInterval(statusIntervalRef.current);
          } else {
            setWithdrawalStatus(normalizedStatus);
          }
        }
      } catch (err) {
        console.error("Failed to fetch withdrawal status");
      }
    }, 3000);

    return () => {
      clearInterval(countdownRef.current);
      clearInterval(statusIntervalRef.current);
    };
  }
}, [countdown, withdrawalStatus]);


 useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("eth_addresses") || "[]");
  const userSpecific = stored.filter(
    (addr) => addr.userId === user._id || addr.userId === user.id
  );
  setAddressHistory(userSpecific.map((a) => a.address).slice(0, MAX_ADDRESS_HISTORY));
}, [user]);


  useEffect(() => {
    const naira = parseFloat(nairaWithdrawAmount);
    const rate = parseFloat(ethRate);
    const fee = parseFloat(gasFee);

    if (naira > 0 && rate > 0) {
      const ethAmount = naira / rate;
      const ethAfterFee = ethAmount - fee;
      setExactEthEquivalent(ethAmount);
      setExactEthToSend(ethAfterFee > 0 ? ethAfterFee : 0);
      setDisplayEthEquivalent(ethAmount.toFixed(6));
      setDisplayEthToSend(ethAfterFee > 0 ? ethAfterFee.toFixed(6) : "0.000000");
    } else {
      setDisplayEthEquivalent("0.000000");
      setDisplayEthToSend("0.000000");
      setExactEthEquivalent(null);
      setExactEthToSend(null);
    }
  }, [nairaWithdrawAmount, ethRate, gasFee]);

const handleWithdrawRequest = async () => {
  setErrorMessage("");
  setSuccessMessage("");
  setRejectedNotice("");

  if (withdrawalStatus === "pending") {
    setErrorMessage("Please wait, your last transaction is still pending.");
    return;
  }

  if (!ethAddress.trim() || !nairaWithdrawAmount || isNaN(nairaWithdrawAmount) || parseFloat(nairaWithdrawAmount) <= 0) {
    setErrorMessage("Please enter a valid ETH address and amount.");
    return;
  }

  setWithdrawLoading(true);
  try {
    const payload = {
      ethRecipientAddress: ethAddress,
      nairaRequestedAmount: parseFloat(nairaWithdrawAmount),
      ethCalculatedAmount: exactEthEquivalent,
      ethNetAmountToSend: exactEthToSend,
    };

    const res = await fetch(SummaryApi.ethWithdrawal.url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Withdrawal failed.");

    setSuccessMessage("Withdrawal submitted and processing.");
    setWithdrawalStatus("pending");

    const countdownEnd = Date.now() + COUNTDOWN_DURATION * 1000;
    localStorage.setItem(LOCAL_STORAGE_KEY, countdownEnd.toString());
    localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, "pending");
    localStorage.setItem(LOCAL_STORAGE_MESSAGE_KEY, "Withdrawal submitted and processing.");
    setCountdown(COUNTDOWN_DURATION);

    const existing = JSON.parse(localStorage.getItem("eth_addresses") || "[]");
    const userId = user._id || user.id;
    const filtered = existing.filter((entry) => entry.userId === userId && entry.address !== ethAddress);
    const updated = [{ userId, address: ethAddress }, ...filtered].slice(0, MAX_ADDRESS_HISTORY);
    setAddressHistory(updated.map((entry) => entry.address));
    localStorage.setItem("eth_addresses", JSON.stringify(updated));
  } catch (error) {
    setErrorMessage(error.message || "Error submitting withdrawal.");
  } finally {
    setWithdrawLoading(false);
  }
};

 const renderCountdown = () => {
  if (countdown <= 0) return null;
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  return (
    <div className="mt-3 text-yellow-600 font-semibold">
      Processing: {mins}m {secs}s
    </div>
  );
};

 return (
  <div className="p-4 max-w-xl mt-28 mx-auto text-white bg-gray-900 shadow-lg rounded-lg">
    <h2 className="text-2xl font-bold mb-4 text-center">ETH Wallet</h2>
  <div className="mb-4 text-sm">
      <p>📈 ETH Rate: <span className="text-green-400">₦{parseFloat(ethRate).toLocaleString()}</span></p>
      <p>⛽ Gas Fee: <span className="text-red-400">{gasFee} ETH</span></p>
      <p>💰 Your Naira Balance: <span className="text-yellow-400">₦{parseFloat(nairaBalance).toLocaleString()}</span></p>
      <p>🪙 Your ETH Balance: <span className="text-yellow-400">{ethBalance} ETH</span></p>
    </div>
    {errorMessage && (
      <div className="bg-red-600 text-white p-2 mb-3 rounded">{errorMessage}</div>
    )}
    {successMessage && (
      <div className="bg-green-600 text-white p-2 mb-3 rounded">{successMessage}</div>
    )}
    {renderCountdown()}
    
    {rejectedNotice && (
  <div className="bg-orange-500 text-white p-2 mb-3 rounded">
    {rejectedNotice}
  </div>
) }
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Enter ETH Address:</label>
      <input
        type="text"
        value={ethAddress}
        onChange={(e) => setEthAddress(e.target.value)}
        placeholder="0x..."
        className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {addressHistory.length > 0 && (
        <div className="mt-2">
          <label className="block mb-1 font-medium text-sm">Recent Addresses:</label>
          <ul className="text-sm space-y-1">
            {addressHistory.map((addr, index) => (
              <li
                key={index}
                className="cursor-pointer text-blue-400 hover:underline"
                onClick={() => setEthAddress(addr)}
              >
                {addr}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="mb-4">
      <label className="block mb-1 font-semibold">Enter Naira Amount:</label>
      <input
        type="number"
        value={nairaWithdrawAmount}
        onChange={(e) => setNairaWithdrawAmount(e.target.value)}
        placeholder="Enter amount in ₦"
        className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mb-4">
      <p className="text-sm text-white">
        🧮 Calculated ETH Equivalent:{" "}
        <span className="text-blue-300">{displayEthEquivalent} ETH</span>
      </p>
      <p className="text-sm text-white">
        📨 ETH to Send (after Gas Fee):{" "}
        <span className="text-green-300">{displayEthToSend} ETH</span>
      </p>
    </div>

    <button
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
      onClick={handleWithdrawRequest}
      disabled={withdrawLoading || countdown > 0}
    >
      {withdrawLoading ? "Processing..." : "Withdraw"}
    </button>

    <div className="mt-4 text-center">
      <button
        onClick={() => setScannerVisible((prev) => !prev)}
        className="text-sm text-blue-400 hover:underline"
      >
        {scannerVisible ? "Hide QR Scanner" : "Scan QR Code"}
      </button>
      {scannerVisible && (
        <div className="mt-2">
          <QrScanner
            delay={300}
            style={{ width: "100%" }}
            onScan={(data) => {
              if (data?.text) {
                setEthAddress(data.text);
                setScannerVisible(false);
              }
            }}
            onError={(err) => console.error(err)}
          />
        </div>
      )}
    </div>

    {lastUpdated && (
      <p className="mt-6 text-xs text-gray-400 text-center">
        ⏰ Last updated: {lastUpdated}
      </p>
    )}
  </div>  
);
};


export default EthWallet;
