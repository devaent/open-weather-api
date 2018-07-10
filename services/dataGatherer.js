const request = require('request');
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const BikeStation = require('../models/BikeStation');
const WeatherReport = require('../models/WeatherReport');

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
  console.log("gathering data");
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
}, 1000);