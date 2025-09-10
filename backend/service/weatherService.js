const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Weather API error: ${error.message}`);
    }
  }

  async getFiveDayForecast(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Forecast API error: ${error.message}`);
    }
  }

  formatWeatherData(currentWeather, forecast) {
    // Get weather icon mapping
    const getWeatherEmoji = (iconCode) => {
      const iconMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '🌨️', '13n': '🌨️',
        '50d': '🌫️', '50n': '🌫️'
      };
      return iconMap[iconCode] || '☀️';
    };

    // Format 5-day forecast (take one reading per day around noon)
    const dailyForecasts = [];
    const processedDates = new Set();
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      const hour = date.getHours();
      
      // Take the forecast around noon (12:00) for each day, max 5 days
      if (!processedDates.has(dateKey) && hour >= 12 && hour <= 15 && dailyForecasts.length < 5) {
        processedDates.add(dateKey);
        dailyForecasts.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          icon: getWeatherEmoji(item.weather[0].icon),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          precipitation: item.pop * 100 // Convert to percentage
        });
      }
    });

    return {
      icon: getWeatherEmoji(currentWeather.weather[0].icon),
      temperature: Math.round(currentWeather.main.temp),
      humidity: currentWeather.main.humidity,
      windSpeed: Math.round(currentWeather.wind.speed * 3.6), // Convert m/s to km/h
      forecast5Days: dailyForecasts
    };
  }
}

module.exports = new WeatherService();
