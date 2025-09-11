import React, { useState, useEffect } from 'react';
// import './PerformanceBenchmarking'

interface SeasonData {
  year: string;
  crop: string;
  finalYield: number;
  predictedYield?: number;
}

interface BenchmarkData {
  regionalAverage: number;
  topPerformers: number;
  yourPerformance: number;
  percentile: number;
}

const PerformanceBenchmarking: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<SeasonData[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('corn');

  useEffect(() => {
    // Mock historical data
    const mockHistoricalData: SeasonData[] = [
      { year: '2022', crop: 'corn', finalYield: 4.2 },
      { year: '2023', crop: 'corn', finalYield: 4.6 },
      { year: '2024', crop: 'corn', finalYield: 4.4 },
      { year: '2025', crop: 'corn', finalYield: 0, predictedYield: 4.8 }
    ];

    const mockBenchmarkData: BenchmarkData = {
      regionalAverage: 4.3,
      topPerformers: 5.2,
      yourPerformance: 4.8,
      percentile: 73
    };

    setHistoricalData(mockHistoricalData);
    setBenchmarkData(mockBenchmarkData);
  }, [selectedCrop]);

  const calculatePerformanceTrend = () => {
    if (historicalData.length < 2) return 0;
    const recent = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];
    const recentYield = recent.predictedYield || recent.finalYield;
    return ((recentYield - previous.finalYield) / previous.finalYield) * 100;
  };

  const getPerformanceInsight = (): string => {
    if (!benchmarkData) return '';
    
    const aboveAverage = ((benchmarkData.yourPerformance - benchmarkData.regionalAverage) / benchmarkData.regionalAverage) * 100;
    
    if (aboveAverage > 10) {
      return `Excellent! Your ${selectedCrop} yield is ${Math.abs(aboveAverage).toFixed(1)}% above the regional average. You're in the top ${100 - benchmarkData.percentile}% of farmers in your area.`;
    } else if (aboveAverage > 0) {
      return `Good performance! Your ${selectedCrop} yield is ${aboveAverage.toFixed(1)}% above the regional average for this point in the season.`;
    } else {
      return `Your ${selectedCrop} yield is currently ${Math.abs(aboveAverage).toFixed(1)}% below the regional average. Consider reviewing your current practices.`;
    }
  };

  return (
    <div className="performance-container">
      <div className="performance-header">
        <h2 className="performance-title">
          📊 Performance & Benchmarking
        </h2>
        <select 
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="crop-select"
        >
          <option value="corn">Corn</option>
          <option value="wheat">Wheat</option>
          <option value="rice">Rice</option>
          <option value="soybeans">Soybeans</option>
        </select>
      </div>

      {/* Performance Trend */}
      <div className="performance-trend">
        <h3>Your Performance Trend</h3>
        <div className="trend-value">
          <span className={`trend-indicator ${calculatePerformanceTrend() >= 0 ? 'positive' : 'negative'}`}>
            {calculatePerformanceTrend() >= 0 ? '📈' : '📉'}
          </span>
          <span className="trend-percentage">
            {calculatePerformanceTrend() >= 0 ? '+' : ''}{calculatePerformanceTrend().toFixed(1)}%
          </span>
          <span className="trend-description">vs last season</span>
        </div>
      </div>

      {/* Historical Comparison Chart */}
      <div className="historical-chart">
        <h3>Historical Performance</h3>
        <div className="chart-container">
          <div className="chart-bars">
            {historicalData.map((data, index) => {
              const seasonYield = data.predictedYield || data.finalYield;
              const maxYield = Math.max(...historicalData.map(d => d.predictedYield || d.finalYield));
              const barHeight = (seasonYield / maxYield) * 200;
              
              return (
                <div key={index} className="chart-bar-container">
                  <div 
                    className={`chart-bar ${data.predictedYield ? 'predicted' : 'actual'}`}
                    style={{ height: `${barHeight}px` }}
                  >
                    <span className="bar-value">{seasonYield.toFixed(1)}</span>
                  </div>
                  <span className="bar-label">{data.year}</span>
                </div>
              );
            })}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color actual"></span>
              <span>Actual Yield</span>
            </div>
            <div className="legend-item">
              <span className="legend-color predicted"></span>
              <span>Predicted Yield</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Benchmarking */}
      {benchmarkData && (
        <div className="regional-benchmark">
          <h3>Regional Comparison</h3>
          <div className="benchmark-chart">
            <div className="benchmark-item">
              <span className="benchmark-label">Top Performers</span>
              <div className="benchmark-bar-container">
                <div 
                  className="benchmark-bar top-performers"
                  style={{ width: '100%' }}
                >
                  <span className="benchmark-value">{benchmarkData.topPerformers} t/ha</span>
                </div>
              </div>
            </div>
            
            <div className="benchmark-item highlight">
              <span className="benchmark-label">Your Performance</span>
              <div className="benchmark-bar-container">
                <div 
                  className="benchmark-bar your-performance"
                  style={{ width: `${(benchmarkData.yourPerformance / benchmarkData.topPerformers) * 100}%` }}
                >
                  <span className="benchmark-value">{benchmarkData.yourPerformance} t/ha</span>
                </div>
              </div>
            </div>
            
            <div className="benchmark-item">
              <span className="benchmark-label">Regional Average</span>
              <div className="benchmark-bar-container">
                <div 
                  className="benchmark-bar regional-average"
                  style={{ width: `${(benchmarkData.regionalAverage / benchmarkData.topPerformers) * 100}%` }}
                >
                  <span className="benchmark-value">{benchmarkData.regionalAverage} t/ha</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="percentile-indicator">
            <h4>Your Percentile Ranking</h4>
            <div className="percentile-circle">
              <span className="percentile-value">{benchmarkData.percentile}%</span>
            </div>
            <p>You perform better than {benchmarkData.percentile}% of farmers in your region</p>
          </div>
        </div>
      )}

      {/* Actionable Insights */}
      <div className="insights-card">
        <h3>🎯 Actionable Insights</h3>
        <p className="insight-text">{getPerformanceInsight()}</p>
        
        <div className="improvement-suggestions">
          <h4>Suggested Improvements:</h4>
          <ul>
            <li>🌱 Consider increasing nitrogen application by 10-15% based on soil test results</li>
            <li>💧 Optimize irrigation timing using weather forecast data</li>
            <li>🔍 Monitor pest activity more closely during growth phase</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceBenchmarking;
