const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  time: Date
});

module.exports = Data = mongoose.model('data', DataSchema);