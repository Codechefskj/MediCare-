const express = require('express');
const { getPatients, updatePatientStatus } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), getPatients);
router.put('/:id/status', protect, authorize('admin'), updatePatientStatus);

module.exports = router;
