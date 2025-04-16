import React, { useState, useEffect } from 'react';
import currencySymbols from '../helpers/currencySymbols'; 

const CURRENCY_API_KEY = "yaQ4dGsiNpDbxalqplxeXZZIG7X7g3tchrrJ";
const CURRENCY_API_BASE_URL = "https://currencyapi.net/api/v1/rates?";

const CurrencyRates = () => {
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const symbolsToFetch = currencySymbols.join(',');
        const response = await fetch(`${CURRENCY_API_BASE_URL}key=${CURRENCY_API_KEY}&base=USD&symbols=${symbolsToFetch}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRates(data.rates || {});
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencyRates();

  }, []);

  if (isLoading) {
    return <p>Loading currency rates...</p>;
  }

  if (error) {
    return <p>Error fetching currency rates: {error}</p>;
  }

  return (
    <div className="mt-20 flex overflow-x-auto whitespace-nowrap">
      {currencySymbols.map(currency => (
        <div key={currency} className="">
          <span className="font-semibold">{currency}:</span>{' '}
          <span>{rates[currency] ? rates[currency].toFixed(2) : 'N/A'}</span>
        </div>
      ))}
    </div>
  );
};

export default CurrencyRates;