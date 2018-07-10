const mongoose = require('mongoose');

const BikeStation = mongoose.model('BikeStation');
const WeatherReport = mongoose.model('WeatherReport');

module.exports = app => {
  app.get('/api/v1/stations/', async (req, res) => {
    const query = new Date(req.query.at);
    try {
      const stations = await BikeStation.aggregate([
        {
          $match : {
            "createdAt" : {
              "$gte" : query
            }
          }
        },
        {
          $group : {
            _id: '$properties.kioskId',
            bikeStation: {"$first" : "$$ROOT"},
          }
        }
      ]);
      res.send({
        at: query,
        stations: stations
      });
    } catch (err) {
      console.log(err);
    }
  });
};
