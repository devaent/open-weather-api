const express = require('express');
const request = require('request');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');

const app = express();

require('./models/BikeStation');
require('./models/WeatherReport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/apiRoutes')(app);

const BikeStation = mongoose.model('BikeStation');
const WeatherReport = mongoose.model('WeatherReport');

function getBikeStationData(){
  const url = 'https://www.rideindego.com/stations/json/';
  const promise = new Promise (function (resolve, reject) {
    request.get(url, (err, res, body) => {
      if (err) reject(err);
      features = JSON.parse(body).features;
      features.forEach(feature => {
        const bikeStation = new BikeStation(feature);
        bikeStation.save(function (err) {
          if (err) reject(err);
        });
      });
      resolve(features);
    });
  });
  return promise;
}

function getWeatherReport(lat, lon) {
  const url = 'https://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lon + '&APPID=' + keys.openWeatherMap;
  const promise = new Promise(function (resolve, reject) {
    request.get(url, (err, res, body) => {
      report = JSON.parse(body);
      const weatherReport = new WeatherReport(report);
      weatherReport.save(function (err) {
        if (err) return console.log(err);
      });
      resolve(report);
    });
  });
  return promise;
}

setInterval(async function () {
  try {
    const bikeStations = await getBikeStationData();
    bikeStations.forEach(async function (bikeStation) {
      lat = bikeStation.properties.latitude;
      lon = bikeStation.properties.longitude;
      try{ 
        await getWeatherReport(lat,lon);
      } catch (err) {
        console.log(err);
      }
    })
  } catch (err){
    console.log(err);
  }
}, 1000*60*15);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});

