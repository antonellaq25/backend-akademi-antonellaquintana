const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: String,
    required: true, 
  },
  time: {
    type: String,
    required: true, 
  },
  status: {
    type: String,
    enum: ["pendiente", "confirmado", "cancelado"],
    default: "pendiente",
  },
});
const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
