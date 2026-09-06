const express = require('express');
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorStatus,
  getSpecializations
} = require('../controllers/doctorController');
const { getDoctorAvailability } = require('../controllers/appointmentController');
const { doctorValidator } = require('../utils/validators');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/meta/specializations', getSpecializations);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getDoctorAvailability);
router.post('/', protect, authorize('admin'), doctorValidator, createDoctor);
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.put('/:id/status', protect, authorize('admin'), updateDoctorStatus);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
