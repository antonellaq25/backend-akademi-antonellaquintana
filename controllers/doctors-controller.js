const Doctor = require('../models/doctor');

exports.getDoctors = async (req,res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({message: 'Error getting doctors', error: err});
  }
};
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'could not find doctor' });
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Error getting doctor', error: err });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const {name, speciality, start, end} = req.body;
    const newDoctor = new Doctor({name, speciality, start, end});
    await newDoctor.save();
    res.status(201).json(newDoctor);  
  } catch (err) {
    res.status(400).json({ message: 'Error creating doctor', error: err });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const {name, speciality, start, end} = req.body;
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {name, speciality, start, end},
      {new: true, runValidators: true}
    );
    if (!updatedDoctor) return  res.status(404).json({ message: 'Could not find doctor' });
    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: 'Error updating doctor', error: err });
  }
};
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor disabled successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Error disabling doctor", error });
  }
};
