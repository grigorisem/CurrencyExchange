import './App.css';
import { useEffect, useState } from 'react';
import logo from './assets/img/logo.png';
function App() {
  return (
    <div className='home'>
      <CurrencyConverter/>
    </div>
  );
}

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [isTypingFrom, setIsTypingFrom] = useState(true);
  const [currencies, setCurrencies] = useState([]);

  const getImageURL = (currencyCode) =>
    `https://wise.com/public-resources/assets/flags/rectangle/${currencyCode.toLowerCase()}.png`;

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (Object.keys(rates).length) {
      convert();
    }
  }, [fromCurrency, toCurrency, fromAmount, toAmount, isTypingFrom]);

  const fetchRates = async () => {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      setRates(data.rates);
      setCurrencies(Object.keys(data.rates));
    } catch (error) {
      console.error("Ошибка при получении курсов:", error);
    }
  };

  const convert = () => {
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (!fromRate || !toRate) return;

    if (isTypingFrom) {
      const usd = fromAmount / fromRate;
      const result = usd * toRate;
      setToAmount(result > 0 ? result.toFixed(2) : 0);
    } else {
      const usd = toAmount / toRate;
      const result = usd * fromRate;
      setFromAmount(result > 0 ? result.toFixed(2) : 0);
    }
  };

  const handleFromAmountChange = (e) => {
    setIsTypingFrom(true);
    const value = parseFloat(e.target.value);
    setFromAmount(isNaN(value) ? 0 : value);
  };

  const handleToAmountChange = (e) => {
    setIsTypingFrom(false);
    const value = parseFloat(e.target.value);
    setToAmount(isNaN(value) ? 0 : value);
  };

  return (
    <div className="converter-container">
      <header>
        <div className="header-inner">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="company-name">XchangeOrg</div>
          </div>
      </header>

      <main className="content">
        <div className='form'>
          <div className="form-inner">
          <p>Обмен валют</p>

          <div className="from">
            <img src={getImageURL(fromCurrency)} alt="From flag" className="flag" />
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0"
              value={fromAmount}
              onChange={handleFromAmountChange}
            />
          </div>

          <div className="to">
            <img src={getImageURL(toCurrency)} alt="To flag" className="flag" />
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {currencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0"
              value={toAmount}
              onChange={handleToAmountChange}
            />
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};




export default App;
