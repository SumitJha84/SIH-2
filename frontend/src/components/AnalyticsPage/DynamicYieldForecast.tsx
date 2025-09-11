import React, { useState, useEffect } from 'react';
import './DynamicYieldForecast.css'

interface ForecastData {
  date: string;
  predictedYield: number;
  confidenceMin: number;
  confidenceMax: number;
}

interface EventMarker {
  date: string;
  type: 'fertilization' | 'irrigation' | 'rainfall' | 'pest-control';
  icon: string;
  description: string;
}

const DynamicYieldForecast: React.FC = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [events, setEvents] = useState<EventMarker[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'30' | '60' | '90'>('60');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockForecastData: ForecastData[] = [
      { date: '2025-07-01', predictedYield: 4.2, confidenceMin: 3.8, confidenceMax: 4.6 },
      { date: '2025-07-15', predictedYield: 4.4, confidenceMin: 4.0, confidenceMax: 4.8 },
      { date: '2025-08-01', predictedYield: 4.3, confidenceMin: 3.9, confidenceMax: 4.7 },
      { date: '2025-08-15', predictedYield: 4.6, confidenceMin: 4.2, confidenceMax: 5.0 },
      { date: '2025-09-01', predictedYield: 4.7, confidenceMin: 4.3, confidenceMax: 5.1 },
      { date: '2025-09-11', predictedYield: 4.8, confidenceMin: 4.4, confidenceMax: 5.2 }
    ];

    const mockEvents: EventMarker[] = [
      { date: '2025-07-10', type: 'fertilization', icon: '🌱', description: 'NPK Fertilizer Applied' },
      { date: '2025-07-25', type: 'rainfall', icon: '🌧️', description: 'Heavy Rainfall (45mm)' },
      { date: '2025-08-05', type: 'irrigation', icon: '💧', description: 'Drip Irrigation' },
      { date: '2025-08-20', type: 'pest-control', icon: '🐛', description: 'Pest Control Treatment' }
    ];

    setForecastData(mockForecastData);
    setEvents(mockEvents);
  }, [selectedTimeRange]);

  const currentYield = forecastData[forecastData.length - 1]?.predictedYield || 0;
  const yieldTrend = forecastData.length > 1 ? 
    currentYield - forecastData[forecastData.length - 2].predictedYield : 0;

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h2 className="forecast-title">
          📈 Dynamic Yield Forecast
        </h2>
        <div className="forecast-controls">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as '30' | '60' | '90')}
            className="forecast-time-select"
          >
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Current Yield Summary */}
      <div className="forecast-summary">
        <div className="forecast-current-yield">
          <h3>{currentYield.toFixed(1)} tons/hectare</h3>
          <p className={`forecast-trend ${yieldTrend >= 0 ? 'positive' : 'negative'}`}>
            {yieldTrend >= 0 ? '▲' : '▼'} {Math.abs(yieldTrend).toFixed(1)}% from last update
          </p>
        </div>
        <div className="forecast-confidence">
          <h4>Confidence Range</h4>
          <p>{forecastData[forecastData.length - 1]?.confidenceMin.toFixed(1)} - {forecastData[forecastData.length - 1]?.confidenceMax.toFixed(1)} tons/hectare</p>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="forecast-graph">
        <svg width="100%" height="300" viewBox="0 0 800 300">
          {/* Graph lines and confidence area would go here */}
          {/* This is a simplified representation - you'd use a proper charting library */}
          <defs>
            <linearGradient id="confidenceArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map(i => (
            <line key={i} x1="50" y1={i * 50} x2="750" y2={i * 50} stroke="#E5E7EB" strokeWidth="1"/>
          ))}
          
          {/* Sample forecast line */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            points="50,200 200,180 350,190 500,160 650,150 750,140"
          />
          
          {/* Event markers */}
          {events.map((event, index) => (
            <g key={index}>
              <circle cx={150 + index * 150} cy={200 - index * 10} r="8" fill="#059669"/>
              <text x={150 + index * 150} y={230} textAnchor="middle" className="event-label">
                {event.icon}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Event Timeline */}
      <div className="forecast-events">
        <h4>Key Events This Season</h4>
        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-item">
              <span className="event-icon">{event.icon}</span>
              <div className="event-details">
                <span className="event-description">{event.description}</span>
                <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicYieldForecast;
