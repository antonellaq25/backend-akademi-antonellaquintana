const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentByFilters,
  createAppointment,
  updateAppointmentStatus,
  getAppointmentById
} = require("../controllers/appointment-controller");

router.get("/", getAllAppointments);
router.get("/filter", getAppointmentByFilters);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.patch("/:id", updateAppointmentStatus);

module.exports = router;