const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  timezone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, required: true },
  deleted: { type: Boolean, default: false },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
