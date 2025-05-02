const mongoose = require('mongoose');

const eclipseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['total', 'partial', 'annular', 'hybrid'],
    required: true
  },
  path: {
    coordinates: [{
      latitude: Number,
      longitude: Number
    }],
    width: Number // in kilometers
  },
  phases: {
    firstContact: Date,
    secondContact: Date,
    maximum: Date,
    thirdContact: Date,
    fourthContact: Date
  },
  duration: {
    total: Number, // in seconds
    partial: Number // in seconds
  },
  magnitude: Number,
  obscuration: Number, // percentage
  locationData: [{
    location: {
      latitude: Number,
      longitude: Number
    },
    phases: {
      firstContact: Date,
      secondContact: Date,
      maximum: Date,
      thirdContact: Date,
      fourthContact: Date
    },
    duration: {
      total: Number,
      partial: Number
    },
    magnitude: Number,
    obscuration: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient date-based queries
eclipseSchema.index({ date: 1 });

module.exports = mongoose.model('Eclipse', eclipseSchema); 