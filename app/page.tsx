import MainPage from './components/MainPage';

export default async function Page() {
  
  const cryptoRes = await fetch(`http://localhost:3000/api/getCryptoData?coin=bitcoin`);
  if (!cryptoRes.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  const cryptoData = await cryptoRes.json();

  const stockRes = await fetch(`http://localhost:3000/api/getStockData?symbol=AAPL`);
  if (!stockRes.ok) {
    throw new Error('Failed to fetch stock data');
  }
  const stockData = await stockRes.json();

  // pass the data as props to main page and other pages!!!!!!
  return (
    <MainPage
      cryptoData={cryptoData}
      stockData={stockData}
    />
  );
}