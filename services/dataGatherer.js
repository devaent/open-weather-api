const request = require('request');
const mongoose = require('mongoose');

const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const BikeStation = require('../models/BikeStation');
const WeatherReport = require('../models/WeatherReport');

function gatherData(){
  const bikeUrl = 'https://www.rideindego.com/stations/json/';
  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=19102&APPID=' + keys.openWeatherMap;
  let weatherReport
  const promise = new Promise (async function (resolve, reject) {
    await request.get(weatherUrl, (err, res, body) => {
      report = JSON.parse(body);
      weatherReport = new WeatherReport(report);
      weatherReport.save(function (err) {
        if (err) return console.log(err);
      });
      resolve(report);
    });
    await request.get(bikeUrl, (err, res, body) => {
      if (err) reject(err);
      features = JSON.parse(body).features;
      features.forEach(feature => {
        feature.weatherReportId = weatherReport._id;
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

gatherData();

setInterval(async function () {
  console.log('Gathering data...')
  gatherData();
}, 1000*60*5);
