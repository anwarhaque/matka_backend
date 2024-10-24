const mongoose = require('mongoose');

const userCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, required: true },
});

const UserCounter = mongoose.model('UserCounter', userCounterSchema);
module.exports = UserCounter;