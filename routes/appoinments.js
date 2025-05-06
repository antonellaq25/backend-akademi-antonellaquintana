const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus
} = require("../controllers/appointment-controller");

router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.patch("/:id", updateAppointmentStatus);

module.exports = router;