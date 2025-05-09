const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctors-controller');
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
router.use(auth);

router.get("/report", role("admin"), doctorsController.generateMostRequestedDoctorsReport);

router.get('/', doctorsController.getAllDoctors);
router.get('/filter', doctorsController.getDoctorsByFilters);
router.get('/:id', doctorsController.getDoctorById);
router.post('/',doctorsController.createDoctor);
router.put('/:id',doctorsController.updateDoctor);

module.exports = router;