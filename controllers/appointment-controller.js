const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name dni")
      .populate("doctorId", "name speciality");

    res.status(200).json(appointments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: err.message });
  }
};
const getAppointmentByFilters = async (req, res) => {
  const { patientId, doctorId } = req.query;

  if (!patientId || !doctorId) {
    return res
      .status(400)
      .json({ message: "required filters: patientId, doctorId" });
  }

  try {
    const appointments = await Appointment.find({ patientId, doctorId })
      .populate("patientId", "name dni")
      .populate("doctorId", "name speciality");

    res.status(200).json(appointments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: err.message });
  }
};
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name dni")
      .populate("doctorId", "name speciality");
    if (!appointment)
      return res.status(404).json({ message: "Could not find shift" });
    res.status(200).json(appointment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: err.message });
  }
};
const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, time } = req.body;

  try {
    const existingAppointment = await Appointment.findOne({ doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: "Shift taken" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.active) {
      return res.status(404).json({ message: "Doctor not available" });
    }

    const isTimeValid = time >= doctor.start && time <= doctor.end;
    if (!isTimeValid) {
      return res.status(400).json({
        message: `Doctor is available from ${doctor.start} to ${doctor.end}`,
      });
    }
    const newAppointment = new Appointment({ patientId, doctorId, date, time });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const validStates = ["confirmed", "cancelled"];

  if (!validStates.includes(status)) {
    return res.status(400).json({ message: "Invalid" });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Could not find shift" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentByFilters,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
};
