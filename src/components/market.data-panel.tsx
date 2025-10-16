import React, { useState } from "react";

export default function MarketDataPanel({ onSelect }: { onSelect: (data: { spot: number, volatility: number }) => void }) {
  const [ticker, setTicker] = useState("");
  // Fetch and display market data for ticker, call onSelect when user picks a value
  return (
    <div>
      <input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="Ticker (e.g. AAPL)" />
      <button /* fetch data and call onSelect */>Fetch</button>
    </div>
  );
}