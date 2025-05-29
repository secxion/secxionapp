import React, { useState } from "react";

export const EthContext = React.createContext();

export const EthProvider = ({ children }) => {
  const [ethRate, setEthRate] = useState(0);
  const [gasFee, setGasFee] = useState("0.000000");
  const [nairaBalance, setNairaBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState("0.000000");

  const fetchEthRate = async () => { /* fetch ETH rate logic */ };
  const fetchGasFee = async () => { /* fetch gas fee logic */ };
  const fetchWalletBalance = async (userId) => { };

  return (
    <EthContext.Provider value={{
      ethRate,
      setEthRate,
      gasFee,
      setGasFee,
      nairaBalance,
      setNairaBalance,
      ethBalance,
      setEthBalance,
      fetchEthRate,
      fetchGasFee,
      fetchWalletBalance,
    }}>
      {children}
    </EthContext.Provider>
  );
};
