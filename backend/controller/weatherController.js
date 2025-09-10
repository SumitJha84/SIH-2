const weatherService = require('../service/weatherService');

class WeatherController {
  async getWeatherByCoordinates(req, res) {
    try {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        return res.status(400).json({
          error: 'Latitude and longitude are required'
        });
      }

      // Validate coordinates
      if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return res.status(400).json({
          error: 'Invalid coordinates provided'
        });
      }

      // Fetch current weather and forecast
      const [currentWeather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon),
        weatherService.getFiveDayForecast(lat, lon)
      ]);

      // Format the data to match your frontend interface
      const formattedData = weatherService.formatWeatherData(currentWeather, forecast);

      res.json({
        success: true,
        data: formattedData,
        location: {
          city: currentWeather.name,
          country: currentWeather.sys.country,
          coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) }
        }
      });

    } catch (error) {
      console.error('Weather fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch weather data',
        message: error.message
      });
    }
  }
}

module.exports = new WeatherController();
