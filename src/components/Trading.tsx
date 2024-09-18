import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getStockData, makeTrade } from '../utils/api';


// I have no clue what this is 

interface Portfolio {
  balance: number;
  positions: {
    [symbol: string]: number;
  };
}


export default function Trading() {
  const [stockData, setStockData] = useState({ symbol: '', bid: 0, ask: 0, last: 0 });
  const [portfolio, setPortfolio] = useState<Portfolio>({ balance: 100000, positions: {} });
  const [symbol, setSymbol] = useState('AAPL');
  const [volume, setVolume] = useState(1);
  const [tradeType, setTradeType] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = useCallback(async () => {
    try {
      const data = await getStockData(symbol);
      setStockData(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data.';
      setError(errorMessage);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const handleTrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedPortfolio = await makeTrade({ symbol, volume, type: tradeType });
      setPortfolio(updatedPortfolio);
      await fetchStockData(); // Refetch stock data after successful trade
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to make trade.';
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Virtual Trading Simulator</h1>
      <div>
        <label>
          Symbol:
          <input 
            type="text" 
            value={symbol} 
            onChange={e => setSymbol(e.target.value.toUpperCase())} 
            maxLength={5}
          />
        </label>
        <button onClick={fetchStockData}>Fetch Stock Data</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Stock Data</h2>
        <p>Symbol: {stockData.symbol}</p>
        <p>Bid: {stockData.bid}</p>
        <p>Ask: {stockData.ask}</p>
        <p>Last: {stockData.last}</p>
      </div>
      <div>
        <h2>Trade</h2>
        <label>
          Volume:
          <input 
            type="number" 
            value={volume} 
            onChange={e => setVolume(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
          />
        </label>
        <label>
          Type:
          <select value={tradeType} onChange={e => setTradeType(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <button onClick={handleTrade} disabled={loading}>
          {loading ? 'Processing...' : 'Execute Trade'}
        </button>
      </div>
      <div>
        <h2>Portfolio</h2>
        <p>Balance: ${portfolio.balance.toFixed(2)}</p>
        <h3>Positions:</h3>
        <ul>
          {Object.entries(portfolio.positions).map(([sym, vol]) => (
            <li key={sym}>{sym}: {vol} shares</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
