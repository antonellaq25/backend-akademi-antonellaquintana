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
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { name, speciality, start, end, active } = req.body;

    if (!doctor.active && typeof active === 'undefined') {
      return res.status(403).json({ 
        message: 'Doctor is disabled. Only "active" status can be updated.'
      });
    }

    const updateFields = {};
    if (doctor.active) {
      if (name !== undefined) updateFields.name = name;
      if (speciality !== undefined) updateFields.speciality = speciality;
      if (start !== undefined) updateFields.start = start;
      if (end !== undefined) updateFields.end = end;
    }
    if (typeof active !== 'undefined') {
      updateFields.active = active;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: 'Error updating doctor', error: err });
  }
};

