// utils/api.js

const API_BASE_URL = 'http://127.0.0.1:5000';

export async function getStockData(symbol) {
  const response = await fetch(`${API_BASE_URL}/api/stock_data?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error('Failed to fetch stock data');
  }
  return response.json();
}

export async function makeTrade(tradeData) {
  const response = await fetch(`${API_BASE_URL}/api/trade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tradeData),
  });
  if (!response.ok) {
    throw new Error('Failed to process trade');
  }
  return response.json();
}