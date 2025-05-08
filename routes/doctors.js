const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctors-controller');
const auth = require("../middlewares/authMiddleware");
router.use(auth);

router.get('/', doctorsController.getDoctors);
router.get('/:id', doctorsController.getDoctorById);
router.post('/',doctorsController.createDoctor);
router.put('/:id',doctorsController.updateDoctor);

module.exports = router;