const mongoose = require('mongoose');
const { Schema } = mongoose;

const bikeStationSchema = new Schema(
  { 
    properties:
    { addressStreet: String,
      addressCity: String,
      addressState: String,
      addressZipCode: String,
      bikesAvailable: Number,
      closeTime: String,
      docksAvailable: Number,
      kioskId: Number,
      kioskPublicStatus: String,
      kioskStatus: String,
      name: String,
      openTime: String,
      timeZone: String,
      totalDocks: Number,
      trikesAvailable: Number,
      kioskConnectionStatus: String,
      kioskType: Number,
      latitude: Number,
      longitude: Number,
      hasGeofence: Boolean,
      classicBikesAvailable: Number,
      smartBikesAvailable: Number },
    type: String,
    createdAt: { type: Date, default: Date.now },
    weatherReportId: String
  }
);

module.exports = mongoose.model('BikeStation', bikeStationSchema);
