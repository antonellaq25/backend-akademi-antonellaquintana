const PDFDocument = require("pdfkit");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

exports.getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Doctor.countDocuments({});
    const doctors = await Doctor.find({}).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      results: doctors,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: err.message });
  }
};

exports.getDoctorsByFilters = async (req, res) => {
  try {
    const {
      name,
      speciality,
      start,
      end,
      active,
      page = 1,
      limit = 5,
    } = req.query;
    const filters = {};

    if (name) filters.name = { $regex: name, $options: "i" };
    if (speciality) filters.speciality = { $regex: speciality, $options: "i" };
    if (start) filters.start = { $gte: start };
    if (end) filters.end = { $lte: end };
    if (active !== undefined) filters.active = active === "true";

    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      Doctor.find(filters).skip(Number(skip)).limit(Number(limit)),
      Doctor.countDocuments(filters),
    ]);

    res.status(200).json({
      doctors,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting doctors", error: err });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor)
      return res.status(404).json({ message: "could not find doctor" });
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Error getting doctor", error: err });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, speciality, start, end } = req.body;
    const newDoctor = new Doctor({ name, speciality, start, end });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: "Error creating doctor", error: err });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { name, speciality, start, end, active } = req.body;

    if (doctor.active && active === false) {
      const hasAppointments = await Appointment.exists({
        doctorId: doctor._doctorId,
      });
      if (hasAppointments) {
        return res.status(400).json({
          message: "Cannot disable, has appoinments",
        });
      }
    }
    //doctor.active===false
    if (!doctor.active && typeof active === "undefined") {
      return res.status(403).json({
        message: 'Doctor is disabled. Only "active" status can be updated.',
      });
    }

    const updateFields = {};
    if (doctor.active) {
      if (name !== undefined) updateFields.name = name;
      if (speciality !== undefined) updateFields.speciality = speciality;
      if (start !== undefined) updateFields.start = start;
      if (end !== undefined) updateFields.end = end;
    }
    if (typeof active !== "undefined") {
      updateFields.active = active;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: "Error updating doctor", error: err });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const hasAppointments = await Appointment.exists({ doctorId });

    if (hasAppointments) {
      return res
        .status(400)
        .json({ message: "Doctor cannot be deleted. Appoinment pending." });
    }

    const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting doctor", error: err });
  }
};

exports.generateMostRequestedDoctorsReport = async (req, res) => {
  try {

    const appointments = await Appointment.aggregate([
      { $group: { _id: "$doctorId", totalAppointments: { $sum: 1 } } },
      { $sort: { totalAppointments: -1 } }
    ]);
    console.log(appointments)
   
    const groupedAppoinments = await Promise.all(
      appointments.map(async (appoinment) => {
        const doctor = await Doctor.findById(appoinment._id);
        return {
          name: doctor?.name || "Unknown",
          speciality: doctor?.speciality || "N/A",
          totalAppointments: appoinment.totalAppointments
        };
      })
    );
    console.log(groupedAppoinments)

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=most-requested-doctors.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Most requested doctors", { align: "center" });
    doc.moveDown();

    groupedAppoinments.forEach((docEntry, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. Dr. ${docEntry.name} - ${docEntry.speciality} - Appoinments: ${docEntry.totalAppointments}`);
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};

