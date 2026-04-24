const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  lu: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['bienvenue', 'hotel', 'info'],
    default: 'info'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);