import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "CAD", name: "Canadian Dollar", symbol: "$", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", symbol: "$", flag: "🇦🇺" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  ];

  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadHistory();
  }, []);

  async function convertCurrency() {
    setLoading(true);
    setError("");
    setResult(null);

    const number = Number(amount);

    if (number <= 0) {
      setError("Amount must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/convert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to,
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.from ||
          data.to ||
          data.amount ||
          data.error || "Something went wrong with the conversion."
        );
      }

      setResult(data);
      loadHistory();

    } catch (error) {
        setResult(null);
        setError(error.message);
    
    } finally {
        setLoading(false);
    }
  }

  async function loadHistory() {
    const response = await fetch(
      `${API_URL}/history`
    );

    const data = await response.json();

    setHistory(data);
  }

  async function deleteHistory(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversion?"
    );

    if (!confirmed) {
      return;
    }

    await fetch(
      `${API_URL}/history/${id}`,
      {
        method: "DELETE",
      }
    );

    loadHistory();
  }

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
  }

  function getCurrency(code) {
    return currencies.find((currency) => currency.code === code);
  }

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <h1>Currency Converter</h1>
          <p>Convert currencies quickly using live exchange rates.</p>
        </header>

        <div className="converter-card">

          <div className="inputs">

            <div className="field">
              <label>From</label>

              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="swap-container">
              <button
                className="swap-button"
                onClick={swapCurrencies}
              >
                ⇄
              </button>
            </div>

            <div className="field">
              <label>To</label>

              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="field amount-field">
            <label>Amount</label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            className="convert-button"
            onClick={convertCurrency}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert"}
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {result && !error && (
            <div className="result">

              <div className="result-amount">
                {getCurrency(result.fromCurrency)?.symbol}
                {result.amount} {result.fromCurrency}
              </div>

              <div className="result-equals">
                =
              </div>

              <div className="result-amount">
                {getCurrency(result.toCurrency)?.symbol}
                {result.convertedAmount} {result.toCurrency}
              </div>

              <div className="rate">
                Exchange Rate: {result.exchangeRate}
              </div>

            </div>
          )}

        </div>

        {history.length > 0 && (
          <div className="history-card">

            <h2>Conversion History</h2>

            <table className="history-table">

              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Converted</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.fromCurrency}</td>
                    <td>{item.toCurrency}</td>
                    <td>{item.amount}</td>
                    <td>{item.convertedAmount}</td>
                    <td>
                      {new Date(item.timestamp).toLocaleString()}
                    </td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteHistory(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
