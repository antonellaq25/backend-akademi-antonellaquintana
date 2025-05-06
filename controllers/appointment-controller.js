const Appointment = require("../models/appointment")

const getAllAppointments = async (req, res) => {
  const { patientId, doctorId } = req.query;

  if (!patientId || !doctorId) {
    return res.status(400).json({ message: "required filters: patientId, doctorId" });
  }

  try {
    const appointments = await Appointment.find({ patientId, doctorId })
      .populate("patientId", "name")
      .populate("doctorId", "name");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name")
      .populate("doctorId", "name");
    if (!appointment) return res.status(404).json({ message: "Could not find appoinment" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, time } = req.body;

  try {
    const createdAppoinment = await Appointment.findOne({ doctorId, date, time });
    if (createdAppoinment) {
      return res.status(400).json({ message: "Shift taken" });
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
  const validStates = ["confirmado", "cancelado"];

  if (!validStates.includes(status)) {
    return res.status(400).json({ message: "Invalid" });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Could not find shift" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
};
