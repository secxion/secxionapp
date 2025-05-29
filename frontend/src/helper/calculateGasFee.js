// helpers/calculateGasFee.js

/**
 * Calculates estimated ETH gas fee based on transaction speed.
 * @param {string} speed - "slow", "medium", or "fast"
 * @returns {Promise<{ feeEth: string, gasPriceGwei: number, speed: string }>}
 */
export const calculateGasFee = async (speed = "medium") => {
  const gasSpeeds = {
    slow: 15,    // gwei
    medium: 30,  // gwei
    fast: 50     // gwei
  };

  const gasLimit = 21000; // standard ETH transfer

  const gasPrice = gasSpeeds[speed] || gasSpeeds.medium;
  const feeInEth = ((gasPrice * gasLimit) / 1e9).toFixed(6); // gwei to ETH

  return {
    feeEth: feeInEth,
    gasPriceGwei: gasPrice,
    speed,
  };
};
