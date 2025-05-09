const express = require("express");
const router = express.Router();
const appoinmentController = require('../controllers/appointment-controller');

const auth = require("../middlewares/authMiddleware");
router.use(auth);
router.get("/", appoinmentController.getAllAppointments);
router.get("/filter", appoinmentController.getAppointmentByFilters);
router.get("/:id", appoinmentController.getAppointmentById);
router.post("/", appoinmentController.createAppointment);
router.patch("/:id", appoinmentController.updateAppointmentStatus);

module.exports = router;