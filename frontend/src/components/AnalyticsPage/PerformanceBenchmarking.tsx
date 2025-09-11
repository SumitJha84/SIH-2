import React, { useState, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
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


// --- THE COMPONENT ---
const PerformanceBenchmarking: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<SeasonData[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('corn');

  useEffect(() => {
    // This is where you would fetch data from your API.
    // For now, we'll use the mock data.
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
    if (historicalData.length < 2) return { value: 0, isPositive: true };
    const recent = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];
    const recentYield = recent.predictedYield || recent.finalYield;
    const value = ((recentYield - previous.finalYield) / previous.finalYield) * 100;
    return { value, isPositive: value >= 0 };
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

  const performanceTrend = calculatePerformanceTrend();
  const percentileDegrees = benchmarkData ? benchmarkData.percentile * 3.6 : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-5 border-b-2 border-gray-100 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 m-0">
          📊 Performance & Benchmarking
        </h2>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="p-2 px-4 rounded-lg border-2 border-gray-300 bg-white text-sm font-medium text-gray-600 cursor-pointer transition-all min-w-[140px] w-full md:w-auto hover:border-emerald-500 focus:outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/10"
        >
          <option value="corn">Corn</option>
          <option value="wheat">Wheat</option>
          <option value="rice">Rice</option>
          <option value="soybeans">Soybeans</option>
        </select>
      </div>

      {/* Performance Trend */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8 border-2 border-indigo-200 text-center">
        <h3 className="text-lg font-bold text-indigo-800 mb-4">Your Performance Trend</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 flex-wrap">
          <span className="text-4xl">{performanceTrend.isPositive ? '📈' : '📉'}</span>
          <span className={`text-4xl font-extrabold ${performanceTrend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {performanceTrend.isPositive ? '+' : ''}{performanceTrend.value.toFixed(1)}%
          </span>
          <span className="text-base text-gray-500 font-semibold">vs last season</span>
        </div>
      </div>

      {/* Historical Comparison Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-5">Historical Performance</h3>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-end justify-around h-60 mb-5 px-2 md:px-5 gap-3">
            {historicalData.map((data, index) => {
              const seasonYield = data.predictedYield || data.finalYield;
              const maxYield = Math.max(...historicalData.map(d => d.predictedYield || d.finalYield), 1);
              const barHeight = (seasonYield / maxYield) * 100;
              return (
                <div key={index} className="flex flex-col items-center min-w-[50px] md:min-w-[60px] text-center">
                  <div
                    className={`w-8 md:w-10 rounded-t-md flex items-start justify-center pt-2 relative transition-all cursor-pointer hover:scale-105 hover:shadow-xl ${data.predictedYield ? 'bg-gradient-to-b from-blue-500 to-blue-700 border-2 border-dashed border-white' : 'bg-gradient-to-b from-emerald-500 to-emerald-700'}`}
                    style={{ height: `${barHeight}%`, minHeight: '40px' }}
                  >
                    <span className="text-white text-xs font-bold drop-shadow-md">{seasonYield.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold mt-2">{data.year}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm"><span className="w-4 h-4 rounded-sm bg-gradient-to-b from-emerald-500 to-emerald-700"></span>Actual Yield</div>
            <div className="flex items-center gap-2 text-sm"><span className="w-4 h-4 rounded-sm bg-gradient-to-b from-blue-500 to-blue-700 border-2 border-dashed border-blue-800"></span>Predicted Yield</div>
          </div>
        </div>
      </div>

      {/* Regional Benchmarking & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {benchmarkData && (
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Regional Comparison</h3>
            <div className="space-y-4 mb-6">
              {/* Top Performers Bar */}
              <div>
                <span className="block text-sm font-semibold text-gray-600 mb-2">Top Performers</span>
                <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div className="h-full flex items-center justify-end pr-3 rounded-full bg-gradient-to-r from-amber-200 to-amber-500" style={{ width: '100%' }}>
                    <span className="text-xs font-bold text-white drop-shadow-md">{benchmarkData.topPerformers} t/ha</span>
                  </div>
                </div>
              </div>
              {/* Your Performance Bar */}
              <div className="bg-white p-4 rounded-lg border-2 border-emerald-500 shadow-sm">
                <span className="block text-sm font-semibold text-gray-600 mb-2">Your Performance (Predicted)</span>
                <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div className="h-full flex items-center justify-end pr-3 rounded-full bg-gradient-to-r from-emerald-200 to-emerald-500 transition-width duration-700 ease-out" style={{ width: `${(benchmarkData.yourPerformance / benchmarkData.topPerformers) * 100}%` }}>
                    <span className="text-xs font-bold text-white drop-shadow-md">{benchmarkData.yourPerformance} t/ha</span>
                  </div>
                </div>
              </div>
              {/* Regional Average Bar */}
              <div>
                <span className="block text-sm font-semibold text-gray-600 mb-2">Regional Average</span>
                <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div className="h-full flex items-center justify-end pr-3 rounded-full bg-gradient-to-r from-red-200 to-red-500 transition-width duration-700 ease-out" style={{ width: `${(benchmarkData.regionalAverage / benchmarkData.topPerformers) * 100}%` }}>
                    <span className="text-xs font-bold text-white drop-shadow-md">{benchmarkData.regionalAverage} t/ha</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Percentile Indicator */}
            <div className="text-center bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="text-base font-bold text-gray-800 mb-4">Your Percentile Ranking</h4>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative" style={{ background: `conic-gradient(#10B981 0deg ${percentileDegrees}deg, #E5E7EB ${percentileDegrees}deg 360deg)` }}>
                <div className="w-[60px] h-[60px] bg-white rounded-full absolute"></div>
                <span className="text-lg font-extrabold text-emerald-600 relative z-10">{benchmarkData.percentile}%</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">You perform better than {benchmarkData.percentile}% of farmers in your region.</p>
            </div>
          </div>
        )}

        {/* Actionable Insights */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-2 border-emerald-200">
          <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">🎯 Actionable Insights</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-5 font-medium">{getPerformanceInsight()}</p>
          <div>
            <h4 className="text-base font-bold text-emerald-700 mb-3">Suggested Improvements:</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700 font-medium flex items-start gap-2">🌱<span>Consider increasing nitrogen application by 10-15% based on soil test results.</span></li>
              <li className="text-sm text-gray-700 font-medium flex items-start gap-2">💧<span>Optimize irrigation timing using weather forecast data.</span></li>
              <li className="text-sm text-gray-700 font-medium flex items-start gap-2">🔍<span>Monitor pest activity more closely during the growth phase.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceBenchmarking;