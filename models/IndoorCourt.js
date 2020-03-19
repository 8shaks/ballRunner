const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IndoorCourtSchema = new Schema({
  desc: {
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  location: {
    lat:{
        type: Number,
        required: true
    },
    lng:{
        type: Number,
        required: true
    }
  },
  website: {
    type: String,
    required: true
  },
  place_id:{
    type: String,
    required: true
  },
  day:{
    type: Number,
    required: true
  },
  vicinity:{
    type: String,
    required: true
  }
});

module.exports = IndoorCourt = mongoose.model("indoorcourts", IndoorCourtSchema);
