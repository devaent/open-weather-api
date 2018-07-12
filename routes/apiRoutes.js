const mongoose = require('mongoose');

const BikeStation = mongoose.model('BikeStation');
const WeatherReport = mongoose.model('WeatherReport');

module.exports = app => {
  app.get('/api/v1/stations/', async (req, res) => {
    const query = new Date(req.query.at);
    try {
      const weatherReport = await WeatherReport.findOne({ 'createdAt' : {'$gte' : query} });
      const stations = await BikeStation.find({'weatherReportId' : weatherReport._id});

      res.send({
        at: query,
        stations: stations,
        weather: weatherReport
      });

    } catch (err) {
      console.log(err);
    }
  });

  app.get('/api/v1/stations/:kioskId', async (req, res) => {
    const at = new Date(req.query.at);
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const frequency = req.query.frequency;
    const kioskId = req.params.kioskId;

    if (from && to && frequency) {
      const station = await BikeStation.find(
        {
          'properties.kioskId' : kioskId,
          'createdAt' : {'$gte' : from, '$lt' : to}
        }
      )
    }

    else if (at) {
      const weatherReport = await WeatherReport.findOne({ 'createdAt' : {'$gte' : at} });
      const station = await BikeStation.findOne(
        { 
          'properties.kioskId' : kioskId,
          'weatherReportId' : weatherReport._id
        }
      );

      res.send({
        at: at,
        station: station,
        weather: weatherReport
      });
    }
  });
};
