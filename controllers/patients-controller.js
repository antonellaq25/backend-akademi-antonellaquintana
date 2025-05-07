const Patient = require('../models/patient');

exports.getPatients = async (req, res) => {
  try {
    const { dni, name, coverage, page = 1, limit = 5 } = req.query;

    const filters = {};
    if (dni) filters.dni = dni;
    if (name) filters.name = { $regex: name, $options: 'i' };
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
    const {name,lastName, dni, coverage} = req.body;
    const newDPatient = new Patient({name,lastName, dni, coverage});
    await newDPatient.save();
    res.status(201).json(newDPatient);  
  } catch (err) {
    res.status(400).json({ message: 'Error creating patient', error: err });
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
    const deletedPatient= await Patient.findByIdAndDelete(req.params.id);
    if(!deletedPatient) return res.status(404).json({ message: 'Could not find patient' });
    res.status(200).json(deletedPatient);

  } catch (err) {
    res.status(500).json({ message: 'Error deleting patient', error: err });
  }
};
