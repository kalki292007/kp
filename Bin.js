const mongoose = require('mongoose');
const BinSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }
  },
  fillLevel: { type: Number, default: 0 },
  status: { type: String, default: 'OK' },
  lastUpdated: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} }
});
BinSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Bin', BinSchema);
