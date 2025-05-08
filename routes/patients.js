const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients-controller');
const auth = require("../middlewares/authMiddleware");
router.use(auth);

router.get('/', patientsController.getPatients);
router.get('/:id', patientsController.getPatientById);
router.post('/',patientsController.createPatient);
router.put('/:id',patientsController.updatePatient);
router.delete('/:id', patientsController.deletePatient);

module.exports = router;