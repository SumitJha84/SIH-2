const express = require('express');
const weatherController = require('../controller/weatherController');

const router = express.Router();

// GET /api/weather?lat=<latitude>&lon=<longitude>
router.get('/', weatherController.getWeatherByCoordinates);

module.exports = router;
