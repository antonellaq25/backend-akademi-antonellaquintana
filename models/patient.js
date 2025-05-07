const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: Number, required: true },
  coverage:  { type: String, required: true },
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
