"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var imageSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('images ', imageSchema);