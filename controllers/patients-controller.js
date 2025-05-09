const Patient = require('../models/patient');
const Appointment = require("../models/appointment");

exports.getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Patient.countDocuments({});
    const patients = await Patient.find({})
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      results: patients,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching patients", error: err.message });
  }
};


exports.getPatientsByFilters = async (req, res) => {
  try {
    const { dni, name, coverage,email, page = 1, limit = 5 } = req.query;

    const filters = {};
    if (dni) filters.dni = dni;
    if (name) filters.name = { $regex: name, $options: 'i' };
    if (email) filters.email = { $regex: email, $options: 'i' };
    if (coverage) filters.coverage = { $regex: coverage, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Patient.countDocuments(filters);

    const patients = await Patient.find(filters)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      results: patients,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error getting patients', error: err });
  }
};


exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'could not find patient' });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Error getting patient', error: err });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { name, lastName, dni, coverage, email } = req.body;

    const existingPatient = await Patient.findOne({ dni });
    if (existingPatient) {
      return res.status(400).json({
        message: `Patient with DNI ${dni} already exists.`
      });
    }

    const newPatient = new Patient({ name, lastName, dni, email, coverage });
    await newPatient.save();

    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ message: "Error creating patient", error: err });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const {name, dni, coverage} = req.body;
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {name, dni, coverage},
      {new: true, runValidators: true}
    );
    if (!updatedPatient) return  res.status(404).json({ message: 'Could not find patient' });
    res.status(200).json(updatedPatient);
  } catch (err) {
    res.status(400).json({ message: 'Error updating patient', error: err });
  }
};
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    const hasActiveAppointments = await Appointment.exists({
      patientId,
      status: { $ne: "cancelled" }
    });

    if (hasActiveAppointments) {
      return res.status(400).json({
        message: "Cannot delete, pending shift"
      });
    }
    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient successfully deleted",
      data: deletedPatient
    });

  } catch (err) {
    res.status(500).json({ message: "Error deleting patient", error: err });
  }
};
