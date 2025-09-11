import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/pages/Dashboard';
import FarmManagement from './components/pages/FarmManagement';
import Analytics from './components/pages/AnalyticsPage';
// import MarketPrices from './components/MarketPrices';
// import Weather from './components/Weather';
// import Settings from './components/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farm-management" element={<FarmManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
