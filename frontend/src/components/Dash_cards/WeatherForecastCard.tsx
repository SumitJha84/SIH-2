import React, { useState, useEffect } from 'react';

interface ForecastDay {
  day: string;
  icon: string;
  high: number;
  low: number;
  precipitation: number;
}

interface WeatherCondition {
  icon: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  forecast5Days: ForecastDay[];
}

interface WeatherForecastCardProps {
  // Remove the weather prop since we'll fetch it internally
}

const WeatherForecastCard: React.FC<WeatherForecastCardProps> = () => {
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('');

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
      const data = await response.json();

      if (data.success) {
        setWeather(data.data);
        setLocationName(`${data.location.city}, ${data.location.country}`);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch weather data');
      }
    } catch (error) {
      setError('Network error: Could not fetch weather data');
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to default location (Delhi, India)
        setError('Location access denied. Using default location.');
        fetchWeatherData(28.6139, 77.2090); // Delhi coordinates
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    minHeight: '200px'
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌤️</div>
            <div style={{ color: '#6b7280' }}>Loading weather data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div style={{ color: '#ef4444', marginBottom: '8px' }}>Weather Error</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{error}</div>
            <button 
              onClick={getCurrentLocation}
              style={{ 
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginTop: 0 }}>
        🌦️ Weather & Forecast
      </h3>
      
      {locationName && (
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0' }}>
          📍 {locationName}
        </p>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '64px', marginRight: '20px' }}>{weather.icon}</div>
        <div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>
            {weather.temperature}°C
          </div>
          <div style={{ color: '#6b7280' }}>Humidity: {weather.humidity}%</div>
          <div style={{ color: '#6b7280' }}>Wind: {weather.windSpeed} km/h</div>
        </div>
      </div>
      
      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
        5-Day Forecast
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {weather.forecast5Days.map((day, index) => (
          <div key={index} style={{ textAlign: 'center', padding: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{day.day}</div>
            <div style={{ fontSize: '28px', margin: '8px 0' }}>{day.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{day.high}°/{day.low}°</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>💧 {Math.round(day.precipitation)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecastCard;
