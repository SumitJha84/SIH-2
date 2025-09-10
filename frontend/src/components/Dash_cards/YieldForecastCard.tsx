import React from 'react';

interface Plot {
  id: number;
  name: string;
  status: 'green' | 'yellow' | 'red';
  cropType: string;
  plantingDate: string;
  yieldForecast: number;
  area: number; // in hectares
}

interface YieldForecastCardProps {
  plots: Plot[];
  selectedYieldPlot: string;
  setSelectedYieldPlot: (plotName: string) => void;
  overallYield: number;
  yieldTrend: number;
}

const YieldForecastCard: React.FC<YieldForecastCardProps> = ({ 
  plots, 
  selectedYieldPlot, 
  setSelectedYieldPlot, 
  overallYield, 
  yieldTrend 
}) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const getSelectedPlotYield = (): number => {
    if (selectedYieldPlot === 'Overall') return overallYield;
    const plot = plots.find(p => p.name === selectedYieldPlot);
    return plot?.yieldForecast || 0;
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginTop: 0 }}>
        📈 Season Yield Forecast
      </h3>

      <select
        value={selectedYieldPlot}
        onChange={e => setSelectedYieldPlot(e.target.value)}
        style={{
          marginBottom: '20px',
          padding: '12px 16px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          fontSize: '16px',
          width: '100%',
          maxWidth: '300px',
          backgroundColor: '#ffffff'
        }}
      >
        <option value="Overall">Overall Farm</option>
        {plots.map(plot => (
          <option key={plot.id} value={plot.name}>
            {plot.name} ({plot.cropType})
          </option>
        ))}
      </select>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }}>
          {getSelectedPlotYield()} tons/hectare
        </div>
        
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: yieldTrend >= 0 ? '#10b981' : '#ef4444'
        }}>
          {yieldTrend >= 0 ? '▲' : '▼'} {Math.abs(yieldTrend)}% since last week
        </div>
        
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '8px'
        }}>
          {selectedYieldPlot === 'Overall' ? 'Total farm productivity' : `${selectedYieldPlot} performance`}
        </div>
      </div>
    </div>
  );
};

export default YieldForecastCard;
