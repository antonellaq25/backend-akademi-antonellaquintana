const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  start: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
  },
  end: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/ 
  },
  active: { type: Boolean, default: true }
},{ timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
