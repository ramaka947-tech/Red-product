const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  prixParNuit: {
    type: Number,
    required: true
  },
  devise: {
    type: String,
    default: 'XOF'
  },
  photo: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);