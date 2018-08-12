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
    let at = new Date(req.query.at);
    let from = new Date(req.query.from);
    let to = new Date(req.query.to);
    let frequency = req.query.frequency;
    let kioskId = req.params.kioskId;
    let weatherReportIds = [];

    if (from && to && frequency) {
      const weatherReports = await WeatherReport.find({
        'createdAt' : { '$gte' : from, '$lt' : Date.now() }
      });

      let from = weatherReports[0].createdAt;

      weatherReports.forEach((report, index) => {
        // get dates at frequency
      })

      const stations = await BikeStation.find(
        {
          'properties.kioskId' : kioskId,
          'weatherReportId' : {'$in' : weatherReportIds}
        }
      );
      res.send({
        at: 'error',
        station: stations,
        weather: weatherReports
      });
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
